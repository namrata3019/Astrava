import { randomBytes } from 'node:crypto'
import express, {
  type Request,
  type RequestHandler,
  type Response,
} from 'express'
import rateLimit from 'express-rate-limit'
import type { Pool } from 'pg'
import { z } from 'zod'
import {
  encryptedVaultEnvelopeSchema,
  loginSchema,
  recoverySchema,
  registerSchema,
  vaultSaveSchema,
  type AccountSummary,
} from './types.ts'
import {
  createSessionToken,
  hashCredential,
  hashSessionToken,
  verifyCredential,
} from './security.ts'

const sessionCookie = 'astrava_session'
const sessionDurationMs = 14 * 24 * 60 * 60 * 1000
const envelopeSizeLimitBytes = 1_000_000
const accountIdSchema = z.string().uuid()
const dummyCredentialHash = hashCredential(
  randomBytes(32).toString('base64url'),
)

function getAccountId(response: Response) {
  const accountId = response.locals.accountId
  if (!accountId) throw new Error('Authenticated request has no account id.')
  return accountId
}

function isLoopbackOrigin(value: string) {
  try {
    const url = new URL(value)
    return (
      url.protocol === 'http:'
      && (url.hostname === 'localhost' || url.hostname === '127.0.0.1')
    )
  } catch {
    return false
  }
}

function getSessionToken(request: Request) {
  const cookie = request.headers.cookie
    ?.split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${sessionCookie}=`))

  return cookie?.slice(sessionCookie.length + 1)
}

function setSessionCookie(response: Response, token: string) {
  response.cookie(sessionCookie, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/api',
    maxAge: sessionDurationMs,
  })
}

function clearSessionCookie(response: Response) {
  response.clearCookie(sessionCookie, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/api',
  })
}

function validRequestOrigin(request: Request) {
  const origin = request.get('origin')

  if (!origin) return false

  if (process.env.NODE_ENV !== 'production') {
    return isLoopbackOrigin(origin)
  }

  return origin === process.env.APP_ORIGIN
}

function guardRequestOrigin(): RequestHandler {
  return (request, response, next) => {
    if (!validRequestOrigin(request)) {
      response.status(403).json({ error: 'Request origin is not allowed.' })
      return
    }

    next()
  }
}

async function createAuthenticatedSession(
  pool: Pool,
  response: Response,
  accountId: string,
) {
  const token = createSessionToken()
  const expiresAt = new Date(Date.now() + sessionDurationMs)
  await pool.query(
    `INSERT INTO sessions (token_hash, account_id, expires_at)
     VALUES ($1, $2, $3)`,
    [hashSessionToken(token), accountId, expiresAt],
  )
  setSessionCookie(response, token)
}

function requireAuthentication(pool: Pool): RequestHandler {
  return async (request, response, next) => {
    const token = getSessionToken(request)

    if (!token) {
      response.status(401).json({ error: 'Sign in to continue.' })
      return
    }

    const result = await pool.query<{ account_id: string }>(
      `SELECT account_id
       FROM sessions
       WHERE token_hash = $1 AND expires_at > now()`,
      [hashSessionToken(token)],
    )
    const accountId = result.rows[0]?.account_id

    if (!accountId || !accountIdSchema.safeParse(accountId).success) {
      response.status(401).json({ error: 'Sign in to continue.' })
      return
    }

    response.locals.accountId = accountId
    next()
  }
}

function validateEnvelopeSize(envelope: unknown) {
  return Buffer.byteLength(JSON.stringify(envelope), 'utf8') <= envelopeSizeLimitBytes
}

export function createApiApp(pool: Pool) {
  const app = express()
  const authRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    handler: (_request, response) => {
      response.status(429).json({
        error: 'Too many account attempts. Wait a little and try again.',
      })
    },
  })
  const originGuard = guardRequestOrigin()
  const requireAuth = requireAuthentication(pool)

  app.disable('x-powered-by')
  app.use((_request, response, next) => {
    response.setHeader('Cache-Control', 'no-store')
    next()
  })
  app.use(express.json({ limit: '1mb', strict: true }))

  app.get('/api/health', (_request, response) => {
    response.json({ status: 'ok' })
  })

  app.post('/api/auth/register', originGuard, authRateLimit, async (request, response) => {
    const parsed = registerSchema.safeParse(request.body)

    if (!parsed.success) {
      response.status(400).json({ error: 'Check the account and vault details.' })
      return
    }
    if (!validateEnvelopeSize(parsed.data.envelope)) {
      response.status(413).json({ error: 'The encrypted vault is too large.' })
      return
    }

    const email = parsed.data.email.toLowerCase()
    const passwordHash = await hashCredential(parsed.data.password)
    const recoveryVerifierHash = await hashCredential(
      parsed.data.recoveryVerifier,
    )
    const client = await pool.connect()

    try {
      await client.query('BEGIN')
      const account = await client.query<{ id: string; email: string }>(
        `INSERT INTO accounts (email, password_hash, recovery_verifier_hash)
         VALUES ($1, $2, $3)
         RETURNING id, email`,
        [email, passwordHash, recoveryVerifierHash],
      )
      const createdAccount = account.rows[0]

      if (!createdAccount) {
        throw new Error('Account creation returned no account.')
      }

      await client.query(
        `INSERT INTO encrypted_vaults (account_id, envelope)
         VALUES ($1, $2::jsonb)`,
        [createdAccount.id, JSON.stringify(parsed.data.envelope)],
      )
      const token = createSessionToken()
      const expiresAt = new Date(Date.now() + sessionDurationMs)
      await client.query(
        `INSERT INTO sessions (token_hash, account_id, expires_at)
         VALUES ($1, $2, $3)`,
        [hashSessionToken(token), createdAccount.id, expiresAt],
      )
      await client.query('COMMIT')
      setSessionCookie(response, token)
      response.status(201).json({
        account: { id: createdAccount.id, email: createdAccount.email },
      })
    } catch (error) {
      await client.query('ROLLBACK')

      if (
        typeof error === 'object'
        && error !== null
        && 'code' in error
        && error.code === '23505'
      ) {
        response.status(409).json({
          error: 'Unable to create this account. Try signing in instead.',
        })
        return
      }

      throw error
    } finally {
      client.release()
    }
  })

  app.post('/api/auth/login', originGuard, authRateLimit, async (request, response) => {
    const parsed = loginSchema.safeParse(request.body)

    if (!parsed.success) {
      response.status(400).json({ error: 'Enter a valid email and password.' })
      return
    }

    const result = await pool.query<{
      id: string
      email: string
      password_hash: string
    }>(
      `SELECT id, email, password_hash FROM accounts WHERE email = $1`,
      [parsed.data.email.toLowerCase()],
    )
    const account = result.rows[0]
    const passwordMatches = account
      ? await verifyCredential(parsed.data.password, account.password_hash)
      : await verifyCredential(parsed.data.password, await dummyCredentialHash)

    if (!account || !passwordMatches) {
      response.status(401).json({ error: 'Email or password is incorrect.' })
      return
    }

    await createAuthenticatedSession(pool, response, account.id)
    response.json({ account: { id: account.id, email: account.email } })
  })

  app.post('/api/auth/recover', originGuard, authRateLimit, async (request, response) => {
    const parsed = recoverySchema.safeParse(request.body)

    if (!parsed.success) {
      response.status(400).json({ error: 'Enter a valid recovery key.' })
      return
    }

    const result = await pool.query<{
      id: string
      email: string
      recovery_verifier_hash: string
    }>(
      `SELECT id, email, recovery_verifier_hash
       FROM accounts
       WHERE email = $1`,
      [parsed.data.email.toLowerCase()],
    )
    const account = result.rows[0]
    const proofMatches = account
      ? await verifyCredential(
        parsed.data.recoveryVerifier,
        account.recovery_verifier_hash,
      )
      : await verifyCredential(
        parsed.data.recoveryVerifier,
        await dummyCredentialHash,
      )

    if (!account || !proofMatches) {
      response.status(401).json({ error: 'The account or recovery key is incorrect.' })
      return
    }

    const passwordHash = await hashCredential(parsed.data.newPassword)
    const client = await pool.connect()
    const token = createSessionToken()
    const expiresAt = new Date(Date.now() + sessionDurationMs)

    try {
      await client.query('BEGIN')
      const updatedAccount = await client.query<{ id: string; email: string }>(
        `UPDATE accounts
         SET password_hash = $1
         WHERE id = $2
         RETURNING id, email`,
        [passwordHash, account.id],
      )

      if (!updatedAccount.rows[0]) {
        await client.query('ROLLBACK')
        response.status(401).json({ error: 'The account or recovery key is incorrect.' })
        return
      }

      await client.query('DELETE FROM sessions WHERE account_id = $1', [
        account.id,
      ])
      await client.query(
        `INSERT INTO sessions (token_hash, account_id, expires_at)
         VALUES ($1, $2, $3)`,
        [hashSessionToken(token), account.id, expiresAt],
      )
      await client.query('COMMIT')
      setSessionCookie(response, token)
      response.json({ account: updatedAccount.rows[0] })
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  })

  app.get('/api/auth/session', requireAuth, async (_request, response) => {
    const accountId = getAccountId(response)
    const result = await pool.query<{ id: string; email: string }>(
      'SELECT id, email FROM accounts WHERE id = $1',
      [accountId],
    )

    if (!result.rows[0]) {
      response.status(401).json({ error: 'Sign in to continue.' })
      return
    }

    response.json({ account: result.rows[0] satisfies AccountSummary })
  })

  app.post('/api/auth/logout', originGuard, requireAuth, async (request, response) => {
    const token = getSessionToken(request)
    if (token) {
      await pool.query('DELETE FROM sessions WHERE token_hash = $1', [
        hashSessionToken(token),
      ])
    }
    clearSessionCookie(response)
    response.status(204).end()
  })

  app.get('/api/vault', requireAuth, async (_request, response) => {
    const accountId = getAccountId(response)
    const result = await pool.query<{ envelope: unknown }>(
      'SELECT envelope FROM encrypted_vaults WHERE account_id = $1',
      [accountId],
    )
    const envelope = result.rows[0]?.envelope

    if (!encryptedVaultEnvelopeSchema.safeParse(envelope).success) {
      response.status(404).json({ error: 'No encrypted vault was found.' })
      return
    }

    response.json({ envelope })
  })

  app.put('/api/vault', originGuard, requireAuth, async (request, response) => {
    const parsed = vaultSaveSchema.safeParse(request.body)

    if (!parsed.success) {
      response.status(400).json({ error: 'The encrypted vault format is invalid.' })
      return
    }
    if (!validateEnvelopeSize(parsed.data.envelope)) {
      response.status(413).json({ error: 'The encrypted vault is too large.' })
      return
    }

    const accountId = getAccountId(response)
    await pool.query(
      `INSERT INTO encrypted_vaults (account_id, envelope, updated_at)
       VALUES ($1, $2::jsonb, now())
       ON CONFLICT (account_id)
       DO UPDATE SET envelope = EXCLUDED.envelope, updated_at = now()`,
      [accountId, JSON.stringify(parsed.data.envelope)],
    )
    response.status(204).end()
  })

  app.delete('/api/account', originGuard, requireAuth, async (_request, response) => {
    const accountId = getAccountId(response)
    await pool.query('DELETE FROM accounts WHERE id = $1', [accountId])
    clearSessionCookie(response)
    response.status(204).end()
  })

  app.use((
    error: unknown,
    _request: Request,
    response: Response,
    _next: (error?: unknown) => void,
  ) => {
    if (response.headersSent) {
      _next(error)
      return
    }
    if (error instanceof SyntaxError) {
      response.status(400).json({ error: 'Request body is not valid JSON.' })
      return
    }
    if (
      typeof error === 'object'
      && error !== null
      && 'status' in error
      && error.status === 413
    ) {
      response.status(413).json({ error: 'Request body is too large.' })
      return
    }
    response.status(500).json({ error: 'The service could not complete the request.' })
  })

  return app
}

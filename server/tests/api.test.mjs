import assert from 'node:assert/strict'
import test from 'node:test'
import { once } from 'node:events'
import { createApiApp } from '../src/app.ts'

function makeFakePool() {
  const accounts = new Map()
  const sessions = new Map()
  const vaults = new Map()

  async function query(text, values = []) {
    const statement = text.replace(/\s+/gu, ' ').trim().toLowerCase()
    if (['begin', 'commit', 'rollback'].includes(statement)) {
      return { rows: [] }
    }

    if (statement.startsWith('insert into accounts')) {
      const [email, passwordHash, recoveryVerifierHash] = values
      if (accounts.has(email)) {
        const duplicateError = new Error('duplicate account')
        duplicateError.code = '23505'
        throw duplicateError
      }
      const account = {
        id: crypto.randomUUID(),
        email,
        password_hash: passwordHash,
        recovery_verifier_hash: recoveryVerifierHash,
      }
      accounts.set(email, account)
      return { rows: [{ id: account.id, email: account.email }] }
    }

    if (statement.startsWith('insert into sessions')) {
      const [tokenHash, accountId, expiresAt] = values
      sessions.set(tokenHash, { account_id: accountId, expires_at: expiresAt })
      return { rows: [] }
    }

    if (statement.startsWith('select id, email, password_hash from accounts')) {
      const account = accounts.get(values[0])
      return {
        rows: account
          ? [{
            id: account.id,
            email: account.email,
            password_hash: account.password_hash,
          }]
          : [],
      }
    }

    if (statement.startsWith('select id, email, recovery_verifier_hash from accounts')) {
      const account = accounts.get(values[0])
      return {
        rows: account
          ? [{
            id: account.id,
            email: account.email,
            recovery_verifier_hash: account.recovery_verifier_hash,
          }]
          : [],
      }
    }

    if (statement.startsWith('update accounts set password_hash')) {
      const [passwordHash, accountId] = values
      const account = [...accounts.values()].find(({ id }) => id === accountId)
      if (!account) return { rows: [] }
      account.password_hash = passwordHash
      return { rows: [{ id: account.id, email: account.email }] }
    }

    if (statement.startsWith('delete from sessions where account_id')) {
      const accountId = values[0]
      for (const [hash, session] of sessions) {
        if (session.account_id === accountId) sessions.delete(hash)
      }
      return { rows: [] }
    }

    if (statement.startsWith('select account_id from sessions')) {
      const session = sessions.get(values[0])
      return {
        rows: session && new Date(session.expires_at) > new Date()
          ? [{ account_id: session.account_id }]
          : [],
      }
    }

    if (statement.startsWith('select id, email from accounts where id')) {
      const account = [...accounts.values()].find(({ id }) => id === values[0])
      return {
        rows: account ? [{ id: account.id, email: account.email }] : [],
      }
    }

    if (statement.startsWith('delete from sessions where token_hash')) {
      sessions.delete(values[0])
      return { rows: [] }
    }

    if (statement.startsWith('select envelope from encrypted_vaults')) {
      const envelope = vaults.get(values[0])
      return { rows: envelope ? [{ envelope }] : [] }
    }

    if (statement.startsWith('delete from accounts')) {
      const accountId = values[0]
      const account = [...accounts.values()].find(({ id }) => id === accountId)
      if (account) {
        accounts.delete(account.email)
        vaults.delete(accountId)
        for (const [hash, session] of sessions) {
          if (session.account_id === accountId) sessions.delete(hash)
        }
      }
      return { rows: [] }
    }

    if (statement.startsWith('insert into encrypted_vaults')) {
      const [accountId, envelope] = values
      vaults.set(accountId, JSON.parse(envelope))
      return { rows: [] }
    }

    throw new Error(`Unexpected SQL in API test: ${statement}`)
  }

  return {
    query,
    connect: async () => ({ query, release() {} }),
  }
}

async function withApi(run) {
  const pool = makeFakePool()
  const server = createApiApp(pool).listen(0)
  await once(server, 'listening')
  const address = server.address()
  if (!address || typeof address === 'string') {
    throw new Error('Test API did not bind to a TCP port.')
  }

  try {
    await run(`http://127.0.0.1:${address.port}`)
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) reject(error)
        else resolve()
      })
    })
  }
}

test('API exposes health and requires an account session for vault reads', async () => {
  await withApi(async (origin) => {
    const health = await fetch(`${origin}/api/health`)
    assert.equal(health.status, 200)
    assert.deepEqual(await health.json(), { status: 'ok' })

    const vault = await fetch(`${origin}/api/vault`)
    assert.equal(vault.status, 401)
    assert.deepEqual(await vault.json(), { error: 'Sign in to continue.' })
  })
})

test('API rejects account creation with an invalid encrypted envelope', async () => {
  await withApi(async (origin) => {
    const response = await fetch(`${origin}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: 'http://localhost:5173',
      },
      body: JSON.stringify({
        email: 'person@example.com',
        password: 'a sufficiently long password',
        recoveryVerifier: 'invalid',
        envelope: { birthDate: '2000-01-15' },
      }),
    })

    assert.equal(response.status, 400)
    assert.deepEqual(await response.json(), {
      error: 'Check the account and vault details.',
    })
  })
})

test('API rejects state-changing requests without an allowed origin', async () => {
  await withApi(async (origin) => {
    const response = await fetch(`${origin}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })

    assert.equal(response.status, 403)
    assert.deepEqual(await response.json(), {
      error: 'Request origin is not allowed.',
    })
  })
})

test('accounts can save and recover only their own opaque vault', async () => {
await withApi(async (origin) => {
  const firstEnvelope = {
    version: 1,
    data: { iv: 'AAAAAAAAAAAAAAAA', ciphertext: 'bm90LXBsYWluLXRleHQ' },
    passphraseWrap: {
      iterations: 600_000,
      salt: 'AAAAAAAAAAAAAAAAAAAAAA',
      iv: 'AAAAAAAAAAAAAAAA',
      ciphertext: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    },
    recoveryWrap: {
      iv: 'AAAAAAAAAAAAAAAA',
      ciphertext: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    },
  }
  const recoveryVerifier = Buffer.alloc(32, 7).toString('base64url')
  const headers = {
    'Content-Type': 'application/json',
    Origin: 'http://localhost:5173',
  }
  const registration = await fetch(`${origin}/api/auth/register`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      email: 'person@example.com',
      password: 'a sufficiently long account password',
      recoveryVerifier,
      envelope: firstEnvelope,
    }),
  })

  assert.equal(registration.status, 201)
  const firstCookie = registration.headers.get('set-cookie')?.split(';')[0]
  assert.ok(firstCookie?.startsWith('astrava_session='))
  assert.match(registration.headers.get('set-cookie') ?? '', /HttpOnly/iu)
  assert.match(registration.headers.get('set-cookie') ?? '', /SameSite=Strict/iu)

  const storedVault = await fetch(`${origin}/api/vault`, {
    headers: { Cookie: firstCookie },
  })
  assert.equal(storedVault.headers.get('cache-control'), 'no-store')
  assert.deepEqual(await storedVault.json(), { envelope: firstEnvelope })
  const savedEnvelope = {
    ...firstEnvelope,
    data: { ...firstEnvelope.data, ciphertext: 'bmV3LWNpcGhlcnRleHQ' },
  }
  const saveResponse = await fetch(`${origin}/api/vault`, {
    method: 'PUT',
    headers: { ...headers, Cookie: firstCookie },
    body: JSON.stringify({ envelope: savedEnvelope }),
  })
  assert.equal(saveResponse.status, 204)

  const secondEnvelope = {
    ...firstEnvelope,
    data: { ...firstEnvelope.data, ciphertext: 'b3RoZXItYWNjb3VudA' },
  }
  const secondRegistration = await fetch(`${origin}/api/auth/register`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      email: 'another@example.com',
      password: 'another sufficiently long password',
      recoveryVerifier: Buffer.alloc(32, 8).toString('base64url'),
      envelope: secondEnvelope,
    }),
  })
  const secondCookie = secondRegistration.headers.get('set-cookie')?.split(';')[0]
  const secondVault = await fetch(`${origin}/api/vault`, {
    headers: { Cookie: secondCookie },
  })
  assert.deepEqual(await secondVault.json(), { envelope: secondEnvelope })

  const recovery = await fetch(`${origin}/api/auth/recover`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      email: 'person@example.com',
      recoveryVerifier,
      newPassword: 'a new sufficiently long account password',
    }),
  })
  assert.equal(recovery.status, 200)
  const recoveredCookie = recovery.headers.get('set-cookie')?.split(';')[0]

  const oldSession = await fetch(`${origin}/api/vault`, {
    headers: { Cookie: firstCookie },
  })
  assert.equal(oldSession.status, 401)
  const recoveredVault = await fetch(`${origin}/api/vault`, {
    headers: { Cookie: recoveredCookie },
  })
  assert.deepEqual(await recoveredVault.json(), { envelope: savedEnvelope })

  const oldPasswordLogin = await fetch(`${origin}/api/auth/login`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      email: 'person@example.com',
      password: 'a sufficiently long account password',
    }),
  })
  assert.equal(oldPasswordLogin.status, 401)
  const newPasswordLogin = await fetch(`${origin}/api/auth/login`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      email: 'person@example.com',
      password: 'a new sufficiently long account password',
    }),
  })
  assert.equal(newPasswordLogin.status, 200)

  const deleted = await fetch(`${origin}/api/account`, {
    method: 'DELETE',
    headers: { ...headers, Cookie: recoveredCookie },
  })
  assert.equal(deleted.status, 204)
  const afterDelete = await fetch(`${origin}/api/vault`, {
    headers: { Cookie: recoveredCookie },
  })
  assert.equal(afterDelete.status, 401)
  })
})

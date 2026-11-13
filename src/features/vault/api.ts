import { z } from 'zod'
import {
  encryptedVaultEnvelopeSchema,
  type EncryptedVaultEnvelope,
} from './types.ts'

const accountSchema = z.object({
  id: z.string().uuid(),
  email: z.email(),
})

const accountResponseSchema = z.object({ account: accountSchema })
const vaultResponseSchema = z.object({
  envelope: encryptedVaultEnvelopeSchema,
})

export type AccountSummary = z.infer<typeof accountSchema>

export class ApiError extends Error {
  constructor(message: string, readonly status: number) {
    super(message)
    this.name = 'ApiError'
  }
}

async function request(path: string, init?: RequestInit) {
  const response = await fetch(path, {
    ...init,
    credentials: 'same-origin',
    headers: {
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      ...init?.headers,
    },
  })

  if (!response.ok) {
    const body: unknown = await response.json()
    const errorMessage = z.object({ error: z.string() }).safeParse(body)
    throw new ApiError(
      errorMessage.success
        ? errorMessage.data.error
        : 'The service could not complete the request.',
      response.status,
    )
  }

  return response.status === 204 ? null : response.json() as Promise<unknown>
}

function accountFromResponse(response: unknown) {
  return accountResponseSchema.parse(response).account
}

export async function registerAccount(input: {
  email: string
  password: string
  recoveryVerifier: string
  envelope: EncryptedVaultEnvelope
}) {
  const result = await request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(input),
  })
  return accountFromResponse(result)
}

export async function loginAccount(email: string, password: string) {
  const result = await request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  return accountFromResponse(result)
}

export async function recoverAccount(
  email: string,
  recoveryVerifier: string,
  newPassword: string,
) {
  const result = await request('/api/auth/recover', {
    method: 'POST',
    body: JSON.stringify({ email, recoveryVerifier, newPassword }),
  })
  return accountFromResponse(result)
}

export async function getAccountSession() {
  const result = await request('/api/auth/session')
  return accountFromResponse(result)
}

export async function logoutAccount() {
  await request('/api/auth/logout', { method: 'POST' })
}

export async function getEncryptedVault() {
  const result = await request('/api/vault')
  return vaultResponseSchema.parse(result).envelope
}

export async function saveEncryptedVault(envelope: EncryptedVaultEnvelope) {
  await request('/api/vault', {
    method: 'PUT',
    body: JSON.stringify({ envelope }),
  })
}

export async function deleteAccount() {
  await request('/api/account', { method: 'DELETE' })
}

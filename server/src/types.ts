import { z } from 'zod'

declare global {
  namespace Express {
    interface Locals {
      accountId?: string
    }
  }
}

const encodedBytes = z.string().regex(/^[A-Za-z0-9_-]+$/)

export const encryptedVaultEnvelopeSchema = z.object({
  version: z.literal(1),
  data: z.object({
    iv: encodedBytes,
    ciphertext: encodedBytes,
  }),
  passphraseWrap: z.object({
    iterations: z.literal(600_000),
    salt: encodedBytes,
    iv: encodedBytes,
    ciphertext: encodedBytes,
  }),
  recoveryWrap: z.object({
    iv: encodedBytes,
    ciphertext: encodedBytes,
  }),
}).strict()

export type EncryptedVaultEnvelope = z.infer<
  typeof encryptedVaultEnvelopeSchema
>

export const registerSchema = z.object({
  email: z.email().max(254),
  password: z.string().min(12).max(128),
  recoveryVerifier: encodedBytes.length(43),
  envelope: encryptedVaultEnvelopeSchema,
}).strict()

export const loginSchema = z.object({
  email: z.email().max(254),
  password: z.string().min(1).max(128),
}).strict()

export const recoverySchema = z.object({
  email: z.email().max(254),
  recoveryVerifier: encodedBytes.length(43),
  newPassword: z.string().min(12).max(128),
}).strict()

export const vaultSaveSchema = z.object({
  envelope: encryptedVaultEnvelopeSchema,
}).strict()

export type AccountSummary = {
  id: string
  email: string
}

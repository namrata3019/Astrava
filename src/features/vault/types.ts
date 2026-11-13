import { z } from 'zod'
import type { BirthDetails } from '../../astrology/types'

const encodedBytes = z.string().regex(/^[A-Za-z0-9_-]+$/)

export const encryptedVaultEnvelopeSchema = z.object({
  version: z.literal(1),
  data: z.object({
    iv: encodedBytes,
    ciphertext: encodedBytes,
  }).strict(),
  passphraseWrap: z.object({
    iterations: z.literal(600_000),
    salt: encodedBytes,
    iv: encodedBytes,
    ciphertext: encodedBytes,
  }).strict(),
  recoveryWrap: z.object({
    iv: encodedBytes,
    ciphertext: encodedBytes,
  }).strict(),
}).strict()

const storedBirthDetailsSchema = z.object({
  name: z.string().max(80).optional(),
  birthDate: z.string(),
  birthTime: z.string().nullable(),
  unknownBirthTime: z.boolean(),
  city: z.string().max(120),
  countryCode: z.string().length(2),
  timezone: z.string(),
  system: z.enum(['vedic', 'western']),
}).strict()

export const vaultContentsSchema = z.object({
  birthDetails: storedBirthDetailsSchema.nullable(),
  conversations: z.array(z.object({
    id: z.string().uuid(),
    title: z.string().max(120),
    updatedAt: z.string().datetime(),
    messages: z.array(z.object({
      id: z.string().uuid(),
      role: z.enum(['user', 'assistant']),
      content: z.string().min(1).max(4_000),
      createdAt: z.string().datetime(),
    }).strict()).max(200),
  }).strict()).max(100),
}).strict()

export type VaultContents = z.infer<typeof vaultContentsSchema> & {
  birthDetails: BirthDetails | null
}

export type Conversation = VaultContents['conversations'][number]
export type ConversationMessage = Conversation['messages'][number]

export type EncryptedVaultEnvelope = z.infer<
  typeof encryptedVaultEnvelopeSchema
>

export type PreparedVault = {
  contents: VaultContents
  envelope: EncryptedVaultEnvelope
  dataKey: CryptoKey
  recoveryKey: string
  recoveryVerifier: string
}

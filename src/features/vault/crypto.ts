import {
  encryptedVaultEnvelopeSchema,
  vaultContentsSchema,
  type EncryptedVaultEnvelope,
  type PreparedVault,
  type VaultContents,
} from './types.ts'

const passphraseIterations = 600_000 as const
const textEncoder = new TextEncoder()
const textDecoder = new TextDecoder()

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  const buffer = new ArrayBuffer(bytes.byteLength)
  new Uint8Array(buffer).set(bytes)
  return buffer
}

function encodeBytes(bytes: Uint8Array) {
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/u, '')
}

function decodeBytes(encoded: string) {
  const base64 = encoded.replaceAll('-', '+').replaceAll('_', '/')
  const binary = atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, '='))
  return Uint8Array.from(binary, (character) => character.charCodeAt(0))
}

function randomBytes(length: number) {
  return crypto.getRandomValues(new Uint8Array(length))
}

async function derivePassphraseKey(passphrase: string, salt: Uint8Array) {
  if (passphrase.length < 12 || passphrase.length > 128) {
    throw new Error('Vault passphrases must be between 12 and 128 characters.')
  }

  const passphraseBytes = textEncoder.encode(passphrase)
  let material: CryptoKey
  try {
    material = await crypto.subtle.importKey(
      'raw',
      toArrayBuffer(passphraseBytes),
      'PBKDF2',
      false,
      ['deriveKey'],
    )
  } finally {
    passphraseBytes.fill(0)
  }

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      hash: 'SHA-256',
      salt: toArrayBuffer(salt),
      iterations: passphraseIterations,
    },
    material,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  )
}

async function importRecoveryKey(recoveryKey: string) {
  const rawKey = decodeBytes(recoveryKey)
  if (rawKey.byteLength !== 32) {
    throw new Error('The recovery key is not valid.')
  }

  try {
    return await crypto.subtle.importKey(
      'raw',
      toArrayBuffer(rawKey),
      { name: 'AES-GCM' },
      false,
      ['encrypt', 'decrypt'],
    )
  } finally {
    rawKey.fill(0)
  }
}

async function encryptBytes(
  key: CryptoKey,
  value: Uint8Array,
  purpose: string,
) {
  const iv = randomBytes(12)
  const valueBuffer = toArrayBuffer(value)
  const purposeBytes = textEncoder.encode(purpose)
  let ciphertext: ArrayBuffer

  try {
    ciphertext = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: toArrayBuffer(iv),
        additionalData: toArrayBuffer(purposeBytes),
      },
      key,
      valueBuffer,
    )
  } finally {
    new Uint8Array(valueBuffer).fill(0)
    purposeBytes.fill(0)
  }

  return {
    iv: encodeBytes(iv),
    ciphertext: encodeBytes(new Uint8Array(ciphertext)),
  }
}

async function decryptBytes(
  key: CryptoKey,
  iv: string,
  ciphertext: string,
  purpose: string,
) {
  const plaintext = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: toArrayBuffer(decodeBytes(iv)),
      additionalData: toArrayBuffer(textEncoder.encode(purpose)),
    },
    key,
    toArrayBuffer(decodeBytes(ciphertext)),
  )

  return new Uint8Array(plaintext)
}

async function createEnvelope(
  contents: VaultContents,
  dataKeyBytes: Uint8Array,
  passphrase: string,
  recoveryKey: string,
) {
  const validatedContents = vaultContentsSchema.parse(contents)
  const passphraseSalt = randomBytes(16)
  const passphraseKey = await derivePassphraseKey(passphrase, passphraseSalt)
  const recoveryKeyCrypto = await importRecoveryKey(recoveryKey)
  const dataKeyBuffer = toArrayBuffer(dataKeyBytes)
  let dataKey: CryptoKey
  try {
    dataKey = await crypto.subtle.importKey(
      'raw',
      dataKeyBuffer,
      { name: 'AES-GCM' },
      false,
      ['encrypt', 'decrypt'],
    )
  } finally {
    new Uint8Array(dataKeyBuffer).fill(0)
  }
  const [data, passphraseWrap, recoveryWrap] = await Promise.all([
    encryptBytes(
      dataKey,
      textEncoder.encode(JSON.stringify(validatedContents)),
      'astrava:vault:data:v1',
    ),
    encryptBytes(passphraseKey, dataKeyBytes, 'astrava:vault:passphrase:v1'),
    encryptBytes(recoveryKeyCrypto, dataKeyBytes, 'astrava:vault:recovery:v1'),
  ])

  return {
    dataKey,
    envelope: {
      version: 1,
      data,
      passphraseWrap: {
        ...passphraseWrap,
        iterations: passphraseIterations,
        salt: encodeBytes(passphraseSalt),
      },
      recoveryWrap,
    } satisfies EncryptedVaultEnvelope,
  }
}

export async function prepareVault(
  contents: VaultContents,
  passphrase: string,
): Promise<PreparedVault> {
  const dataKeyBytes = randomBytes(32)
  const recoveryKey = encodeBytes(randomBytes(32))

  try {
    const { envelope, dataKey } = await createEnvelope(
      contents,
      dataKeyBytes,
      passphrase,
      recoveryKey,
    )
    const recoveryVerifier = await deriveRecoveryVerifier(recoveryKey)

    return {
      contents: vaultContentsSchema.parse(contents),
      envelope,
      dataKey,
      recoveryKey,
      recoveryVerifier,
    }
  } finally {
    dataKeyBytes.fill(0)
  }
}

async function unwrapDataKey(
  wrappedKey: string,
  iv: string,
  key: CryptoKey,
  purpose: string,
) {
  const keyBytes = await decryptBytes(key, iv, wrappedKey, purpose)

  try {
    return await crypto.subtle.importKey(
      'raw',
      toArrayBuffer(keyBytes),
      { name: 'AES-GCM' },
      false,
      ['encrypt', 'decrypt'],
    )
  } finally {
    keyBytes.fill(0)
  }
}

async function decryptContents(
  envelope: EncryptedVaultEnvelope,
  dataKey: CryptoKey,
) {
  const plaintext = await decryptBytes(
    dataKey,
    envelope.data.iv,
    envelope.data.ciphertext,
    'astrava:vault:data:v1',
  )
  try {
    const parsed: unknown = JSON.parse(textDecoder.decode(plaintext))
    return vaultContentsSchema.parse(parsed)
  } finally {
    plaintext.fill(0)
  }
}

export async function unlockVaultWithPassphrase(
  envelope: EncryptedVaultEnvelope,
  passphrase: string,
) {
  envelope = encryptedVaultEnvelopeSchema.parse(envelope)
  if (envelope.version !== 1) {
    throw new Error('This encrypted vault version is not supported.')
  }
  if (envelope.passphraseWrap.iterations !== passphraseIterations) {
    throw new Error('The vault uses unsupported passphrase settings.')
  }

  const wrappingKey = await derivePassphraseKey(
    passphrase,
    decodeBytes(envelope.passphraseWrap.salt),
  )
  const dataKey = await unwrapDataKey(
    envelope.passphraseWrap.ciphertext,
    envelope.passphraseWrap.iv,
    wrappingKey,
    'astrava:vault:passphrase:v1',
  )
  const contents = await decryptContents(envelope, dataKey)

  return { contents, dataKey }
}

export async function unlockVaultWithRecoveryKey(
  envelope: EncryptedVaultEnvelope,
  recoveryKey: string,
) {
  envelope = encryptedVaultEnvelopeSchema.parse(envelope)
  if (envelope.version !== 1) {
    throw new Error('This encrypted vault version is not supported.')
  }

  const recoveryCryptoKey = await importRecoveryKey(recoveryKey)
  const dataKey = await unwrapDataKey(
    envelope.recoveryWrap.ciphertext,
    envelope.recoveryWrap.iv,
    recoveryCryptoKey,
    'astrava:vault:recovery:v1',
  )
  const contents = await decryptContents(envelope, dataKey)
  return {
    contents,
    recoveryVerifier: await deriveRecoveryVerifier(recoveryKey),
  }
}

export async function deriveRecoveryVerifier(recoveryKey: string) {
  const proofBytes = textEncoder.encode(`astrava:recovery-proof:v1:${recoveryKey}`)
  try {
    const result = await crypto.subtle.digest(
      'SHA-256',
      toArrayBuffer(proofBytes),
    )
    return encodeBytes(new Uint8Array(result))
  } finally {
    proofBytes.fill(0)
  }
}

export async function prepareVaultWithRecoveryKey(
  contents: VaultContents,
  passphrase: string,
  recoveryKey: string,
) {
  const dataKeyBytes = randomBytes(32)

  try {
    const prepared = await createEnvelope(
      contents,
      dataKeyBytes,
      passphrase,
      recoveryKey,
    )

    return { ...prepared, contents }
  } finally {
    dataKeyBytes.fill(0)
  }
}

export async function updateVaultContents(
  envelope: EncryptedVaultEnvelope,
  dataKey: CryptoKey,
  contents: VaultContents,
) {
  const validatedContents = vaultContentsSchema.parse(contents)
  const data = await encryptBytes(
    dataKey,
    textEncoder.encode(JSON.stringify(validatedContents)),
    'astrava:vault:data:v1',
  )

  return { ...envelope, data }
}

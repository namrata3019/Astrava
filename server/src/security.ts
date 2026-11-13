import {
  createHash,
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual,
} from 'node:crypto'
const scryptCost = 32_768
const scryptBlockSize = 8
const scryptParallelization = 1
const derivedKeyBytes = 64

function deriveCredentialKey(value: string, salt: Buffer) {
  return new Promise<Buffer>((resolve, reject) => {
    scryptCallback(
      value,
      salt,
      derivedKeyBytes,
      {
        N: scryptCost,
        r: scryptBlockSize,
        p: scryptParallelization,
        maxmem: 64 * 1024 * 1024,
      },
      (error, derivedKey) => {
        if (error) {
          reject(error)
          return
        }
        resolve(derivedKey)
      },
    )
  })
}

export function hashSessionToken(token: string) {
  return createHash('sha256').update(token).digest('hex')
}

export async function hashCredential(value: string) {
  const salt = randomBytes(16)
  const hash = await deriveCredentialKey(value, salt)

  return [
    'scrypt',
    scryptCost,
    scryptBlockSize,
    scryptParallelization,
    salt.toString('base64url'),
    hash.toString('base64url'),
  ].join('$')
}

export async function verifyCredential(value: string, encodedHash: string) {
  const [algorithm, cost, blockSize, parallelization, saltText, hashText] =
    encodedHash.split('$')

  if (
    algorithm !== 'scrypt'
    || cost !== String(scryptCost)
    || blockSize !== String(scryptBlockSize)
    || parallelization !== String(scryptParallelization)
    || !saltText
    || !hashText
  ) {
    throw new Error('Stored credential hash has an unsupported format.')
  }

  const expected = Buffer.from(hashText, 'base64url')
  const salt = Buffer.from(saltText, 'base64url')
  const actual = await deriveCredentialKey(value, salt)

  return actual.length === expected.length
    && timingSafeEqual(actual, expected)
}

export function createSessionToken() {
  return randomBytes(32).toString('base64url')
}

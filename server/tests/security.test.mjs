import assert from 'node:assert/strict'
import test from 'node:test'
import {
  createSessionToken,
  hashCredential,
  hashSessionToken,
  verifyCredential,
} from '../src/security.ts'

test('credentials are stored as verifiable scrypt hashes, not plaintext', async () => {
  const password = 'a sufficiently long account password'
  const encodedHash = await hashCredential(password)

  assert.notEqual(encodedHash, password)
  assert.equal(encodedHash.startsWith('scrypt$32768$8$1$'), true)
  assert.equal(await verifyCredential(password, encodedHash), true)
  assert.equal(await verifyCredential('a different password', encodedHash), false)
})

test('session tokens are random and only their hash is suitable for storage', () => {
  const first = createSessionToken()
  const second = createSessionToken()

  assert.notEqual(first, second)
  assert.notEqual(hashSessionToken(first), first)
  assert.equal(hashSessionToken(first), hashSessionToken(first))
})

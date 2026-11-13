import assert from 'node:assert/strict'
import test from 'node:test'
import {
  deriveRecoveryVerifier,
  prepareVault,
  prepareVaultWithRecoveryKey,
  unlockVaultWithPassphrase,
  unlockVaultWithRecoveryKey,
  updateVaultContents,
} from '../crypto.ts'

const sampleVault = {
  birthDetails: {
    name: 'Private Example',
    birthDate: '2000-01-15',
    birthTime: '09:30',
    unknownBirthTime: false,
    city: 'New York',
    countryCode: 'US',
    timezone: 'America/New_York',
    system: 'western',
  },
  conversations: [{
    id: '550e8400-e29b-41d4-a716-446655440000',
    title: 'Private question',
    updatedAt: '2026-11-13T00:00:00.000Z',
    messages: [{
      id: '550e8400-e29b-41d4-a716-446655440001',
      role: 'user',
      content: 'How can I explore my career patterns?',
      createdAt: '2026-11-13T00:00:00.000Z',
    }],
  }],
}

test('vault data is encrypted and can be opened with its passphrase', async () => {
  const prepared = await prepareVault(sampleVault, 'correct horse battery staple')
  const serializedEnvelope = JSON.stringify(prepared.envelope)

  assert.equal(serializedEnvelope.includes('Private Example'), false)
  assert.equal(serializedEnvelope.includes('New York'), false)
  assert.equal(serializedEnvelope.includes('2000-01-15'), false)
  assert.equal(serializedEnvelope.includes('career patterns'), false)
  assert.equal(prepared.recoveryKey.length, 43)
  assert.equal(prepared.recoveryVerifier, await deriveRecoveryVerifier(prepared.recoveryKey))

  const unlocked = await unlockVaultWithPassphrase(
    prepared.envelope,
    'correct horse battery staple',
  )
  assert.deepEqual(unlocked.contents, sampleVault)
  await assert.rejects(
    unlockVaultWithPassphrase(prepared.envelope, 'incorrect passphrase'),
  )
  await assert.rejects(
    unlockVaultWithRecoveryKey(prepared.envelope, 'A'.repeat(43)),
  )
})

test('recovery unlocks the vault and can replace its passphrase', async () => {
  const prepared = await prepareVault(sampleVault, 'correct horse battery staple')
  const recovered = await unlockVaultWithRecoveryKey(
    prepared.envelope,
    prepared.recoveryKey,
  )
  const updated = await prepareVaultWithRecoveryKey(
    recovered.contents,
    'a different secure passphrase',
    prepared.recoveryKey,
  )

  assert.equal(
    recovered.recoveryVerifier,
    await deriveRecoveryVerifier(prepared.recoveryKey),
  )
  assert.deepEqual(
    (await unlockVaultWithPassphrase(
      updated.envelope,
      'a different secure passphrase',
    )).contents,
    sampleVault,
  )
  assert.deepEqual(
    (await unlockVaultWithRecoveryKey(
      updated.envelope,
      prepared.recoveryKey,
    )).contents,
    sampleVault,
  )
  await assert.rejects(
    unlockVaultWithPassphrase(updated.envelope, 'correct horse battery staple'),
  )
})

test('saving new vault contents uses fresh ciphertext without exposing plaintext', async () => {
  const prepared = await prepareVault(sampleVault, 'correct horse battery staple')
  const nextContents = {
    ...sampleVault,
    conversations: [],
  }
  const updatedEnvelope = await updateVaultContents(
    prepared.envelope,
    prepared.dataKey,
    nextContents,
  )

  assert.notEqual(updatedEnvelope.data.iv, prepared.envelope.data.iv)
  assert.equal(JSON.stringify(updatedEnvelope).includes('New York'), false)
  assert.deepEqual(
    (await unlockVaultWithPassphrase(
      updatedEnvelope,
      'correct horse battery staple',
    )).contents,
    nextContents,
  )
})

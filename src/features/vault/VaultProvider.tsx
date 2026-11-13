import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react'
import type { BirthDetails } from '../../astrology/types'
import {
  deleteAccount as deleteAccountRequest,
  getAccountSession,
  getEncryptedVault,
  loginAccount,
  logoutAccount,
  recoverAccount,
  registerAccount,
  saveEncryptedVault,
  ApiError,
  type AccountSummary,
} from './api.ts'
import type {
  EncryptedVaultEnvelope,
  PreparedVault,
  VaultContents,
} from './types.ts'

type VaultStatus =
  | 'unchecked'
  | 'checking'
  | 'signed-out'
  | 'locked'
  | 'unlocked'
  | 'unavailable'

type UnlockedVault = {
  contents: VaultContents
  dataKey: CryptoKey
  envelope: EncryptedVaultEnvelope
}

type VaultContextValue = {
  account: AccountSummary | null
  contents: VaultContents | null
  pendingBirthDetails: BirthDetails | null
  status: VaultStatus
  setPendingBirthDetails: (details: BirthDetails | null) => void
  refreshSession: () => Promise<void>
  register: (
    email: string,
    password: string,
    prepared: PreparedVault,
  ) => Promise<void>
  signIn: (
    email: string,
    password: string,
    passphrase: string,
  ) => Promise<void>
  unlock: (passphrase: string) => Promise<void>
  recover: (
    email: string,
    recoveryKey: string,
    newPassword: string,
    newPassphrase: string,
  ) => Promise<void>
  saveContents: (contents: VaultContents) => Promise<void>
  lock: () => void
  signOut: () => Promise<void>
  deleteAccount: () => Promise<void>
}

const VaultContext = createContext<VaultContextValue | null>(null)

export function VaultProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<AccountSummary | null>(null)
  const [unlocked, setUnlocked] = useState<UnlockedVault | null>(null)
  const [pendingBirthDetails, setPendingBirthDetails] =
    useState<BirthDetails | null>(null)
  const [status, setStatus] = useState<VaultStatus>('unchecked')

  async function refreshSession() {
    setStatus('checking')
    try {
      const session = await getAccountSession()
      setAccount(session)
      setStatus('locked')
    } catch (error: unknown) {
      setAccount(null)
      setStatus(
        error instanceof ApiError && error.status === 401
          ? 'signed-out'
          : 'unavailable',
      )
    }
  }

  async function activateVault(
    session: AccountSummary,
    envelope: EncryptedVaultEnvelope,
    passphrase: string,
  ) {
    const { unlockVaultWithPassphrase, updateVaultContents } =
      await import('./crypto.ts')
    const unlockedVault = await unlockVaultWithPassphrase(envelope, passphrase)
    const contents = pendingBirthDetails
      ? { ...unlockedVault.contents, birthDetails: pendingBirthDetails }
      : unlockedVault.contents
    const nextEnvelope = pendingBirthDetails
      ? await updateVaultContents(
        envelope,
        unlockedVault.dataKey,
        contents,
      )
      : envelope

    if (pendingBirthDetails) await saveEncryptedVault(nextEnvelope)

    setAccount(session)
    setUnlocked({
      contents,
      dataKey: unlockedVault.dataKey,
      envelope: nextEnvelope,
    })
    setPendingBirthDetails(null)
    setStatus('unlocked')
  }

  async function register(
    email: string,
    password: string,
    prepared: PreparedVault,
  ) {
    const session = await registerAccount({
      email,
      password,
      recoveryVerifier: prepared.recoveryVerifier,
      envelope: prepared.envelope,
    })

    setAccount(session)
    setUnlocked({
      contents: prepared.contents,
      dataKey: prepared.dataKey,
      envelope: prepared.envelope,
    })
    setPendingBirthDetails(null)
    setStatus('unlocked')
  }

  async function signIn(
    email: string,
    password: string,
    passphrase: string,
  ) {
    const session = await loginAccount(email, password)
    setAccount(session)
    setUnlocked(null)
    setStatus('locked')
    const envelope = await getEncryptedVault()
    await activateVault(session, envelope, passphrase)
  }

  async function unlock(passphrase: string) {
    if (!account) throw new Error('Sign in before unlocking your vault.')
    const envelope = await getEncryptedVault()
    await activateVault(account, envelope, passphrase)
  }

  async function recover(
    email: string,
    recoveryKey: string,
    newPassword: string,
    newPassphrase: string,
  ) {
    const {
      deriveRecoveryVerifier,
      prepareVaultWithRecoveryKey,
      unlockVaultWithRecoveryKey,
    } = await import('./crypto.ts')
    const recoveryVerifier = await deriveRecoveryVerifier(recoveryKey)
    const session = await recoverAccount(
      email,
      recoveryVerifier,
      newPassword,
    )
    const currentEnvelope = await getEncryptedVault()
    const recovered = await unlockVaultWithRecoveryKey(
      currentEnvelope,
      recoveryKey,
    )
    const contents = pendingBirthDetails
      ? { ...recovered.contents, birthDetails: pendingBirthDetails }
      : recovered.contents
    const nextVault = await prepareVaultWithRecoveryKey(
      contents,
      newPassphrase,
      recoveryKey,
    )

    await saveEncryptedVault(nextVault.envelope)
    setAccount(session)
    setUnlocked({
      contents: nextVault.contents,
      dataKey: nextVault.dataKey,
      envelope: nextVault.envelope,
    })
    setPendingBirthDetails(null)
    setStatus('unlocked')
  }

  async function saveContents(contents: VaultContents) {
    if (!unlocked) throw new Error('Unlock your vault before saving.')
    const { updateVaultContents } = await import('./crypto.ts')
    const envelope = await updateVaultContents(
      unlocked.envelope,
      unlocked.dataKey,
      contents,
    )
    await saveEncryptedVault(envelope)
    setUnlocked({ ...unlocked, contents, envelope })
  }

  function lock() {
    setUnlocked(null)
    setStatus(account ? 'locked' : 'signed-out')
  }

  async function signOut() {
    try {
      await logoutAccount()
    } finally {
      setUnlocked(null)
      setAccount(null)
      setPendingBirthDetails(null)
      setStatus('signed-out')
    }
  }

  async function deleteAccount() {
    await deleteAccountRequest()
    setUnlocked(null)
    setAccount(null)
    setPendingBirthDetails(null)
    setStatus('signed-out')
  }

  const value: VaultContextValue = {
    account,
    contents: unlocked?.contents ?? null,
    pendingBirthDetails,
    status,
    setPendingBirthDetails,
    refreshSession,
    register,
    signIn,
    unlock,
    recover,
    saveContents,
    lock,
    signOut,
    deleteAccount,
  }

  return <VaultContext.Provider value={value}>{children}</VaultContext.Provider>
}

export function useVault() {
  const context = useContext(VaultContext)
  if (!context) throw new Error('useVault must be used within VaultProvider.')
  return context
}

import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Button } from '../components/common/Button'
import { Card } from '../components/common/Card'
import { Footer } from '../components/navigation/Footer'
import { Navigation } from '../components/navigation/Navigation'
import { useVault } from '../features/vault/VaultProvider'
import type { PreparedVault } from '../features/vault/types.ts'

type AccountMode = 'login' | 'register' | 'recover'

function messageFromError(error: unknown) {
  return error instanceof Error
    ? error.message
    : 'The request could not be completed. Try again.'
}

export default function AccountPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const vault = useVault()
  const [mode, setMode] = useState<AccountMode>(
    searchParams.get('flow') === 'register' ? 'register' : 'login',
  )
  const [email, setEmail] = useState(vault.account?.email ?? '')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passphrase, setPassphrase] = useState('')
  const [confirmPassphrase, setConfirmPassphrase] = useState('')
  const [recoveryKey, setRecoveryKey] = useState('')
  const [recoveryConfirmed, setRecoveryConfirmed] = useState(false)
  const [prepared, setPrepared] = useState<PreparedVault | null>(null)
  const [deleteConfirmed, setDeleteConfirmed] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (vault.status === 'unchecked') void vault.refreshSession()
  }, [vault.status])

  async function submitLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true)
    setError('')

    try {
      await vault.signIn(email, password, passphrase)
      setPassword('')
      setPassphrase('')
      navigate('/explore')
    } catch (requestError: unknown) {
      setError(messageFromError(requestError))
    } finally {
      setBusy(false)
    }
  }

  async function prepareRegistration(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    if (password.length < 12) {
      setError('Use an account password with at least 12 characters.')
      return
    }
    if (passphrase !== confirmPassphrase) {
      setError('The vault passphrases do not match.')
      return
    }

    setBusy(true)
    try {
      const { prepareVault } = await import('../features/vault/crypto.ts')
      const next = await prepareVault(
        {
          birthDetails: vault.pendingBirthDetails,
          conversations: [],
        },
        passphrase,
      )
      setPrepared(next)
      setRecoveryConfirmed(false)
    } catch (requestError: unknown) {
      setError(messageFromError(requestError))
    } finally {
      setBusy(false)
    }
  }

  async function completeRegistration() {
    if (!prepared) return
    setBusy(true)
    setError('')

    try {
      await vault.register(email, password, prepared)
      setPassword('')
      setPassphrase('')
      setConfirmPassphrase('')
      setPrepared(null)
      navigate('/explore')
    } catch (requestError: unknown) {
      setError(messageFromError(requestError))
    } finally {
      setBusy(false)
    }
  }

  async function unlock(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true)
    setError('')

    try {
      await vault.unlock(passphrase)
      setPassphrase('')
      navigate('/explore')
    } catch (requestError: unknown) {
      setError(messageFromError(requestError))
    } finally {
      setBusy(false)
    }
  }

  async function recover(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (password.length < 12 || password !== confirmPassword) {
      setError('Enter and confirm a new account password with at least 12 characters.')
      return
    }
    setBusy(true)
    setError('')

    try {
      await vault.recover(email, recoveryKey.trim(), password, passphrase)
      setRecoveryKey('')
      setPassword('')
      setConfirmPassword('')
      setPassphrase('')
      navigate('/explore')
    } catch (requestError: unknown) {
      setError(messageFromError(requestError))
    } finally {
      setBusy(false)
    }
  }

  async function signOut() {
    setBusy(true)
    setError('')
    try {
      await vault.signOut()
      setPassword('')
      setPassphrase('')
    } catch (requestError: unknown) {
      setError(messageFromError(requestError))
    } finally {
      setBusy(false)
    }
  }

  async function deleteAccount() {
    setBusy(true)
    setError('')
    try {
      await vault.deleteAccount()
      setDeleteConfirmed(false)
    } catch (requestError: unknown) {
      setError(messageFromError(requestError))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen bg-ivory">
      <a
        className="sr-only z-50 rounded-full bg-champagne px-4 py-2 text-midnight focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        href="#main-content"
      >
        Skip to content
      </a>
      <Navigation />
      <main
        className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16"
        id="main-content"
      >
        <div className="mx-auto max-w-3xl">
          <Link
            className="text-sm font-semibold text-ink hover:text-[#765522]"
            to="/"
          >
            Back to overview
          </Link>
          <h1 className="mt-7 font-display text-4xl text-midnight sm:text-5xl">
            Your private ASTRAVA space
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-ink/75">
            Birth details and conversation history are encrypted in your browser
            before they are sent to the ASTRAVA API. Your account password and
            vault passphrase are separate.
          </p>

          <Card as="section" className="mt-8" aria-labelledby="account-panel-title">
            <h2
              className="font-display text-2xl text-midnight"
              id="account-panel-title"
            >
              {vault.status === 'unlocked'
                ? 'Encrypted vault unlocked'
                : vault.status === 'checking' || vault.status === 'unchecked'
                  ? 'Checking your account'
                  : vault.status === 'locked'
                    ? 'Unlock your encrypted vault'
                    : mode === 'register'
                      ? 'Create your account'
                      : mode === 'recover'
                        ? 'Recover your vault'
                        : 'Sign in'}
            </h2>

            {vault.status === 'checking' && (
              <p className="mt-4 text-sm text-ink/70" role="status">
                Checking the self-hosted account service…
              </p>
            )}

            {vault.status === 'unavailable' && (
              <div className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-900" role="alert">
                <p>
                  The account service is unavailable. Start the API and check
                  its database configuration, then try again.
                </p>
                <Button
                  className="mt-3"
                  onClick={() => void vault.refreshSession()}
                  type="button"
                  variant="quiet"
                >
                  Retry account service
                </Button>
              </div>
            )}

            {vault.status === 'signed-out' && mode === 'login' && (
              <form className="mt-6 space-y-5" onSubmit={submitLogin}>
                <label className="block text-sm font-semibold text-ink" htmlFor="account-email">
                  Email
                  <input
                    autoComplete="email"
                    className="mt-2 min-h-11 w-full rounded-xl border border-soft-gray bg-white px-4 py-2 font-normal"
                    id="account-email"
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    type="email"
                    value={email}
                  />
                </label>
                <label className="block text-sm font-semibold text-ink" htmlFor="account-password">
                  Account password
                  <input
                    autoComplete="current-password"
                    className="mt-2 min-h-11 w-full rounded-xl border border-soft-gray bg-white px-4 py-2 font-normal"
                    id="account-password"
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    type="password"
                    value={password}
                  />
                </label>
                <label className="block text-sm font-semibold text-ink" htmlFor="vault-passphrase">
                  Vault passphrase
                  <input
                    autoComplete="off"
                    className="mt-2 min-h-11 w-full rounded-xl border border-soft-gray bg-white px-4 py-2 font-normal"
                    id="vault-passphrase"
                    onChange={(event) => setPassphrase(event.target.value)}
                    required
                    type="password"
                    value={passphrase}
                  />
                </label>
                <p className="text-xs leading-5 text-ink/65">
                  Your account password signs you in. The separate vault
                  passphrase decrypts your saved data on this device.
                </p>
                <Button disabled={busy} type="submit">
                  {busy ? 'Signing in…' : 'Sign in and unlock'}
                </Button>
                <div className="flex flex-wrap gap-4 text-sm">
                  <button
                    className="min-h-11 font-semibold text-[#765522] underline"
                    onClick={() => {
                      setMode('register')
                      setError('')
                    }}
                    type="button"
                  >
                    Create account
                  </button>
                  <button
                    className="min-h-11 font-semibold text-[#765522] underline"
                    onClick={() => {
                      setMode('recover')
                      setError('')
                    }}
                    type="button"
                  >
                    Use recovery key
                  </button>
                </div>
              </form>
            )}

            {vault.status === 'signed-out' && mode === 'register' && (
              <div className="mt-6">
                {!prepared ? (
                  <form className="space-y-5" onSubmit={prepareRegistration}>
                    <label className="block text-sm font-semibold text-ink" htmlFor="new-account-email">
                      Email
                      <input
                        autoComplete="email"
                        className="mt-2 min-h-11 w-full rounded-xl border border-soft-gray bg-white px-4 py-2 font-normal"
                        id="new-account-email"
                        onChange={(event) => setEmail(event.target.value)}
                        required
                        type="email"
                        value={email}
                      />
                    </label>
                    <label className="block text-sm font-semibold text-ink" htmlFor="new-account-password">
                      Account password
                      <input
                        autoComplete="new-password"
                        className="mt-2 min-h-11 w-full rounded-xl border border-soft-gray bg-white px-4 py-2 font-normal"
                        id="new-account-password"
                        minLength={12}
                        onChange={(event) => setPassword(event.target.value)}
                        required
                        type="password"
                        value={password}
                      />
                    </label>
                    <label className="block text-sm font-semibold text-ink" htmlFor="new-vault-passphrase">
                      Vault passphrase
                      <input
                        autoComplete="new-password"
                        className="mt-2 min-h-11 w-full rounded-xl border border-soft-gray bg-white px-4 py-2 font-normal"
                        id="new-vault-passphrase"
                        minLength={12}
                        onChange={(event) => setPassphrase(event.target.value)}
                        required
                        type="password"
                        value={passphrase}
                      />
                    </label>
                    <label className="block text-sm font-semibold text-ink" htmlFor="confirm-vault-passphrase">
                      Confirm vault passphrase
                      <input
                        autoComplete="new-password"
                        className="mt-2 min-h-11 w-full rounded-xl border border-soft-gray bg-white px-4 py-2 font-normal"
                        id="confirm-vault-passphrase"
                        onChange={(event) => setConfirmPassphrase(event.target.value)}
                        required
                        type="password"
                        value={confirmPassphrase}
                      />
                    </label>
                    <p className="text-xs leading-5 text-ink/65">
                      Use at least 12 characters. ASTRAVA cannot reset this
                      passphrase; the generated recovery key can unlock your
                      vault and set a new one.
                    </p>
                    <Button disabled={busy} type="submit">
                      {busy ? 'Preparing encryption…' : 'Prepare encrypted account'}
                    </Button>
                  </form>
                ) : (
                  <div className="space-y-5">
                    <p className="text-sm leading-6 text-ink/75">
                      Save this recovery key somewhere private and separate
                      from your account password. It is shown only during
                      account setup and can recover both account access and
                      vault contents.
                    </p>
                    <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-900">
                      If you lose both your account password and this recovery
                      key, ASTRAVA cannot restore your encrypted vault.
                    </p>
                    <p className="break-all rounded-xl border border-champagne/50 bg-champagne/10 p-4 font-mono text-sm text-ink">
                      {prepared.recoveryKey}
                    </p>
                    <label className="flex min-h-11 items-start gap-3 text-sm leading-6 text-ink">
                      <input
                        checked={recoveryConfirmed}
                        className="mt-1 size-4 accent-[#765522]"
                        onChange={(event) => setRecoveryConfirmed(event.target.checked)}
                        type="checkbox"
                      />
                      <span>I have saved this recovery key and understand it cannot be retrieved later.</span>
                    </label>
                    <div className="flex flex-wrap gap-3">
                      <Button
                        disabled={busy || !recoveryConfirmed}
                        onClick={completeRegistration}
                        type="button"
                      >
                        Create encrypted account
                      </Button>
                      <Button
                        disabled={busy}
                        onClick={() => setPrepared(null)}
                        type="button"
                        variant="quiet"
                      >
                        Start over
                      </Button>
                    </div>
                  </div>
                )}
                <button
                  className="mt-4 min-h-11 text-sm font-semibold text-[#765522] underline"
                  onClick={() => {
                    setPrepared(null)
                    setMode('login')
                    setError('')
                  }}
                  type="button"
                >
                  Already have an account? Sign in
                </button>
              </div>
            )}

            {(vault.status === 'locked' || (vault.status === 'signed-out' && mode === 'recover')) && (
              <div className="mt-6 space-y-8">
                {vault.status === 'locked' && mode !== 'recover' && (
                  <form className="space-y-5" onSubmit={unlock}>
                    <p className="text-sm text-ink/70">
                      Signed in as {vault.account?.email}. Your encrypted
                      profile and saved conversations stay locked until you
                      enter the vault passphrase.
                    </p>
                    <label className="block text-sm font-semibold text-ink" htmlFor="unlock-passphrase">
                      Vault passphrase
                      <input
                        autoComplete="current-password"
                        className="mt-2 min-h-11 w-full rounded-xl border border-soft-gray bg-white px-4 py-2 font-normal"
                        id="unlock-passphrase"
                        onChange={(event) => setPassphrase(event.target.value)}
                        required
                        type="password"
                        value={passphrase}
                      />
                    </label>
                    <Button disabled={busy} type="submit">
                      {busy ? 'Unlocking…' : 'Unlock vault'}
                    </Button>
                    <button
                      className="ml-3 min-h-11 text-sm font-semibold text-[#765522] underline"
                      onClick={() => setMode('recover')}
                      type="button"
                    >
                      Recover with key
                    </button>
                  </form>
                )}
                {mode === 'recover' && (
                  <form className="space-y-5" onSubmit={recover}>
                    <label className="block text-sm font-semibold text-ink" htmlFor="recovery-email">
                      Account email
                      <input
                        autoComplete="email"
                        className="mt-2 min-h-11 w-full rounded-xl border border-soft-gray bg-white px-4 py-2 font-normal"
                        id="recovery-email"
                        onChange={(event) => setEmail(event.target.value)}
                        required
                        type="email"
                        value={email || vault.account?.email || ''}
                      />
                    </label>
                    <label className="block text-sm font-semibold text-ink" htmlFor="recovery-key">
                      Recovery key
                      <input
                        autoComplete="off"
                        className="mt-2 min-h-11 w-full rounded-xl border border-soft-gray bg-white px-4 py-2 font-normal"
                        id="recovery-key"
                        onChange={(event) => setRecoveryKey(event.target.value)}
                        required
                        type="password"
                        value={recoveryKey}
                      />
                    </label>
                    <label className="block text-sm font-semibold text-ink" htmlFor="recovery-new-account-password">
                      New account password
                      <input
                        autoComplete="new-password"
                        className="mt-2 min-h-11 w-full rounded-xl border border-soft-gray bg-white px-4 py-2 font-normal"
                        id="recovery-new-account-password"
                        minLength={12}
                        onChange={(event) => setPassword(event.target.value)}
                        required
                        type="password"
                        value={password}
                      />
                    </label>
                    <label className="block text-sm font-semibold text-ink" htmlFor="recovery-confirm-account-password">
                      Confirm new account password
                      <input
                        autoComplete="new-password"
                        className="mt-2 min-h-11 w-full rounded-xl border border-soft-gray bg-white px-4 py-2 font-normal"
                        id="recovery-confirm-account-password"
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        required
                        type="password"
                        value={confirmPassword}
                      />
                    </label>
                    <label className="block text-sm font-semibold text-ink" htmlFor="recovery-new-passphrase">
                      New vault passphrase
                      <input
                        autoComplete="new-password"
                        className="mt-2 min-h-11 w-full rounded-xl border border-soft-gray bg-white px-4 py-2 font-normal"
                        id="recovery-new-passphrase"
                        minLength={12}
                        onChange={(event) => setPassphrase(event.target.value)}
                        required
                        type="password"
                        value={passphrase}
                      />
                    </label>
                    <Button disabled={busy} type="submit">
                      {busy ? 'Recovering…' : 'Recover and set new passphrase'}
                    </Button>
                    <button
                      className="ml-3 min-h-11 text-sm font-semibold text-[#765522] underline"
                      onClick={() => {
                        setMode('login')
                        setError('')
                      }}
                      type="button"
                    >
                      Back to sign in
                    </button>
                  </form>
                )}
              </div>
            )}

            {vault.status === 'unlocked' && (
              <div className="mt-6 space-y-6">
                <p className="text-sm leading-6 text-ink/75">
                  Signed in as <strong>{vault.account?.email}</strong>. The
                  encryption key is held only in this page’s memory.
                </p>
                {vault.contents?.birthDetails ? (
                  <section aria-labelledby="saved-profile-title">
                    <h3 className="font-semibold text-ink" id="saved-profile-title">
                      Saved birth profile
                    </h3>
                    <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                      <div><dt className="text-ink/70">Date</dt><dd>{vault.contents.birthDetails.birthDate}</dd></div>
                      <div><dt className="text-ink/70">Birth time</dt><dd>{vault.contents.birthDetails.birthTime ?? 'Unknown'}</dd></div>
                      <div><dt className="text-ink/70">City</dt><dd>{vault.contents.birthDetails.city}</dd></div>
                      <div><dt className="text-ink/70">Country code</dt><dd>{vault.contents.birthDetails.countryCode}</dd></div>
                      <div><dt className="text-ink/70">Timezone</dt><dd>{vault.contents.birthDetails.timezone}</dd></div>
                      <div><dt className="text-ink/70">System</dt><dd>{vault.contents.birthDetails.system === 'vedic' ? 'Vedic' : 'Western'}</dd></div>
                    </dl>
                  </section>
                ) : (
                  <p className="text-sm text-ink/70">
                    No birth profile is saved. You can add one from the birth
                    details form and choose encrypted account saving.
                  </p>
                )}
                <p className="text-sm text-ink/70">
                  Saved conversations: {vault.contents?.conversations.length ?? 0}
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button onClick={() => navigate('/explore')} type="button">
                    Explore your chart
                  </Button>
                  <Button
                    onClick={() => navigate('/birth-details')}
                    type="button"
                    variant="quiet"
                  >
                    Edit birth profile
                  </Button>
                  <Button
                    onClick={vault.lock}
                    type="button"
                    variant="quiet"
                  >
                    Lock vault
                  </Button>
                  <Button
                    disabled={busy}
                    onClick={signOut}
                    type="button"
                    variant="quiet"
                  >
                    Sign out
                  </Button>
                </div>
                <div className="border-t border-soft-gray pt-5">
                  <p className="mb-4 text-sm leading-6 text-ink/75">
                    Deletion removes your account, vault, and sessions from the
                    active database. This prototype does not configure backups;
                    deployments that enable encrypted backups need a separate
                    retention policy, so copies may remain until those backups
                    expire.
                  </p>
                  <label className="flex min-h-11 items-start gap-3 text-sm leading-6 text-ink">
                    <input
                      checked={deleteConfirmed}
                      className="mt-1 size-4 accent-[#765522]"
                      onChange={(event) => setDeleteConfirmed(event.target.checked)}
                      type="checkbox"
                    />
                    <span>I understand deleting my account permanently removes its encrypted profile and conversations.</span>
                  </label>
                  <Button
                    className="mt-3"
                    disabled={busy || !deleteConfirmed}
                    onClick={deleteAccount}
                    type="button"
                    variant="quiet"
                  >
                    Delete account and encrypted vault
                  </Button>
                </div>
              </div>
            )}

            {error && (
              <p className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-900" role="alert">
                {error}
              </p>
            )}
            {vault.pendingBirthDetails && vault.status !== 'unlocked' && (
              <Button
                className="mt-5"
                onClick={() => {
                  vault.setPendingBirthDetails(null)
                  navigate('/')
                }}
                type="button"
                variant="quiet"
              >
                Discard unsaved birth details
              </Button>
            )}
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}

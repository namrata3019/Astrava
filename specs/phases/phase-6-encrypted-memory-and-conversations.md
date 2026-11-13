# Phase 6 — Encrypted profile and resumable conversations

## Goal

Let users explicitly save birth details and return to chart-exploration
conversations using an account-backed vault that is encrypted in the browser
before it reaches the self-hosted API.

## In scope

- Add account registration, sign-in, sign-out, session handling, and a
  user-controlled recovery flow that can reset account access and the vault
  passphrase to the self-hosted TypeScript API.
- Use PostgreSQL for account metadata, hashed session tokens, a recovery-proof
  verifier, and an opaque encrypted vault envelope. Never store plaintext
  birth details, conversation messages, passphrases, or raw recovery keys.
- Encrypt the vault in the browser with Web Crypto before any network request.
  Keep the data-encryption key in memory only; wrap it with a passphrase-derived
  key and a generated high-entropy recovery key. Explain that losing both
  credentials makes the vault unrecoverable.
- Require explicit consent before birth details are saved. The existing
  sample-only flow remains available without an account and must clear unsaved
  values after submission.
- Add an accessible `/explore` conversation experience with guided topics,
  free-text questions, conversation history, and the ability to resume after
  signing in and unlocking the vault.
- Persist birth details and conversation messages together only inside the
  encrypted vault. Label assistant replies as sample/preview content; do not
  claim personalized astrology or AI answers while chart calculations and an
  interpretation service remain mock-only.
- Provide account/vault inspection and deletion controls and clear states for
  locked, empty, loading, invalid-key, offline, and API-error conditions.
- Add a PostgreSQL migration, environment-based API configuration, local
  development instructions, and tests for encryption, recovery, authorization,
  and ciphertext-only persistence.

## Out of scope

Real chart calculations, paid AI or astrology services, production hosting,
email delivery, guaranteed multi-region availability, and claims that astrology
is scientifically validated.

## Acceptance criteria

- No birth details or conversation content leave the browser except as
  authenticated encrypted ciphertext after explicit consent.
- Database records contain no plaintext vault content, passwords, raw recovery
  keys, or encryption keys. The API hashes account passwords and recovery
  proofs, stores only token hashes for sessions, and never logs request bodies.
- A vault can be encrypted, saved, fetched, unlocked with its passphrase,
  recovered with its recovery key, and re-encrypted with a new passphrase and
  account password.
  Wrong credentials fail closed without replacing or corrupting the vault.
- A user can create, resume, and delete conversations; refresh/sign-out does
  not erase saved conversations, and another account cannot access them.
- Sample charts and conversation replies are persistently labelled as sample
  content; no mock placements are described as the user's verified chart.
- Deletion removes account-owned vault and session records; the UI explains
  that encrypted backups, if enabled by a deployment, need a separate retention
  policy.
- Forms, dialogs, chat controls, errors, focus behavior, and mobile layouts meet
  the shared accessibility guardrails.
- Relevant tests and the application/API type checks pass. Live deployment and
  production TLS configuration are reported as limitations unless verified.

## Handoff

Report implemented behavior, changed files, run instructions, actual checks,
database setup requirements, and known key-recovery/security limitations. Stop
and wait for approval before starting another phase.

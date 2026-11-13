# Shared project guardrails

These constraints apply in every phase. The product brief in [`project.md`](../project.md)
is authoritative; a user decision may clarify it but must not be silently
overridden by a phase spec.

## Product truth and astrology integrity

- Keep Vedic sidereal and Western tropical calculations as separate pipelines.
- Calculate chart data before interpreting it. No language model or
  interpretation code may invent or modify positions, houses, aspects, signs,
  or Dasha periods.
- Until real calculations are explicitly approved, use mock adapters and
  fixtures only. Keep fixtures out of calculation functions and identify mock
  results in the data and in every relevant UI surface.
- Keep calculation settings explicit and visible wherever chart results or
  methodology are presented.
- Use balanced, non-deterministic language. Do not promise outcomes about
  health, relationships, finances, or career. Include the self-reflection and
  entertainment disclaimer specified in the brief.

## Privacy, security, and service constraints

- Never log real birth details, account passwords, recovery proofs, or vault
  payloads. Do not put server secrets in frontend code.
- The prototype's sample flow remains ephemeral. Persist real birth details or
  conversation history only after explicit user consent, as browser-encrypted
  vault ciphertext in the self-hosted PostgreSQL service.
- The API must never receive plaintext birth details, conversation content,
  passphrases, or raw recovery keys. Keep encryption keys in memory only; use a
  user-controlled passphrase and a generated recovery key, with clear loss and
  recovery consequences.
- Use authenticated, owner-scoped API access, secure session handling, rate
  limits for authentication/recovery, and TLS in deployment. Provide usable
  inspection and deletion controls before claiming those controls exist.
- Do not introduce paid APIs or services. Ask before choosing a free external
  geocoding/timezone source if it creates a material privacy, licensing, or
  availability trade-off.
- Do not add a real ephemeris/calculation dependency without first presenting
  licence, accuracy, and commercial-use implications and receiving approval.
- Do not claim end-to-end encryption, deletion, retention, or privacy
  controls exist until they are implemented and verified.

## UX and accessibility

- Design mobile-first; preserve responsive behavior on mobile, tablet, and
  desktop.
- Use semantic HTML, labelled controls, keyboard-operable interactions,
  visible focus, and appropriate accessible names and error messages.
- Provide text equivalents for chart visualizations.
- Explain astrological terminology in plain language and make uncertainty about
  birth time clear. Never silently assume a birth time or astrology system.
- Explain next steps in loading, empty, and error states.
- Label sample content persistently as sample data, not the user's chart.

## Engineering and change control

- Inspect the workspace, package scripts, runtime versions, and git status
  before implementation. Read files before changing them; preserve unrelated
  user changes.
- Keep calculation logic independent of React and preserve the architecture and
  strict TypeScript conventions in the brief.
- Add only dependencies needed by the approved phase, explain each one, and
  use existing project tools for validation.
- Do not bundle unrelated cleanup or implement future-phase features early.
- If requirements conflict, a consequential design decision is unsettled, or a
  check cannot run, report that plainly and ask one concise question where
  needed.

## Phase completion and handoff

- Report what changed, files changed, how to run it, checks and their actual
  results, and known limitations.
- Do not say a behavior works unless it has been implemented and verified.
- Stop after each phase and wait for approval before proceeding.

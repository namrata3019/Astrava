# Phase 2 — Birth details and mock-data flow

## Goal

Collect only the details needed for a chart, validate them accessibly, make the
astrology-system choice explicit, and connect the flow to clearly labelled
mock results.

## In scope

- Implement the multi-step birth-details form in `project.md`, including
  optional name, birth date, birth time, city, country, and explicit Vedic or
  Western selection.
- Validate inputs with the project's established validation approach and
  show accessible inline errors.
- Provide an explicit unknown-birth-time mode that explains which results are
  unavailable or less reliable; never infer a time.
- Capture an IANA timezone from an approved free/local source. Before choosing
  an external source, surface material privacy, licence, and availability
  trade-offs for user decision.
- Connect the sample path to mock data only. Mark sample output clearly.
- Allow users to explicitly choose the encrypted account-save path defined in
  [Phase 6](phase-6-encrypted-memory-and-conversations.md); otherwise keep form
  values in memory and clear them after the sample preview.

## Out of scope

Real chart calculations and paid geocoding/timezone services. Account creation,
encrypted persistence, and conversation history are specified and implemented
only in Phase 6.

## Acceptance criteria

- The user explicitly chooses an astrology system; neither the form nor
  downstream UI silently selects one.
- Required and optional fields are clear; date/time validation and error
  announcements are accessible.
- Unknown-time behavior is explained and does not show unsupported Ascendant or
  house results as certain.
- The chosen timezone is represented explicitly. Historical timezone/DST
  limitations are documented rather than hidden.
- Unsaved birth data is not logged or persisted; when the user explicitly saves,
  only client-encrypted vault ciphertext is sent. All mock data remains visibly
  identified as sample data.
- Relevant existing checks pass and the form is usable by keyboard at mobile
  and desktop widths.

## Handoff

Report implemented behavior, changed files, run instructions, actual checks,
and known limitations, including timezone-source and historical-time caveats.
Stop and wait for approval before Phase 3.

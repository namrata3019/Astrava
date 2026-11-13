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
- Connect form output to mock data only. Mark sample output clearly and persist
  no real birth details.

## Out of scope

Real chart calculations, database or server persistence, authentication, and
paid geocoding/timezone services.

## Acceptance criteria

- The user explicitly chooses an astrology system; neither the form nor
  downstream UI silently selects one.
- Required and optional fields are clear; date/time validation and error
  announcements are accessible.
- Unknown-time behavior is explained and does not show unsupported Ascendant or
  house results as certain.
- The chosen timezone is represented explicitly. Historical timezone/DST
  limitations are documented rather than hidden.
- Birth data is not logged or persisted, and all mock data remains visibly
  identified as sample data.
- Relevant existing checks pass and the form is usable by keyboard at mobile
  and desktop widths.

## Handoff

Report implemented behavior, changed files, run instructions, actual checks,
and known limitations, including timezone-source and historical-time caveats.
Stop and wait for approval before Phase 3.

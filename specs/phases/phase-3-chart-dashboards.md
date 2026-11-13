# Phase 3 — Vedic and Western chart dashboards

## Goal

Present mock chart data in distinct Vedic and Western dashboard experiences
using reusable, accessible chart components and a stable calculator contract.

## In scope

- Define shared strict types and the `AstrologyCalculator` contract described
  in `project.md`.
- Implement separate Vedic and Western mock adapters; keep their settings and
  chart semantics distinct.
- Build reusable planetary placement, chart diagram, summary, distribution,
  and key-insight components where applicable to each system.
- Display the relevant fields from the brief: signs, Ascendant, placements,
  houses, Nakshatra/Pada and Dasha for Vedic where fixture data supports them;
  aspects, elements, and modalities for Western where fixture data supports
  them.
- Show the selected system, explicit calculation settings, and persistent
  mock-data labeling. Provide a screen-reader-friendly chart summary.

## Out of scope

Real ephemeris integration, real transit/progression calculations, divisional
charts beyond the agreed prototype scope, and any change that mixes sidereal
and tropical positions.

## Acceptance criteria

- Vedic and Western adapters satisfy the same typed contract without sharing
  or converting position data across systems.
- Mock fixtures live in the fixture layer and every mock result is tagged so
  the UI can identify it.
- Chart visualizations have equivalent accessible text; tables and controls
  are keyboard operable.
- Missing or unsupported fixture fields are not fabricated; their absence is
  communicated appropriately.
- Adapter contract and relevant input behavior have tests using the existing
  test setup.
- Relevant existing checks pass and layouts work at mobile and desktop widths.

## Handoff

Report implemented behavior, changed files, run instructions, actual checks,
and remaining mock-data limitations. Stop and wait for approval before Phase 4.

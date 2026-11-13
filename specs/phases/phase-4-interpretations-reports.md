# Phase 4 — Interpretations, reports, and methodology

## Goal

Add a transparent, structured interpretation preview and sample report
catalogue, and explain how the prototype handles calculation and interpretation.

## In scope

- Implement `interpretationService` with Zod-validated `ChartData` input and
  structured output, without mutating its input.
- Keep interpretation rules separate from prompts and calculation logic; no
  paid LLM/API integration in this phase.
- Show the interpretation areas specified in the brief and identify the chart
  placements each section draws on.
- Add the report catalogue with sample previews and disabled checkout marked
  "Coming soon".
- Add the methodology page covering Vedic vs Western, settings, calculation
  boundaries, interpretation approach, known limitations, and mock-data status.
- Preserve the required reflective language and disclaimer.

## Out of scope

Paid AI services, checkout/payment, guarantees or deterministic advice, and
real calculation integrations.

## Acceptance criteria

- Invalid chart input is rejected through the established schema validation;
  interpretation does not alter chart data.
- Each displayed interpretation is traceable to supported chart inputs and
  does not invent placements or timing.
- Sample report content and mock-dependent interpretations are clearly
  labelled; checkout cannot appear functional.
- Methodology accurately describes what is and is not implemented.
- Relevant existing tests, type checks, and other project checks pass; content
  and controls remain keyboard and screen-reader accessible.

## Handoff

Report implemented behavior, changed files, run instructions, actual checks,
and known limitations. Stop and wait for approval before Phase 5.

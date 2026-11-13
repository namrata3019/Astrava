---
name: astrava-project
description: Use when planning, implementing, reviewing, or handing off ASTRAVA project work. Enforces the project's phase specs, approval gates, astrology-integrity rules, privacy constraints, and validation workflow.
---

# ASTRAVA project workflow

Use this skill for ASTRAVA product, design, architecture, implementation, and
quality work in this workspace.

## Read before acting

1. Read the project brief at `project.md`.
2. Read `specs/README.md`, `specs/guardrails.md`, and the matching
   `specs/phases/phase-N-*.md`.
3. Inspect the current workspace, package scripts, versions, git state, and
   relevant files. Read a file before editing it; preserve unrelated changes.
4. Use the kickoff template at
   `.github/skills/astrava-project/templates/phase-kickoff.md` to check scope,
   decisions, and the proposed validation.

If a referenced file is missing, do not pretend its instructions were checked.
Use the available brief and ask the user if the missing information affects
scope or behavior.

## Clarify and gate

- Treat `project.md` as the source of truth, followed by explicit user
  decisions. If sources conflict or a consequential behavior is undecided,
  ask one short question at a time; do not guess.
- For Phase 1, inspect first, then report environment findings, conflicts, and
  the exact proposed dependencies with one-line justifications. Do not change
  code until the user approves.
- Work only within the approved phase. Do not silently pull in future-phase
  work or broaden the task.
- At phase end, use the closeout template, report actual validation results and
  limitations, then stop for approval before starting another phase.

## Non-negotiable guardrails

- Keep Vedic sidereal and Western tropical data paths separate. Chart
  calculation is deterministic and precedes interpretation.
- Until real calculations are explicitly approved, use fixture-backed mock
  adapters only. Tag mock results and label them as sample data in the UI.
  Never invent chart data or ask an LLM to calculate it.
- Do not add an ephemeris dependency until licence, accuracy, and commercial-use
  implications are presented and approved.
- Do not log or persist real birth details. No secrets in frontend code, paid
  APIs, authentication, or database in the prototype.
- Use reflective, non-deterministic interpretations and the required
  self-reflection/entertainment disclaimer; do not guarantee outcomes.
- Preserve accessible, responsive behavior and explain uncertainty, missing
  data, errors, and next steps.
- Add only phase-necessary dependencies and validate using tools already in
  the project. Never claim a check passed unless it was run.

For detailed requirements and exception handling, follow `specs/guardrails.md`.

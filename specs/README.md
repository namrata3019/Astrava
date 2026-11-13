# ASTRAVA delivery specifications

These phase specs turn the milestones in [`project.md`](../project.md) into
reviewable implementation scopes. `project.md` remains the product and
architecture source of truth; these documents clarify phase boundaries,
acceptance criteria, and handoffs. If they conflict, stop and ask which
requirement to follow.

## Phases

| Phase | Scope | Spec |
|---|---|---|
| 1 | Foundation and homepage | [phase-1-foundation.md](phases/phase-1-foundation.md) |
| 2 | Birth details and mock-data flow | [phase-2-birth-details.md](phases/phase-2-birth-details.md) |
| 3 | Vedic and Western chart dashboards | [phase-3-chart-dashboards.md](phases/phase-3-chart-dashboards.md) |
| 4 | Interpretations, reports, and methodology | [phase-4-interpretations-reports.md](phases/phase-4-interpretations-reports.md) |
| 5 | Quality, accessibility, and handoff | [phase-5-quality-handoff.md](phases/phase-5-quality-handoff.md) |

## Operating sequence

1. Read the relevant phase spec and [shared guardrails](guardrails.md).
2. Inspect the workspace and the existing implementation before proposing edits.
3. Identify decisions that are not already settled by `project.md` or the user.
   Ask one focused question at a time; do not fill gaps with invented
   requirements.
4. For Phase 1, report the environment, conflicts, and proposed dependencies,
   then wait for the user's go-ahead before changing code.
5. Implement only the approved phase scope, in small reviewable increments.
6. Run the existing, relevant checks and report exact commands and outcomes.
7. Complete the [phase closeout](../.github/skills/astrava-project/templates/phase-closeout.md)
   and stop for approval before moving to another phase.

## Phase gates

A phase is ready to close only when its acceptance criteria are met, relevant
existing checks pass, and remaining limitations are disclosed. If an acceptance
criterion cannot be met without an unresolved decision, record the blocker and
ask rather than quietly weakening the criterion.

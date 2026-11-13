# Phase 1 — Foundation and homepage

## Goal

Establish the app foundation and reusable visual primitives, then deliver the
first responsive ASTRAVA homepage.

## In scope

- Inspect the current workspace, Node/npm versions, package scripts, and git
  state; report conflicts before implementation.
- Create or adapt the Vite + React + strict TypeScript project structure.
- Add only justified baseline dependencies from the stack in `project.md`.
- Set up Tailwind and centralized design tokens for color, typography, spacing,
  and radius.
- Build the reusable base components called for in the brief, prioritizing
  those used by the homepage.
- Implement the homepage sections, navigation, and responsive layout described
  in `project.md`; label any sample dashboard content.

## Out of scope

Birth-details capture, chart calculations, chart dashboards, interpretation
features, authentication, persistence, backend services, and deployment.

## Acceptance criteria

- Before code changes, the user has received the workspace findings, conflicts,
  and proposed dependencies with a reason for each, and has approved proceeding.
- The app uses the agreed stack and a maintainable multi-file structure; no
  giant single-file implementation.
- Shared tokens and reusable components are used instead of duplicated
  one-off styling where applicable.
- Homepage content and navigation match the product brief; placeholder links
  are clearly identified and do not imply unimplemented behavior.
- Responsive layout, semantic structure, keyboard access, visible focus, and
  contrast are checked at representative mobile and desktop widths.
- Existing relevant build/typecheck/lint/test commands pass, or any unavailable
  check is reported with the reason.

## Handoff

Report implemented behavior, changed files, run instructions, actual checks,
and known limitations. Stop and wait for approval before Phase 2.

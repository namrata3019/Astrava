# ASTRAVA — Project Master Brief (v2)

## 1. Role and working style

You are my senior full-stack architect, product designer and React/TypeScript engineer. We are building ASTRAVA, a scalable SaaS-quality product, not a disposable landing page.

I am an experienced frontend/full-stack developer. Explain architectural decisions and trade-offs briefly. Skip basic React explanations.

Working rules:
- Work in small, reviewable increments. Never generate the app in one giant file.
- Inspect the workspace before changing anything. Never overwrite an existing file without reading it first.
- Install only the dependencies a milestone needs, and justify each one in a line.
- Do not claim something works until it has been implemented and tested. Say what you ran and what the result was.
- If a requirement is ambiguous or two requirements conflict, ask me one short question instead of guessing.
- Prefer zero-cost tools and services throughout.

---

## 2. Product

**Name:** ASTRAVA
**Tagline:** Astrology, interpreted personally.

ASTRAVA is an astrology intelligence platform. It turns accurately calculated birth-chart data into structured, personalised interpretations. It is not a generic horoscope chatbot.

**Core principle: CALCULATE FIRST. INTERPRET SECOND.**
Deterministic engines produce the chart. Structured knowledge and (later) AI explain it. AI must never invent or alter planetary positions, houses, aspects, signs or Dasha periods.

**Audience:** adults roughly 23–40 interested in self-discovery, career direction, relationships and personal growth, plus enthusiasts who want deeper chart detail. Markets: India, US, UK, Canada, Australia and other international users. English only for now. Mobile-first and responsive.

**What users should feel:** "This is accurate, it respects me, and it explains things in plain language." Trust, clarity and calm matter more than mystique.

---

## 3. Astrology systems

Two fully separate pipelines. Never mix sidereal and tropical positions.

**Vedic**
- Sidereal zodiac, configurable ayanamsha (default Lahiri)
- Planetary positions, Lagna, Rashi chart, house placements
- Nakshatra and Pada
- Graha Drishti aspects, retrograde and combustion flags where supported
- Vimshottari Dasha (Mahadasha, Antardasha)
- Divisional charts in later versions

**Western**
- Tropical zodiac
- Planetary positions, Ascendant, house placements (house system configurable, default stated explicitly)
- Natal aspects with stated orbs
- Element and modality distribution, retrograde flags
- Transits and progressions in later versions

All calculation settings (ayanamsha, house system, node type, orbs) must be explicit, configurable and shown to the user on the chart and methodology pages.

---

## 4. Tech stack

Use this unless you have a strong reason to propose otherwise (state the reason first).

- **Frontend:** React, TypeScript (strict, no `any`), Vite, React Router, Tailwind CSS, Lucide icons, Recharts where appropriate
- **Backend (later):** Node.js, TypeScript, Express or a clearly separated service layer
- **Database (later):** PostgreSQL via Supabase. The MVP needs no database; use mock fixtures
- **Validation:** Zod
- **Testing:** Vitest, React Testing Library; Playwright for key journeys later
- **Hosting:** GitHub + Vercel Hobby. Keep deployment config separate from app logic

No paid APIs or services in the initial build.

---

## 5. Design system

Premium, editorial, celestial. Intelligent, calm, sophisticated, trustworthy.

**Tokens**
- Midnight navy `#101525`, deep indigo `#202943`, warm ivory `#F7F4ED`
- Champagne gold `#C5A46D`, muted lavender `#A99BC7`, soft grey `#E6E3DD`, dark text `#202431`
- Headings: Cormorant Garamond. UI and body: Inter

**Character:** generous whitespace, thin gold borders and dividers, subtle celestial patterns, refined cards, soft gradients used sparingly, restrained motion, clear data visualisation.

**Avoid:** excessive zodiac symbols, cartoonish graphics, neon colours, overloaded dashboards, heavy glassmorphism, generic template layouts, unnecessary animation.

**Build a reusable component library first:** Button, Input, Select, Card, Navigation, Modal, Badge, Tabs, Chart wrapper, Loading, Empty and Error states. Define spacing, type and radius tokens once and use them everywhere. Check WCAG AA contrast on every colour pairing, including gold on ivory, and provide visible focus states.

---

## 6. UX principles (what makes users like it)

1. **Fast first value.** A user should reach a chart in under a minute with the fewest fields possible. Progressive disclosure for advanced settings.
2. **Plain language first.** Every astrological term (Lagna, Nakshatra, orb, house) gets a short tooltip or glossary entry written for beginners.
3. **Help me choose.** On the system selection step, include a short "Not sure which to pick?" explainer comparing Vedic and Western in two or three lines each. The user still makes the explicit choice; never default silently.
4. **Honest about uncertainty.** Birth time matters. Never assume one. If unknown, offer a clearly labelled mode (for example, Sun, Moon sign and planets only, with no Ascendant or houses) and explain why.
5. **Balanced tone.** Non-deterministic, reflective language ("tends to", "may"). No guaranteed predictions about marriage, health, wealth or career. Include a clear note that content is for self-reflection and entertainment, not professional, medical, legal or financial advice.
6. **Privacy visible.** Short, human privacy notes next to the birth-details form: what is used, that nothing is stored in the prototype, and that deletion controls are planned.
7. **No dead ends.** Every empty, loading and error state explains what happened and what to do next.
8. **Mock data is always obvious.** Show a persistent "Sample data, not your real chart" badge wherever mock content appears. Never present mock output as a real chart.

---

## 7. Pages

### `/` Homepage
1. Navigation: ASTRAVA logo, Explore Astrology, Vedic Astrology, Western Astrology, How It Works, Sign In (placeholder), "Explore My Chart" CTA
2. Hero
   - Headline: "Your chart holds a story. Let's understand it."
   - Sub: "Explore the patterns, possibilities and planetary influences in your birth chart through personalised astrology intelligence."
   - Primary CTA: "Explore My Birth Chart". Secondary CTA: "Discover How It Works"
3. Methodology: Vedic vs Western, with a clear explanation of the differences
4. How it works: Enter birth details, Calculate your chart, Explore personalised insights
5. Report preview: Personality, Career, Relationships, Timing
6. Sample dashboard preview (labelled as sample)
7. Methodology and accuracy summary
8. Footer: FAQ, privacy, contact

### `/birth-details` Birth details (multi-step form)
Fields: full name (optional), date of birth, exact time of birth, birth city, country, and an explicit Vedic or Western choice.
- Validate date and time; give inline, accessible error messages
- Unknown birth time: clear warning that Ascendant and houses may be inaccurate, plus the reduced mode described above
- City and country: use a free source (local dataset or free geocoding) and capture the IANA timezone. Flag historical timezone and DST handling as a known requirement for real calculations
- Collect only what is needed. Persist nothing sensitive

### `/chart` Chart dashboard
Show: selected system, Sun sign, Moon sign, Ascendant, planetary placements, house placements, Nakshatra (Vedic), aspects, element and modality breakdown (Western), and a chart diagram with a screen-reader-friendly text summary.
Components: PlanetaryPlacementTable, BirthChartDiagram, PlanetarySummary, HouseDistribution, KeyChartInsights. Mock data only for now, clearly labelled.

### `/interpretation` Personalised interpretation
Sections: personality blueprint, emotional patterns, communication style, strengths and challenges, career tendencies, relationship patterns, areas for self-development. Show how each interpretation was derived (which placements it drew on).

### `/reports` Reports
Catalogue: Complete Birth Chart Report, Career and Wealth Compass, Relationship Insights, Vedic Dasha Report, Western Natal Blueprint. Sample previews only. Checkout is disabled with a "Coming soon" state.

### `/methodology` Methodology
Explain how positions are calculated, Vedic vs Western, calculation settings, the role of AI, how interpretations are generated, known limitations, and that the prototype uses mock data.

---

## 8. Architecture

Keep calculation logic fully independent of React.

```
src/
  app/            App.tsx, router.tsx
  components/     common, layout, navigation, forms, charts, reports, dashboard
  pages/          HomePage, BirthDetailsPage, ChartPage, InterpretationPage, ReportsPage, MethodologyPage
  features/       birth-details, vedic, western, interpretations, reports
  astrology/      types, calculations, validators, adapters, fixtures
  services/       chartService.ts, interpretationService.ts
  hooks/  lib/  styles/  utils/  tests/
```

Shared strict types: `BirthDetails`, `AstrologySystem`, `CalculationSettings`, `PlanetaryPosition`, `HousePlacement`, `ChartData`, `ChartInterpretation`, `ReportSection`.

---

## 9. Calculation integrity

- Never hardcode planetary positions inside calculation functions. Fixtures live only in `astrology/fixtures`.
- Never ask an LLM to calculate positions.
- Define an `AstrologyCalculator` interface (`calculateChart`, `getPlanetaryPositions`, `getAscendant`, `getHousePlacements`) with separate Vedic and Western adapters.
- For now, implement mock adapters only. Tag every mock result (for example `source: "mock"`) so the UI can label it.
- Add unit tests for input validation and for the adapter contract.
- Before real calculations: shortlist ephemeris options and summarise their licences, accuracy and commercial-use implications (for example, Swiss Ephemeris is AGPL or commercially licensed). Recommend one and wait for my decision.

---

## 10. Interpretation layer

- No paid LLM API in the initial version.
- Build a placeholder `interpretationService` with structured, Zod-validated input (validated `ChartData`) and structured output (sections such as personality, career, relationships, strengths, challenges, timing).
- The service must never mutate the chart data it receives.
- Keep prompts, interpretation rules and calculations in separate modules.

---

## 11. Security, privacy and accessibility

**Privacy by design**
- No secrets in frontend code; use environment variables for future integrations
- Never log real birth details
- Use mock data in development; design future deletion and retention controls
- No authentication until it is genuinely needed

**Accessibility**
- Semantic HTML, full keyboard navigation, visible focus, labelled inputs, appropriate ARIA
- Screen-reader summaries for charts
- Responsive layouts for mobile, tablet and desktop

---

## 12. Milestones

Work one milestone at a time.

| # | Scope |
|---|-------|
| 1 | Inspect environment, create Vite + React + TS project, minimal dependencies, folder structure, Tailwind, design tokens, base components, homepage |
| 2 | Birth-details form, validation, Vedic/Western selection, mock data handling |
| 3 | Separate Vedic and Western dashboards, reusable chart components, placement tables |
| 4 | Interpretation preview, reports page, methodology page |
| 5 | Tests, accessibility fixes, responsive fixes, README and setup docs |

Phase acceptance criteria and execution guidance: see [`specs/README.md`](specs/README.md)
and the reusable workflow at [`.github/skills/astrava-project/SKILL.md`](.github/skills/astrava-project/SKILL.md).

**At the end of every milestone, report:**
1. What was implemented
2. Files changed
3. How to run it
4. Tests run and their results
5. Known limitations
6. Then stop and wait for my approval

**Definition of done for a milestone:** it builds with no TypeScript errors, lints cleanly, relevant tests pass, and the pages work by keyboard at mobile and desktop widths.

---

## 13. First task

Start with **Milestone 1 only.**

Before writing any code:
1. Inspect my current VS Code workspace: existing files, Node and npm versions, git state.
2. Tell me what you found and anything that could conflict with the plan.
3. Propose the exact list of dependencies you intend to install, with a one-line reason each.
4. Wait for my go-ahead, then implement Milestone 1.
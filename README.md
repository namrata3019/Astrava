# ASTRAVA

Astrology, interpreted personally.

ASTRAVA is a premium astrology intelligence product that helps users explore their birth chart through clear, structured interpretations and a calm editorial experience. The current project is a frontend prototype focused on positioning, product narrative, and a polished onboarding experience.

## Overview

This project is built around a simple principle:

- Calculate first
- Interpret second
- Explain clearly

The product is designed to keep Vedic and Western astrology distinct, present the user with transparent methodology, and avoid overpromising in language that feels reflective rather than deterministic.

The repository currently includes the public-facing app shell, landing page, and navigation patterns for the upcoming chart and interpretation flow.

## Product vision

ASTRAVA is intended for users who want a more thoughtful and trustworthy way to engage with astrology:

- self-reflection and personal insight
- chart education and methodology
- relationship, career, and timing themes
- mobile-first, elegant product design

The project is designed to feel premium, calm, and intelligent rather than mystical or overly decorative.

## Current status

This repository is in an early prototype stage.

Implemented:

- branded homepage experience
- navigation and footer shell
- editorial style system and layout tokens
- sample “how it works” and methodology sections
- placeholder routes for birth details and future chart/report screens

Not yet implemented:

- actual chart calculation engine
- user input form processing
- real astrology data modeling
- backend or persistence
- report generation and personalized interpretation engine

## Tech stack

- React
- TypeScript
- Vite
- React Router
- Tailwind CSS
- Lucide icons

## Project structure

```bash
.
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   └── router.tsx
│   ├── components/
│   │   ├── common/
│   │   └── navigation/
│   ├── pages/
│   │   ├── ComingSoonPage.tsx
│   │   └── HomePage.tsx
│   ├── styles/
│   ├── main.tsx
│   └── ...
├── index.html
├── package.json
├── tsconfig.app.json
├── vite.config.ts
├── .gitignore
├── project.md
└── README.md
```

## Getting started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Design principles

The experience follows a premium editorial aesthetic:

- midnight navy and warm ivory palette
- mineral, refined typography
- generous whitespace
- restrained motion and subtle visual depth
- clear, plain-language explanations for astrology concepts

## Product and implementation notes

This project follows the idea described in `project.md`, which serves as the product master brief. It includes the original product requirements, UX priorities, and route-level planning for the full ASTRAVA product vision.

The current front-end prototype reflects that direction without claiming to provide the full astrological calculation backend yet.

## Contributing

This is a design-and-prototype codebase with a strong product brief behind it. Changes should stay aligned with the project’s core values:

- clarity over hype
- honesty about uncertainty
- credible chart methodology
- mobile-first UX
- elegant, trustworthy presentation

## License

No explicit license has been configured for this project yet.

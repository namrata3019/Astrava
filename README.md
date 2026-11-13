# ASTRAVA

Astrology, interpreted personally.

ASTRAVA is a premium astrology intelligence product that helps users explore their birth chart through clear, structured interpretations and a calm editorial experience. The prototype now includes optional account-backed encrypted memory and a resumable sample conversation; it does not yet calculate real charts or generate personalized readings.

## Overview

This project is built around a simple principle:

- Calculate first
- Interpret second
- Explain clearly

The product is designed to keep Vedic and Western astrology distinct, present the user with transparent methodology, and avoid overpromising in language that feels reflective rather than deterministic.

The repository includes the public app, mock chart dashboards, an account API, and a client-encrypted profile/conversation vault.

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
- multi-step birth-details form with accessible validation and an explicit
  Vedic/Western choice
- local IANA timezone selection and a clearly labelled, non-personal sample
  preview
- separate Vedic sidereal and Western tropical mock chart dashboards
- optional birth-profile saving after explicit consent; the browser encrypts
  vault contents before sending them to the API
- self-hosted TypeScript/Express API with PostgreSQL account, session, recovery,
  and ciphertext-only vault storage
- account sign-in, vault passphrase unlock, generated recovery key, account
  deletion, and resumable sample conversations
- fixture-backed interpretation previews with inspectable placement evidence,
  sample report outlines, and a methodology page

Not yet implemented:

- actual chart calculation engine or real chart data
- real astrology data modeling
- production deployment, email verification, and operational database backups
- real report generation and personalized interpretation engine

The local timezone picker lists major cities for each IANA timezone. Users must
confirm the timezone for their birth location; historical timezone and
daylight-saving rules are not calculated in this prototype.

The conversation UI stores questions and clearly labelled sample acknowledgments;
it does not call an AI service or use birth details to generate interpretations.
Vault encryption keys remain in page memory. Users must keep their recovery key
safe; it can reset both account access and the vault passphrase. The API stores
only encrypted vault envelopes, but this prototype has not undergone an
independent security review and must not be presented as production-ready. If
both the account password and recovery key are lost, the vault cannot be
recovered. Deleting an account removes active database records; no backups are
configured by this prototype, and any deployment that enables encrypted backups
must define a separate retention policy.

## Tech stack

- React
- TypeScript
- Vite
- React Router
- Tailwind CSS
- Lucide icons
- Zod
- `@vvo/tzdb` for bundled IANA timezone and major-city data
- Express and PostgreSQL (`pg`) for the self-hosted API
- Node.js `scrypt` for account-password and recovery-proof hashing

Run the mock-adapter, birth-details, interpretation, vault-crypto, and API tests with:

```bash
npm test
```

The test suite uses Node's built-in test runner and does not require PostgreSQL;
API behavior is exercised with a fake database pool, not a live database.
`npm run build` type-checks the web app and API before building the frontend.

## Project structure

```bash
.
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   └── router.tsx
│   ├── features/
│   │   ├── birth-details/
│   │   └── vault/
│   ├── pages/
│   │   ├── AccountPage.tsx
│   │   ├── ConversationPage.tsx
│   │   └── ...
│   ├── components/
│   │   ├── common/
│   │   └── navigation/
│   ├── astrology/
│   ├── styles/
│   ├── main.tsx
│   └── ...
├── server/
│   ├── migrations/
│   └── src/
├── index.html
├── package.json
├── tsconfig.app.json
├── vite.config.ts
├── .gitignore
├── project.md
└── README.md
```

## Getting started

Use Node.js 22.6 or newer. PostgreSQL is needed only for the account-backed API;
the sample frontend can run without it.

Install dependencies:

```bash
npm install
```

To run account-backed encrypted saving locally, first create a PostgreSQL
database and apply the migration:

```bash
createdb astrava
export DATABASE_URL="postgresql:///astrava"
psql "$DATABASE_URL" -f server/migrations/001_encrypted_vault.sql
```

In one terminal, start the API:

```bash
DATABASE_URL="postgresql:///astrava" npm run dev:api
```

In another terminal, start Vite:

```bash
npm run dev
```

The Vite development server proxies `/api` to `127.0.0.1:3001`. Configure
`DATABASE_URL` for your PostgreSQL installation. Production deployments must use HTTPS and set `APP_ORIGIN` to the exact public
app origin. Host the web app and API separately if needed, but route API requests
through the same origin or add an explicit, reviewed CORS/CSRF policy.
The API binds to loopback by default; set `HOST=0.0.0.0` only when your
self-hosted reverse proxy requires it.
The API uses the browser's account password and vault recovery flow; it does not
send email verification messages or provide a hosted database.

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

The product and phase requirements are documented in `project.md` and `specs/`.
The encrypted vault is client-side encrypted before transport; the API does not
receive vault plaintext or encryption keys. A deployment that serves the
frontend and API from one operator still requires users to trust the delivered
client code. Production TLS, account email verification, service monitoring,
backup retention, and an independent security review remain necessary before
handling real users' data.

## Contributing

This is a design-and-prototype codebase with a strong product brief behind it. Changes should stay aligned with the project’s core values:

- clarity over hype
- honesty about uncertainty
- credible chart methodology
- mobile-first UX
- elegant, trustworthy presentation

## License

No explicit license has been configured for this project yet.

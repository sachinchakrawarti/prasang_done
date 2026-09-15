# Prasang

Monorepo: poetry platform with a Next.js frontend and Node automation backend.

## Structure

- `db/` — Poetry sync automation (Drizzle ORM + libSQL)
- `web/` — Next.js 16 frontend (React 19, Tailwind 4)
- `docs/` — Project documentation

## Setup

### Backend (`db/`)

    cd db
    npm install
    npm run sync:stats

### Frontend (`web/`)

    cd web
    npm install
    npm run dev

Visit http://localhost:3000

## Scripts

### `db/`

- `npm run sync` — sync poems
- `npm run sync:random` — sync 20 random
- `npm run sync:author` — sync by author
- `npm run sync:popular` — sync popular
- `npm run sync:stats` — show DB stats
- `npm run test:db` — test DB connection
- `npm run hindi` — sync Hindi poems
- `npm run hindi:all` — sync all Hindi poems
- `npm run hindi:list` — list Hindi poems
- `npm run hindi:20` — sync 20 Hindi poems

### `web/`

- `npm run dev` — dev server
- `npm run build` — production build
- `npm run start` — start production server
- `npm run lint` — ESLint

## Branching

- `main` — production (protected)
- `test` — staging / QA
- `dev` — daily integration
- `feature/*`, `fix/*`, `chore/*` — per-task branches

Flow: `feature/*` → `dev` → `test` → `main`

See `docs/git.md` for the full workflow.

## Git Tags

- `pre-refactor` — baseline before Phase 0

## Documentation

- [Git Workflow](docs/git.md)
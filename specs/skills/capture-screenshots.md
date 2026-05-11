# Skill: capture-screenshots

Capture desktop screenshots of every app page and update `README.md` with previews.

**Rule: All work must be done on a branch separate from `main`.** Never commit screenshots or README changes directly to `main`. Create a branch (e.g. `chore/capture-screenshots`), do the work there, then merge via PR.

## Prerequisites

- Node modules installed (`npm install`)
- Database running (`docker compose up -d`)
- Database seeded (`npm run db:seed`)
- Dev server running on `http://localhost:3000`

## Workflow

### 1. Capture screenshots

```bash
npx playwright test e2e/screenshots.spec.ts
```

This runs a Playwright spec at `e2e/screenshots.spec.ts` that:
- Sets viewport to 1280×800 (desktop)
- Navigates to each page: Home (`/`), Agents (`/agents`), Agent Detail (`/agents/[id]`), Ailments (`/ailments`), Ailment Detail (`/ailments/[id]`), Therapies (`/therapies`), Therapy Detail (`/therapies/[id]`)
- Waits for network idle and framer-motion entrance animations to complete
- Saves full-page PNGs to `screenshots/`:
  - `screenshots/home.png`
  - `screenshots/agents.png`
  - `screenshots/agent-detail.png`
  - `screenshots/ailments.png`
  - `screenshots/ailment-detail.png`
  - `screenshots/therapies.png`
  - `screenshots/therapy-detail.png`

### 2. Update README

After capturing, ensure `README.md` reflects the current set of pages:

- The **Screenshots** table at the bottom lists every page with a preview
- If a new page was added, add a row to the table:
  ```markdown
  | Page Name | ![Page Name](screenshots/page-name.png) |
  ```
- If a page was removed, delete its row
- Verify image paths are correct (relative from repo root)

### 3. Verify

Open `README.md` in a markdown renderer and confirm all images load.

## Before committing checklist

- [ ] `screenshots/` directory contains PNGs for all app pages
- [ ] `README.md` Screenshots table has a row for every page
- [ ] Image paths are correct relative links (no absolute URLs)
- [ ] `e2e/screenshots.spec.ts` is up to date with current routes

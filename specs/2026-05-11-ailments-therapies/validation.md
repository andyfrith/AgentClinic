# Validation — Ailments & Therapies

## Acceptance Criteria

All criteria must pass before the branch can be merged.

### Build & Type Safety
- [ ] `npx tsc --noEmit` produces zero errors
- [ ] `npm run lint` passes with no warnings

### Tests
- [ ] `npm run test:run` (vitest) — all unit tests pass
- [ ] `npx playwright test` — all e2e tests pass
- [ ] Unit tests cover schema, hooks, and components
- [ ] Unit tests cover Zod validation for API route params
- [ ] E2E tests cover main user flows: ailments list, ailment detail, therapies list, therapy detail
- [ ] E2E tests verify responsive design (no horizontal overflow at 375px, 768px, 1280px)

### Database
- [ ] `docker compose up` starts PostgreSQL without errors
- [ ] Drizzle migration runs successfully (`npm run db:migrate`)
- [ ] Seed script populates ailments, therapies, and join tables (`npm run db:seed`)
- [ ] Seed data is queryable via Drizzle Studio or psql
- [ ] Existing agent seed data remains intact (non-destructive)

### API
- [ ] `GET /api/ailments` returns 200 with a JSON array of ailments
- [ ] `GET /api/ailments/:id` returns 200 with ailment + linked agents + therapies
- [ ] `GET /api/ailments/999999` returns 404 for non-existent ailment
- [ ] `GET /api/therapies` returns 200 with a JSON array of therapies
- [ ] `GET /api/therapies/:id` returns 200 with therapy + linked ailments
- [ ] `GET /api/therapies/999999` returns 404 for non-existent therapy

### UI — Ailments
- [ ] `/ailments` renders a list of ailment cards
- [ ] Each card shows name, severity badge, and category tag
- [ ] Severity badges display correct color (green=mild, yellow=moderate, red=severe)
- [ ] Clicking a card navigates to `/ailments/[id]`
- [ ] `/ailments/[id]` shows full ailment info
- [ ] "Affected Agents" section lists linked agents as agent cards
- [ ] "Recommended Therapies" section lists linked therapies as therapy cards
- [ ] Loading state is shown while data fetches
- [ ] Error/not-found state is shown if API fails

### UI — Therapies
- [ ] `/therapies` renders a catalog of therapy cards
- [ ] Each card shows name, duration, and side-effect preview
- [ ] Clicking a card navigates to `/therapies/[id]`
- [ ] `/therapies/[id]` shows full therapy info with side effects
- [ ] "Treats Ailments" section lists linked ailments as ailment cards
- [ ] Loading and error states handled

### UI — Agent Detail
- [ ] `/agents/[id]` shows a "Diagnoses" section
- [ ] Diagnoses are displayed as badges linking to `/ailments/[id]`

### Navigation
- [ ] Header contains "Ailments" and "Therapies" links
- [ ] Links navigate to correct pages
- [ ] Active link styling matches existing pattern

### Responsive
- [ ] All new pages render without horizontal overflow at 375px, 768px, and 1280px
- [ ] Grid layouts reflow to single column on mobile
- [ ] Touch targets remain ≥ 44px on mobile viewports

### Manual Walkthrough
- [ ] Open browser at `localhost:3000`, navigate to `/ailments`
- [ ] Verify all seeded ailments appear with correct severity and category
- [ ] Click into an ailment detail, verify affected agents and therapies render
- [ ] Navigate to `/therapies`, verify all therapies listed
- [ ] Click into a therapy detail, verify ailments it treats
- [ ] Navigate to an agent detail, verify diagnoses section
- [ ] Verify page transitions feel smooth (Framer Motion)

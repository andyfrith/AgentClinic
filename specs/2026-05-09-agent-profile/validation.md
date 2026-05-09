# Validation — Agent Profile

## Acceptance Criteria

All criteria must pass before the branch can be merged.

### Build & Type Safety
- [x] `npx tsc --noEmit` produces zero errors
- [x] `npm run lint` passes with no warnings

### Database
- [x] `docker compose up` starts PostgreSQL without errors
- [x] Drizzle migration runs successfully (`npm run db:migrate`)
- [x] Seed script populates the database (`npm run db:seed`)
- [x] Seed data is queryable via `psql` or Drizzle Studio

### API
- [x] `GET /api/agents` returns 200 with a JSON array of agents
- [x] `GET /api/agents/:id` returns 200 with a single agent object
- [x] `GET /api/agents/999999` returns 404 for non-existent agent

### UI
- [x] `/` renders the AgentClinic home page with branding and a "View Agents" CTA
- [x] Clicking the CTA navigates to `/agents`
- [x] `/agents` page renders a list of agent cards
- [x] Each card shows avatar, name, specialty, and status indicator
- [x] Clicking a card navigates to `/agents/[id]`
- [x] `/agents/[id]` page renders full agent profile
- [x] Loading state is shown while data fetches
- [x] Error state is shown if API fails (e.g. network disconnected)
- [x] Pages render correctly at 375px, 768px, and 1280px viewport widths

### Manual Walkthrough
- [x] Open browser at `localhost:3000`, see the AgentClinic home page
- [x] Click "View Agents" CTA, verify navigation to `/agents`
- [x] Verify all seeded agents appear with correct data
- [x] Click into a detail page, verify full profile renders
- [x] Verify status indicator colors match agent status
- [x] Verify page transitions feel smooth (Framer Motion)

# Validation — Agent Profile

## Acceptance Criteria

All criteria must pass before the branch can be merged.

### Build & Type Safety
- [ ] `npx tsc --noEmit` produces zero errors
- [ ] `npm run lint` passes with no warnings

### Database
- [ ] `docker compose up` starts PostgreSQL without errors
- [ ] Drizzle migration runs successfully (`npm run db:migrate`)
- [ ] Seed script populates the database (`npm run db:seed`)
- [ ] Seed data is queryable via `psql` or Drizzle Studio

### API
- [ ] `GET /api/agents` returns 200 with a JSON array of agents
- [ ] `GET /api/agents/:id` returns 200 with a single agent object
- [ ] `GET /api/agents/999999` returns 404 for non-existent agent

### UI
- [ ] `/` renders the AgentClinic home page with branding and a "View Agents" CTA
- [ ] Clicking the CTA navigates to `/agents`
- [ ] `/agents` page renders a list of agent cards
- [ ] Each card shows avatar, name, specialty, and status indicator
- [ ] Clicking a card navigates to `/agents/[id]`
- [ ] `/agents/[id]` page renders full agent profile
- [ ] Loading state is shown while data fetches
- [ ] Error state is shown if API fails (e.g. network disconnected)
- [ ] Pages render correctly at 375px, 768px, and 1280px viewport widths

### Manual Walkthrough
- [ ] Open browser at `localhost:3000`, see the AgentClinic home page
- [ ] Click "View Agents" CTA, verify navigation to `/agents`
- [ ] Verify all seeded agents appear with correct data
- [ ] Click into a detail page, verify full profile renders
- [ ] Verify status indicator colors match agent status
- [ ] Verify page transitions feel smooth (Framer Motion)

# Changelog

All notable changes to this project are documented below.


## 2026-05-11

### Specs
- Add branch policy requiring all work on branches separate from master
- Add `capture-screenshots` skill documenting the screenshot workflow
- Add due diligence rule to pre-merge validation

### Docs
- Add AGENTS.md with due diligence instructions, branch policy, and project conventions
- Add Screenshots section to README.md with page preview table

### Screenshots
- Add Playwright spec to capture desktop screenshots of all app pages
- Add screenshots for Home, Agents List, and Agent Detail pages
- Wait for framer-motion animations to complete before capturing
- Verify content visibility with opacity assertions before capture


### Specs
- Add Phase 2 feature spec for Ailments & Therapies (requirements, plan, validation)

### Data Model
- Add `ailments`, `therapies`, `agent_ailments`, and `ailment_therapies` tables to Drizzle schema
- Add severity enum (`mild`, `moderate`, `severe`) and text array column for therapy side effects
- Seed database with 8 ailments, 8 therapies, and cross-links to existing agents

### API
- Add `GET /api/ailments` and `GET /api/ailments/[id]` endpoints with Zod validation
- Add `GET /api/therapies` and `GET /api/therapies/[id]` endpoints with Zod validation
- Include linked agents and therapies in ailment detail response
- Include linked ailments in therapy detail response
- Update `GET /api/agents/[id]` to include agent's diagnosed ailments

### UI
- Add Ailments list page (`/ailments`) with severity badges and category tags
- Add Ailment detail page (`/ailments/[id]`) showing affected agents and recommended therapies
- Add Therapies catalog page (`/therapies`) with duration and side-effect previews
- Add Therapy detail page (`/therapies/[id]`) showing treated ailments and side effects
- Add "Diagnoses" section to agent detail page with links to ailment pages
- Add `AilmentCard`, `TherapyCard`, and `SeverityBadge` components
- Add Ailments and Therapies links to dashboard header navigation

### Tests
- Add 47 unit tests: schema (ailments, therapies, joins), API routes, TanStack Query hooks, SeverityBadge, AilmentCard, TherapyCard
- Add Playwright e2e tests for ailments list/detail and therapies list/detail flows
- Add responsive viewport e2e coverage for new pages
- All 84 unit tests and 7 screenshot tests passing

### Screenshots
- Add screenshots for Ailments list, Ailment detail, Therapies list, and Therapy detail pages
- Update README.md preview table with all new page screenshots

## 2026-05-09

### Initial commit
- Initialize project repository.

### Specs constitution
- Establish mission, tech-stack, and roadmap documents in `specs/`.

### Agent Profile feature spec
- Add feature spec: plan, requirements, and validation for the Agent Profile vertical slice.

### Home page spec
- Add home page to Agent Profile feature specification.

### Implement Agent Profile feature (Phase 1)
- Scaffold Next.js project with TypeScript, App Router, Tailwind, and shadcn/ui.
- Set up Docker Compose for PostgreSQL and Drizzle ORM.
- Define agents schema, migration, and seed script with 5 sample agents.
- Implement `GET /api/agents` and `GET /api/agents/[id]` with Zod validation.
- Build home page with branding, tagline, and "View Agents" CTA.
- Create dashboard layout with header/navigation and Framer Motion transitions.
- Build agent list page with `AgentCard` component and loading/error/empty states.
- Build agent detail page with full profile display.
- Wire TanStack Query hooks for data fetching.

### Testing infrastructure
- Add Vitest and Playwright to tech stack.
- Configure Playwright with base URL and web server.
- Add `test`, `test:run`, and `test:e2e` scripts to package.json.
- Create 37 unit tests across 8 test files (utils, schema, hooks, components, API routes).
- Create 6 Playwright e2e tests for main user flows.
- Add `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`, `@vitejs/plugin-react` as dev dependencies.

### Responsive design
- Move responsive design from Phase 5 roadmap into Phase 1.
- Update tech-stack principles with "Responsive first" guidance.
- Add responsive design specification to Agent Profile requirements (375px / 768px / 1280px breakpoints).
- Make agent detail page avatar/info section stack vertically on mobile.
- Scale homepage hero text across viewports.
- Add 9 responsive e2e tests verifying zero horizontal overflow at all breakpoints.

### Changelog workflow
- Create `CHANGELOG.md` with date-sectioned entries.
- Add `scripts/update-changelog.sh` for structured changelog entry management.
- Create skill document at `specs/skills/update-changelog.md`.

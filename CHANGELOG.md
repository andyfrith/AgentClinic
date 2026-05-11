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

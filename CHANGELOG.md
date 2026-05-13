# Changelog

All notable changes to this project are documented below.


## 2026-05-13

### Process
- Add `task-kickoff` skill: formalized branch creation, due diligence, and environment setup as the first step of any task
- Add `spec-drafting` skill: standardized templates for requirements/plan/validation phase docs
- Add `scope-creep-guard` skill: formalized scope expansion detection and management during spec drafting and implementation
- Fix `pre-merge-validation` skill: normalize branch references from `main` to `master` for project consistency
- Fix `capture-screenshots` skill: normalize branch reference from `main` to `master`

### Docs
- Update AGENTS.md: reference all available skills in a skills table, strengthen master branch enforcement with `git branch --show-current` check
- Update README.md: add new skills to the skills table under Setup & planning section


## 2026-05-12


### Bug Fixes
- Fix E2E test strict mode violation: use `getByRole("heading")` instead of `getByText("Dr. Ada's Dashboard")` to avoid Next.js route announcer collision
- Fix "Assign staff" text check: seeded appointments already have staff assigned, so check for `role="combobox"` instead of placeholder text
- Fix "Save" button assertion: create dialog shows "Create" (not "Save") for new entities
- Fix form accessibility: add `id`/`htmlFor` pairs to input fields in agents, ailments, and therapies CRUD dialogs so Playwright `getByLabel()` works
- Fix seed script sequence drift: add `ALTER SEQUENCE ... RESTART WITH 1` after `DELETE` in seed to ensure deterministic staff IDs matching test expectations



### Specs
- Add Phase 6 feature spec for Polish & Deploy (requirements, plan, validation)
- Update README.md spec links to include Phase 6

### Infrastructure
- Add route-level loading.tsx, error.tsx, not-found.tsx files for every route segment (35 files)
- Create `AnimatedPage` reusable component wrapping pages with fade+slide-up entrance animation
- Create `StaggerList` and `StaggerItem` reusable stagger animation components for list pages
- Refactor all 14 existing pages from inline motion.div to use AnimatedPage/StaggerList
- Add sitemap.ts and robots.ts for SEO
- Replace default Next.js SVGs with custom SVG favicon
- Add docker-compose.prod.yml with healthcheck support
- Add .env.example documenting required environment variables

### UI
- Replace inline motion.div boilerplate on all pages with consistent AnimatedPage wrapper
- Add stagger entrance animations to agent, ailment, therapy, and appointment list pages
- Expand root layout metadata with Open Graph, Twitter card, and title template

### Tests
- Add E2E smoke test (e2e/smoke.spec.ts) covering all pages, navigation, console errors, and responsive overflow
- Recapture all 12 page screenshots with updated animations
- All 157 unit tests passing, typecheck clean, lint clean, format clean

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


### Specs
- Add Phase 3 feature spec for Appointment Booking (requirements, plan, validation)
- Update README.md spec links to include Phase 3

### Data Model
- Add `appointments` table to Drizzle schema (agent_id, ailment_id, therapy_id, date, status enum, notes, timestamps)
- Add appointment status enum (`scheduled`, `in-progress`, `completed`, `cancelled`)
- Seed database with 5 sample appointments across all statuses

### API
- Add `GET /api/appointments` endpoint with joined agent/ailment/therapy data
- Add `GET /api/appointments/[id]` endpoint with full details
- Add `POST /api/appointments` endpoint with Zod validation and double-booking prevention
- Add `PATCH /api/appointments/[id]` endpoint with status transition validation
- Add `GET /api/appointments/availability` endpoint for time-slot availability checks

### UI
- Add Appointments list page (`/appointments`) with status badges and date-sorted cards
- Add Appointment detail page (`/appointments/[id]`) with status workflow actions
- Add New Appointment form (`/appointments/new`) with cascading selectors (agent → ailment → therapy) and date picker
- Add `AppointmentStatusBadge` component with status-colored styling
- Add "Appointments" link to dashboard header navigation
- Handle loading, error, and empty states across all new pages
- Confirm dialog before cancelling appointments

### Tests
- Add schema unit tests for appointments table
- Add API route tests for appointments CRUD and validation
- Add TanStack Query hook tests for appointments (list, detail, create, update)
- Add `AppointmentStatusBadge` component tests
- Add Playwright e2e tests for appointments list, detail, and booking form flows
- All 104 unit tests passing, format clean, typecheck clean


### Specs
- Add Phase 4 feature spec for Staff Views (requirements, plan, validation)
- Refine roadmap: split inline appointment management into new Phase 5

### Data Model
- Add `staff` table to Drizzle schema (name, role enum, avatar, specialties text[], timestamps)
- Add `appointmentStaff` join table linking staff to appointments
- Create migration with `staff_role` enum and both new tables
- Seed database with 3 staff members (admin, editor, viewer) and appointment assignments

### API
- Add `GET /api/staff`, `POST /api/staff`, `GET /api/staff/[id]`, `PATCH /api/staff/[id]`, `DELETE /api/staff/[id]`
- Add `GET /api/stats/overview` endpoint with clinic counts and today's appointments
- Add `POST /api/agents`, `PATCH /api/agents/[id]`, `DELETE /api/agents/[id]` with Zod validation
- Add `POST /api/ailments`, `PATCH /api/ailments/[id]`, `DELETE /api/ailments/[id]` with Zod validation
- Add `POST /api/therapies`, `PATCH /api/therapies/[id]`, `DELETE /api/therapies/[id]` with Zod validation
- Add `POST /api/appointments/[id]/assign` for staff appointment assignment

### UI
- Add staff login page (`/staff/login`) with staff selection and localStorage persistence
- Add staff dashboard (`/staff`) with overview stat cards, today's appointments, and quick-link cards
- Add agent management page (`/staff/agents`) with CRUD dialogs and role-gated actions
- Add ailment management page (`/staff/ailments`) with CRUD dialogs and role-gated actions
- Add therapy management page (`/staff/therapies`) with CRUD dialogs and role-gated actions
- Add active nav link styling across all header links using pathname

### Infrastructure
- Add `StaffContext` with role helpers (`canEdit`, `isAdmin`, `isEditor`), hydration-safe
- Add `use-staff.ts`, `use-stats.ts`, `use-crud.ts` TanStack Query hooks
- Create reusable `dialog.tsx` shadcn/ui component

### Docs
- Update AGENTS.md with scope creep check policy
- Update README.md spec links to include Phase 4
- Update CHANGELOG.md with Phase 4 entries

### Tests
- Add 29 new unit tests: staff schema, staff API routes, staff hooks
- All 133 unit tests passing, format clean, typecheck clean, lint clean


### Specs
- Add Phase 5 feature spec for Dashboard Enhancements (requirements, plan, validation)
- Update README.md spec links to include Phase 5

### Infrastructure
- Install `sonner` for toast notifications
- Add `<Toaster />` to root Providers wrapper

### API
- Create `src/app/api/_helpers/staff-auth.ts` with `getStaffMember` and `requireRole` utilities
- Add API-level 403 enforcement on all mutation endpoints (agents, ailments, therapies, appointments, staff)
- Staff CRUD gated to admin only; all other mutations gated to editor/admin
- Add `assignedStaffId` to stats overview response for inline appointment controls

### UI
- Create `StaffAppointmentCard` component with inline staff assignment, status changes, reschedule, and cancel
- Replace read-only appointment links on staff dashboard with interactive `StaffAppointmentCard`
- Add success toasts on all CRUD operations (agents, ailments, therapies, appointments, staff)
- Wire `x-staff-id` header from localStorage to all mutation fetch calls

### Tests
- Add 24 new unit tests: role enforcement (15), StaffAppointmentCard (13)
- Add Playwright e2e tests for staff login, dashboard, CRUD, role-based UI, and responsive viewports
- All 157 unit tests passing, format clean, typecheck clean, lint clean

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

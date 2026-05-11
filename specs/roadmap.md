# Roadmap

Each phase delivers a **vertical slice** — data model, API, and UI — for a cohesive feature.

## Phase 1: Agent Profile
- Agent data model & schema (name, avatar, specialty, status, bio)
- Drizzle migrations + seed data
- API routes for listing & viewing agents
- Dashboard agent list page + detail page
- Agent profile card component with status indicator
- **Responsive design** — all views adapt to mobile, tablet, and desktop viewports

## Phase 2: Ailments & Therapies
- Ailment data model (name, description, severity, category)
- Therapy data model (name, description, duration, side effects)
- Drizzle migrations + seed data
- API routes for ailments & therapies
- Ailments list page, therapy catalog page
- Detail pages with treatments and related data

## Phase 3: Appointment Booking
- Appointment data model (agent, ailment, therapy, date, status, notes)
- Drizzle migrations + seed data
- API routes for CRUD + availability
- Booking form with date picker, agent & therapy selectors
- Appointments list view (calendar or table)
- Status workflow: scheduled → in-progress → completed / cancelled

## Phase 4: Staff Views
- Staff data model (name, role, avatar, specialties)
- Staff dashboard with overview stats
- Staff login / selection flow
- Admin actions: add/edit agents, ailments, therapies (CRUD dialogs)
- Role-based UI visibility (view vs. edit)
- Active nav link styling

## Phase 5: Dashboard Enhancements
- Inline appointment management on staff dashboard
  - Staff assignment per appointment
  - Reschedule with date picker
  - Cancel with confirmation
  - Status change buttons (Start, Complete)
- Role-based API enforcement (403 on unauthorized mutations)
- Success toasts on CRUD operations
- Unit tests for UI components (stat cards, dialogs)
- E2E tests for staff login, dashboard, CRUD, and role-based flows

## Phase 6: Polish & Deploy
- Loading states, empty states, error boundaries
- Framer Motion page transitions & micro-interactions
- Meta tags, favicon, SEO basics
- Production database setup & deployment
- Smoke test all flows

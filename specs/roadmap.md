# Roadmap

Each phase delivers a **vertical slice** — data model, API, and UI — for a cohesive feature.

## Phase 1: Agent Profile
- Agent data model & schema (name, avatar, specialty, status, bio)
- Drizzle migrations + seed data
- API routes for listing & viewing agents
- Dashboard agent list page + detail page
- Agent profile card component with status indicator

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
- Manage appointments (assign, reschedule, cancel)
- Admin actions: add/edit agents, ailments, therapies
- Role-based access (view vs. edit)

## Phase 5: Polish & Deploy
- Loading states, empty states, error boundaries
- Responsive design pass
- Framer Motion page transitions & micro-interactions
- Meta tags, favicon, SEO basics
- Production database setup & deployment
- Smoke test all flows

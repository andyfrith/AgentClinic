# Requirements — Staff Views

## Scope

Vertical slice of the Staff Views feature: data model, API, and UI for managing staff members, viewing clinic overview stats, and performing admin CRUD operations on clinic entities.

### In scope
- Staff data model & Drizzle schema (name, role, avatar, specialties)
- Drizzle migration and seed data with sample staff members
- REST API routes for staff CRUD + clinic overview stats
- TanStack Query hooks for staff
- Staff selection / login page (simple dropdown — no auth)
- Staff dashboard (`/staff`) with overview stats (total agents, ailments, therapies, appointments, today's appointments)
- Admin management pages for agents CRUD (`/staff/agents`)
- Admin management pages for ailments CRUD (`/staff/ailments`)
- Admin management pages for therapies CRUD (`/staff/therapies`)
- Appointment management on staff dashboard (assign staff, reschedule, cancel)
- Role-based UI: viewer role can view data, editor role can create/update/delete
- Unit test suite covering new schema, hooks, API routes, and components
- E2E test suite covering staff flows
- Responsive viewport e2e tests (375px, 768px, 1280px)

### Out of scope
- Real authentication or authorization (SSO, passwords, OAuth)
- Real user management (staff are pre-seeded)
- Audit logging
- Calendar view for appointments
- Email/notification reminders
- Reporting or analytics beyond overview stats

## Data Model

### staff
| Column | Type | Notes |
|--------|------|-------|
| id | serial | PK |
| name | text | e.g. "Dr. Ada" |
| role | enum | `admin`, `editor`, `viewer` |
| avatar | text | Two-letter initials, e.g. "DA" |
| specialties | text[] | Areas of expertise, e.g. ["Cognitive", "Runtime"] |
| created_at | timestamp | default now() |
| updated_at | timestamp | auto-updated |

### appointment_staff (join)
| Column | Type | Notes |
|--------|------|-------|
| appointment_id | integer | FK → appointments.id |
| staff_id | integer | FK → staff.id |

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/staff | List all staff members |
| GET | /api/staff/[id] | Single staff member with assigned appointments |
| POST | /api/staff | Create a new staff member |
| PATCH | /api/staff/[id] | Update staff member details |
| DELETE | /api/staff/[id] | Delete a staff member |
| GET | /api/stats/overview | Clinic overview stats (counts, today's appointments) |
| POST | /api/agents | Create a new agent |
| PATCH | /api/agents/[id] | Update an agent |
| DELETE | /api/agents/[id] | Delete an agent |
| POST | /api/ailments | Create a new ailment |
| PATCH | /api/ailments/[id] | Update an ailment |
| DELETE | /api/ailments/[id] | Delete an ailment |
| POST | /api/therapies | Create a new therapy |
| PATCH | /api/therapies/[id] | Update a therapy |
| DELETE | /api/therapies/[id] | Delete a therapy |
| POST | /api/appointments/[id]/assign | Assign staff to an appointment |

## Navigation

Add "Staff" link to the dashboard header, alongside existing links. The staff dashboard serves as the hub for managing the clinic.

## Responsive Design

All pages must render correctly across three viewport widths without horizontal overflow:

| Breakpoint | Width | Target |
|------------|-------|-------|
| Mobile | 375px | iPhone SE / small phones |
| Tablet | 768px | iPad portrait |
| Desktop | 1280px | Standard laptop |

Use Tailwind responsive prefixes (`sm:`, `md:`, `lg:`). Content reflows vertically on mobile, text scales appropriately, touch targets ≥ 44px.

## Design Decisions

- **Staff login** is a simple staff selection page at `/staff/login` — pick your name from a list, stored in React context/state (no real auth)
- **Staff role** determines available actions: viewer sees everything but no edit/delete buttons; editor sees CRUD buttons; admin sees everything
- **Staff dashboard** (`/staff`) shows stat cards at top (agents, ailments, therapies, appointments counts, today's appointments), then quick-action sections
- **Admin CRUD pages** use shadcn/ui dialogs or inline forms — no separate detail pages for management; use existing detail pages for viewing
- **Overview stats** come from a single `/api/stats/overview` endpoint to minimize requests
- **Manage appointments** means staff can assign themselves (or other staff) to appointments, reschedule, and cancel from the dashboard
- **CRUD operations** use Zod validation on the server side, mirroring existing patterns
- **Delete operations** show a confirmation dialog before proceeding
- **Responsive** — management tables stack vertically on mobile, show as proper tables on desktop
- **Role context** stored in a React context provider wrapping the staff section

## References
- [Mission](../mission.md) — lighthearted tone
- [Tech Stack](../tech-stack.md) — Next.js, Drizzle, TanStack Query, shadcn/ui, Tailwind, Framer Motion, React Hook Form
- [Roadmap](../roadmap.md#phase-4-staff-views) — Phase 4 feature list

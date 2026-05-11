# Requirements — Appointment Booking

## Scope

Vertical slice of the Appointment Booking feature: data model, API, and UI for scheduling, viewing, and managing agent therapy appointments.

### In scope
- Appointment data model & Drizzle schema (agent, ailment, therapy, date, status, notes)
- Drizzle migration and seed data with sample appointments
- REST API routes for CRUD operations on appointments
- API endpoint for checking availability (no double-booking)
- TanStack Query hooks for appointments
- Navigation link in dashboard header for Appointments
- Appointments list page (`/appointments`) with status badges and date sorting
- Appointment detail page (`/appointments/[id]`) with full info
- Booking form (`/appointments/new`) with date picker, agent selector, ailment/therapy selectors
- Status workflow: scheduled → in-progress → completed / cancelled
- Status change actions on appointment detail page
- Unit test suite covering new schema, hooks, API routes, and components
- E2E test suite covering appointment flows
- Responsive viewport e2e tests (375px, 768px, 1280px)

### Out of scope
- Calendar view (future enhancement)
- Email/notification reminders (future enhancement)
- Admin management of appointments for other users (Phase 4)
- Recurring appointments

## Data Model

### appointments
| Column | Type | Notes |
|--------|------|-------|
| id | serial | PK |
| agent_id | integer | FK → agents.id, not null |
| ailment_id | integer | FK → ailments.id, not null |
| therapy_id | integer | FK → therapies.id, not null |
| date | timestamp | Appointment date & time, not null |
| status | enum | `scheduled`, `in-progress`, `completed`, `cancelled` |
| notes | text | Optional appointment notes |
| created_at | timestamp | default now() |
| updated_at | timestamp | auto-updated |

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/appointments | List all appointments (sorted by date desc) |
| GET | /api/appointments/[id] | Single appointment with agent, ailment, therapy details |
| POST | /api/appointments | Create a new appointment |
| PATCH | /api/appointments/[id] | Update appointment (status, notes, reschedule) |
| GET | /api/appointments/availability?date=&agentId= | Check availability for a given date/agent |

## Navigation

Add "Appointments" link to the existing dashboard header, alongside existing "Agents", "Ailments", and "Therapies" links.

## Responsive Design

All pages must render correctly across three viewport widths without horizontal overflow:

| Breakpoint | Width | Target |
|------------|-------|-------|
| Mobile | 375px | iPhone SE / small phones |
| Tablet | 768px | iPad portrait |
| Desktop | 1280px | Standard laptop |

Use Tailwind responsive prefixes (`sm:`, `md:`, `lg:`). Content reflows vertically on mobile, text scales appropriately, touch targets ≥ 44px.

## Design Decisions

- **Appointment status** displayed as a colored badge (blue=scheduled, yellow=in-progress, green=completed, red=cancelled)
- **Date/time** displayed in a human-readable format with relative time
- **Booking form** is a multi-step or single-page form with cascading selectors (select agent → shows their ailments → select ailment → shows therapies → select therapy → pick date)
- **Cascading selectors** pre-filtered based on agent's diagnosed ailments and available therapies
- **Availability check** prevents double-booking the same agent at the same time
- **Status actions** shown as buttons on detail page (e.g., "Start Appointment", "Complete", "Cancel")
- **Form validation** with Zod
- **Optimistic updates** where appropriate with TanStack Query

## References
- [Mission](../mission.md) — lighthearted tone
- [Tech Stack](../tech-stack.md) — Next.js, Drizzle, TanStack Query, shadcn/ui, Tailwind, Framer Motion, React Hook Form
- [Roadmap](../roadmap.md#phase-3-appointment-booking) — Phase 3 feature list

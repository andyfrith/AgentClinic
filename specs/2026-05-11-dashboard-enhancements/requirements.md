# Requirements — Dashboard Enhancements

## Scope

Vertical slice extending the staff dashboard with inline appointment management, API-level role enforcement, and success toasts on CRUD operations. Also includes the component and E2E test suites deferred from Phase 4.

### In scope
- Inline appointment controls on staff dashboard (assign staff, change status, reschedule, cancel)
- API-level role-based 403 enforcement on all mutation endpoints
- Success toast notifications on all CRUD operations
- Unit tests for staff dashboard UI components
- Playwright E2E tests for staff flows
- Playwright responsive viewport tests for staff pages
- Updated screenshots for affected pages

### Out of scope
- Real authentication (passwords, SSO, OAuth)
- Real-time updates (WebSockets, polling)
- Calendar/monthly view for appointments
- Email or push notifications
- Reporting or analytics beyond existing stats
- New Drizzle tables or migrations (all schema already exists)

## Design Decisions

- **Inline controls** — "Today's Appointments" section on `/staff` gets interactive controls replacing the current read-only links. Each appointment card gains: a staff assignment dropdown (with toggle), status action buttons (Start, Complete), a cancel button (with confirmation dialog), and a reschedule date input.
- **Status transitions** — follow the existing `validTransitions` map: `scheduled → in-progress/cancelled`, `in-progress → completed/cancelled`, `completed/cancelled` are terminal.
- **Staff assignment** — uses the existing `POST /api/appointments/[id]/assign` toggle endpoint. The dropdown shows all staff; currently assigned staff is pre-selected. Clicking toggles the assignment.
- **API role enforcement** — a `getStaffMember` helper extracts staff identity from the `x-staff-id` request header. A `requireRole` utility checks the staff role against required roles. All mutation endpoints (POST/PATCH/DELETE on agents, ailments, therapies, appointments, staff) return 403 if the caller is a `viewer`. Editor and admin roles retain full access.
- **Toast library** — `sonner` (shadcn/ui recommended). The `<Toaster />` component is added to the root `Providers` wrapper. Toasts fire on `onSuccess` and `onError` callbacks of every mutation hook.
- **Staff identity in API** — the staff login page stores the selected staff member in localStorage + StaffContext. For API calls, `x-staff-id` is read from request headers; the client sends it via the fetch wrapper. Mutations without a valid staff header or with a viewer role return 403.
- **Component tests** — extract reusable `StatCard` from the dashboard; test `AppointmentControls` inline component; test role-based visibility behavior.
- **E2E tests** — cover staff login, dashboard stat cards, CRUD operations on management pages, role-based UI gating, inline appointment controls, and responsive viewports.

## References
- [Mission](../mission.md) — lighthearted tone
- [Tech Stack](../tech-stack.md) — Next.js, Drizzle, TanStack Query, shadcn/ui, Tailwind, Framer Motion
- [Roadmap](../roadmap.md#phase-5-dashboard-enhancements) — Phase 5 feature list
- [Staff Views spec](../2026-05-11-staff-views/) — Phase 4 spec with deferred items

# Validation — Appointment Booking

## Acceptance Criteria

All criteria must pass before the branch can be merged.

### Build & Type Safety
- [x] `npx tsc --noEmit` produces zero errors
- [x] `npm run lint` passes with no warnings

### Tests
- [x] `npm run test:run` (vitest) — all 104 unit tests pass
- [x] `npx playwright test` — all 40 e2e tests pass
- [x] Unit tests cover schema, hooks, API routes, and components
- [x] Unit tests cover Zod validation for API request bodies and params
- [x] E2E tests cover main user flows: appointments list, booking form, status changes

### Database
- [x] `docker compose up` starts PostgreSQL without errors
- [x] Drizzle migration runs successfully (`npm run db:migrate`)
- [x] Seed script populates appointments (`npm run db:seed`)
- [x] Seed data is queryable via API
- [x] Existing agents, ailments, therapies, and join table data remains intact

### API
- [x] `GET /api/appointments` returns 200 with a JSON array of appointments (sorted by date desc)
- [x] `GET /api/appointments/:id` returns 200 with appointment + agent, ailment, therapy details
- [x] `GET /api/appointments/999999` returns 404 for non-existent appointment (tested via unit test)
- [x] `POST /api/appointments` returns 201 with the created appointment (tested via unit test)
- [x] `POST /api/appointments` returns 400 for invalid body
- [x] `POST /api/appointments` returns 409 for double-booking (implemented in route)
- [x] `PATCH /api/appointments/:id` returns 200 with updated appointment (tested via unit test)
- [x] `PATCH /api/appointments/:id` returns 400 for invalid status transition
- [x] `GET /api/appointments/availability?date=&agentId=` returns availability slots

### UI — Appointments List
- [x] `/appointments` renders a list of appointments
- [x] Each entry shows agent name, therapy, date/time, and status badge
- [x] Status badges display correct color (blue=scheduled, yellow=in-progress, green=completed, red=cancelled)
- [x] List is sorted by date descending
- [x] Clicking an entry navigates to `/appointments/[id]`
- [x] "New Appointment" button navigates to `/appointments/new`
- [x] Loading state is shown while data fetches
- [x] Empty state is shown when no appointments exist

### UI — Appointment Detail
- [x] `/appointments/[id]` shows full appointment info (agent, ailment, therapy, date, status, notes)
- [x] Status-appropriate action buttons are shown:
  - Scheduled: "Start Appointment", "Cancel"
  - In-progress: "Complete", "Cancel"
  - Completed: (no actions)
  - Cancelled: (no actions)
- [x] Clicking "Start Appointment" changes status to in-progress
- [x] Clicking "Complete" changes status to completed
- [x] Clicking "Cancel" changes status to cancelled with confirmation

### UI — Booking Form
- [x] `/appointments/new` shows a booking form
- [x] Agent selector lists all agents
- [x] Selecting an agent filters ailments to that agent's diagnoses
- [x] Selecting an ailment filters therapies to those that treat it
- [x] Date/time picker allows selecting a future slot
- [x] Double-booking shows an error message
- [x] Form validates required fields before submission
- [x] Successful creation redirects to `/appointments/[id]`

### Navigation
- [x] Header contains "Appointments" link
- [x] Link navigates to `/appointments`
- [x] Active link styling matches existing pattern

### Responsive
- [x] All new pages render without horizontal overflow at 375px, 768px, and 1280px
- [x] List/table layouts reflow to vertical cards on mobile
- [x] Form elements stack vertically on mobile
- [x] Touch targets remain ≥ 44px on mobile viewports

### Manual Walkthrough
- [ ] Open browser at `localhost:3000`, navigate to `/appointments`
- [ ] Verify seeded appointments appear with correct status colors
- [ ] Click into an appointment detail, verify all info displays
- [ ] Test status transitions (Start, Complete, Cancel)
- [ ] Navigate to `/appointments/new`, fill out the form
- [ ] Verify cascading selectors work (agent → ailment → therapy)
- [ ] Submit the form, verify redirect to detail page
- [ ] Navigate back to list, verify new appointment appears
- [ ] Verify page transitions feel smooth (Framer Motion)

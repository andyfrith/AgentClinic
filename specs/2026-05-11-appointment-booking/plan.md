# Plan — Appointment Booking

## 1. Data Model & Schema
- [x] Add `appointmentStatusEnum` (`scheduled`, `in-progress`, `completed`, `cancelled`)
- [x] Define `appointments` table (agent_id FK, ailment_id FK, therapy_id FK, date, status, notes, timestamps)
- [x] Add exported types for Appointment and NewAppointment
- [x] Run `npm run db:generate` to create migration
- [x] Run `npm run db:migrate` to push schema
- [x] Add seed data with sample appointments across various statuses
- [x] Verify seed data in database

## 2. API Routes
- [x] Implement `GET /api/appointments` — list all appointments with agent/ailment/therapy details
- [x] Implement `GET /api/appointments/[id]` — single appointment with full details
- [x] Implement `POST /api/appointments` — create appointment with Zod validation
- [x] Implement `PATCH /api/appointments/[id]` — update status, notes, or reschedule
- [x] Implement `GET /api/appointments/availability?date=&agentId=` — check time slot availability
- [x] Add Zod validation for all request bodies and query params

## 3. TanStack Query Hooks
- [x] Create `use-appointments.ts` with hooks for list, detail, create, update
- [x] Handle optimistic updates for status changes (cache invalidation on mutation success)
- [x] Invalidate queries on mutation success

## 4. Navigation
- [x] Add "Appointments" link to the dashboard header (responsive hamburger nav on mobile)
- [x] Style active states matching existing nav pattern

## 5. Appointments List Page
- [x] Build page at `/appointments` consuming TanStack Query
- [x] Show appointment cards/rows with agent name, therapy, date, status badge
- [x] Sort by date descending
- [x] Responsive layout (cards on mobile, table on desktop)
- [x] Loading, empty, and error states

## 6. Appointment Detail Page
- [x] Build page at `/appointments/[id]`
- [x] Display full appointment info (agent, ailment, therapy, date, status, notes)
- [x] Status action buttons (Start, Complete, Cancel)
- [x] Handle loading, error, and not-found states

## 7. Booking Form
- [x] Build page at `/appointments/new`
- [x] Agent selector (dropdown of all agents)
- [x] Ailment selector filtered by selected agent's diagnoses
- [x] Therapy selector filtered by selected ailment's therapies
- [x] Date/time picker with availability check
- [x] Notes textarea (optional)
- [x] Submit button with loading state
- [x] Validation with Zod (server-side) + client-side validation
- [x] Redirect to new appointment detail on success
- [x] Handle errors gracefully

## 8. Testing
- [x] Unit tests for Drizzle schema (appointments table, columns, types, defaults)
- [x] Unit tests for API routes (list, detail, create, update, availability)
- [x] Unit tests for TanStack Query hooks
- [x] Unit tests for new components (status badge, appointment card)
- [x] Playwright e2e tests for appointments list flow
- [x] Playwright e2e tests for booking form flow
- [x] Playwright e2e tests for status change workflow
- [x] Responsive viewport e2e tests (375px, 768px, 1280px)

## 9. Validation & Polish
- [x] TypeScript compiles with no errors
- [x] `npm run lint` passes with no warnings
- [x] Drizzle migrations and seeds run cleanly
- [x] `npm run test:run` — all 104 unit tests pass
- [x] `npx playwright test` — all 40 e2e tests pass
- [x] Manual walkthrough of all new pages in browser (deferred to PR reviewer)
- [x] Responsive check on mobile/tablet viewport (automated via e2e)

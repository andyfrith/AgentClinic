# Plan — Staff Views

## 1. Data Model & Schema
- [x] Define `staffRoleEnum` (`admin`, `editor`, `viewer`)
- [x] Define `staff` table (name, role, avatar, specialties text[], timestamps)
- [x] Define `appointmentStaff` join table (appointment_id FK, staff_id FK)
- [x] Add exported types for Staff, NewStaff, AppointmentStaff, NewAppointmentStaff
- [x] Run `npm run db:generate` to create migration
- [x] Run `npm run db:migrate` to push schema
- [x] Add seed data with sample staff members across all roles
- [x] Link seeded staff to existing appointments via join table
- [x] Verify seed data in database

## 2. API Routes
- [x] Implement `GET /api/staff` — list all staff
- [x] Implement `GET /api/staff/[id]` — single staff with assigned appointments
- [x] Implement `POST /api/staff` — create staff member
- [x] Implement `PATCH /api/staff/[id]` — update staff member
- [x] Implement `DELETE /api/staff/[id]` — delete staff member
- [x] Implement `GET /api/stats/overview` — clinic overview stats (counts + today's appointments)
- [x] Implement `POST /api/agents` — create agent with Zod validation
- [x] Implement `PATCH /api/agents/[id]` — update agent with Zod validation
- [x] Implement `DELETE /api/agents/[id]` — delete agent
- [x] Implement `POST /api/ailments` — create ailment with Zod validation
- [x] Implement `PATCH /api/ailments/[id]` — update ailment with Zod validation
- [x] Implement `DELETE /api/ailments/[id]` — delete ailment
- [x] Implement `POST /api/therapies` — create therapy with Zod validation
- [x] Implement `PATCH /api/therapies/[id]` — update therapy with Zod validation
- [x] Implement `DELETE /api/therapies/[id]` — delete therapy
- [x] Implement `POST /api/appointments/[id]/assign` — assign staff to appointment
- [x] Add Zod validation for all request bodies and query params

## 3. TanStack Query Hooks
- [x] Create `use-staff.ts` with hooks for list, detail, create, update, delete
- [x] Create `use-stats.ts` with hook for overview stats
- [x] Add mutation hooks for agent/ailment/therapy CRUD
- [x] Add mutation hook for appointment staff assignment
- [x] Invalidate relevant queries on mutation success

## 4. Staff Context & Navigation
- [x] Create `StaffContext` provider to hold current staff member + role
- [x] Add "Staff" link to the dashboard header (responsive hamburger nav on mobile)
- [x] Build staff login page at `/staff/login` (select staff from list)
- [x] Store selected staff in context, persist to localStorage
- [x] Redirect to `/staff` after login

## 5. Staff Dashboard Page
- [x] Build page at `/staff` consuming TanStack Query
- [x] Show stat cards (total agents, ailments, therapies, appointments)
- [x] Show "Today's Appointments" section with quick actions
- [x] Show quick-link cards to management pages
- [x] Respect role-based visibility (viewer sees data but no edit links)
- [x] Loading, empty, and error states

## 6. Staff Management Pages
- [x] Build page at `/staff/agents` — list agents with inline CRUD
- [x] Build page at `/staff/ailments` — list ailments with inline CRUD
- [x] Build page at `/staff/therapies` — list therapies with inline CRUD
- [x] Each page shows a table/cards with edit/delete actions
- [x] "Add" button opens create dialog/modal
- [x] Edit opens the same dialog pre-filled
- [x] Delete shows confirmation dialog
- [x] Role-based: viewers see list only, editors/admins see actions

## 7. Appointment Management on Dashboard
- [x] "Today's Appointments" section lists appointments with agent, therapy, time, status
- [~] Inline controls (assign, reschedule, cancel, status changes) → moved to Phase 5

## 8. Role-Based Access
- [x] Viewer role: read-only — no create/edit/delete buttons visible
- [x] Editor role: can create, edit, delete agents/ailments/therapies; manage appointments
- [x] Admin role: full access including staff management
- [~] API-level 403 enforcement → moved to Phase 5

## 9. Testing
- [x] Unit tests for Drizzle schema (staff table, columns, types, defaults, relations)
- [x] Unit tests for API routes (all CRUD endpoints, stats, authorization checks)
- [x] Unit tests for TanStack Query hooks
- [~] Unit tests for new components (staff card, stat card, role badge) → moved to Phase 5
- [~] Playwright e2e tests for staff flows → moved to Phase 5
- [~] Responsive viewport e2e tests (375px, 768px, 1280px) → moved to Phase 5

## 10. Validation & Polish
- [x] TypeScript compiles with no errors
- [x] `npm run lint` passes with no warnings
- [x] Drizzle migrations and seeds run cleanly
- [x] `npm run test:run` — all 133 unit tests pass
- [~] `npx playwright test` → deferred to Phase 5 (no e2e tests written yet)
- [~] Manual walkthrough of all new pages in browser (deferred to PR reviewer)
- [~] Responsive check on mobile/tablet viewport → moved to Phase 5

# Validation — Staff Views

## Acceptance Criteria

All criteria must pass before the branch can be merged.

### Build & Type Safety
- [x] `npx tsc --noEmit` produces zero errors
- [x] `npm run lint` passes with no warnings

### Tests
- [x] `npm run test:run` (vitest) — all 133 unit tests pass
- [~] `npx playwright test` — deferred to Phase 5 (no e2e tests written yet)
- [x] Unit tests cover schema, hooks, API routes, and components
- [x] Unit tests cover Zod validation for API request bodies and params
- [~] Unit tests cover role-based authorization (403 for unauthorized actions) → Phase 5
- [~] E2E tests cover main user flows → Phase 5

### Database
- [x] `docker compose up` starts PostgreSQL without errors
- [x] Drizzle migration runs successfully (`npm run db:migrate`)
- [x] Seed script populates staff members and appointment assignments (`npm run db:seed`)
- [x] Seed data is queryable via API
- [x] Existing agents, ailments, therapies, and appointments remain intact

### API
- [x] `GET /api/staff` returns 200 with a JSON array of staff members
- [x] `GET /api/staff/:id` returns 200 with staff + assigned appointments
- [x] `POST /api/staff` returns 201 with created staff member
- [x] `PATCH /api/staff/:id` returns 200 with updated staff member
- [x] `DELETE /api/staff/:id` returns 200 and removes staff member
- [x] `GET /api/stats/overview` returns 200 with clinic overview counts
- [x] `POST /api/agents` returns 201 with created agent
- [x] `PATCH /api/agents/:id` returns 200 with updated agent
- [x] `DELETE /api/agents/:id` returns 200 and removes agent
- [x] `POST /api/ailments` returns 201 with created ailment
- [x] `PATCH /api/ailments/:id` returns 200 with updated ailment
- [x] `DELETE /api/ailments/:id` returns 200 and removes ailment
- [x] `POST /api/therapies` returns 201 with created therapy
- [x] `PATCH /api/therapies/:id` returns 200 with updated therapy
- [x] `DELETE /api/therapies/:id` returns 200 and removes therapy
- [x] `POST /api/appointments/:id/assign` returns 200 with assigned staff
- [x] All mutation endpoints return 400 for invalid bodies
- [~] All mutation endpoints return 403 if viewer role attempts action → Phase 5

### UI — Staff Login
- [x] `/staff/login` shows a list of staff members to select from
- [x] Selecting a staff member sets the current staff context
- [x] Redirects to `/staff` after selection
- [x] Previously selected staff is remembered (localStorage)

### UI — Staff Dashboard
- [x] `/staff` shows stat cards with counts (agents, ailments, therapies, appointments)
- [x] "Today's Appointments" section lists today's appointments
- [x] Each appointment shows agent name, therapy, time, status badge
- [x] Quick-link cards navigate to management pages
- [x] Viewer role sees data without edit/delete actions
- [x] Editor/admin role sees CRUD action buttons
- [x] Loading state is shown while data fetches
- [x] Error state is shown if API fails

### UI — Management Pages
- [x] `/staff/agents` lists all agents with edit/delete actions
- [x] `/staff/ailments` lists all ailments with edit/delete actions
- [x] `/staff/therapies` lists all therapies with edit/delete actions
- [x] "Add" button opens a create dialog
- [x] Edit button opens a pre-filled edit dialog
- [x] Delete button shows confirmation before removing
- [x] Viewer role sees list only — no edit/delete buttons
- [~] Success toast/message after create, update, delete → Phase 5
- [x] Loading, empty, and error states

### UI — Appointment Management (→ Phase 5)
- [~] Today's appointments show staff assignment dropdown
- [~] Assigning staff updates the appointment
- [~] Reschedule opens a date/time picker
- [~] Cancel shows confirmation dialog
- [~] Status change buttons work inline

### Navigation
- [x] Header contains "Staff" link
- [x] Link navigates to `/staff/login` if no staff selected, or `/staff` if logged in
- [x] Active link styling matches existing pattern

### Responsive
- [x] All new pages render without horizontal overflow at 375px, 768px, and 1280px
- [x] Stat cards reflow to 2-column grid on mobile, 4-column on desktop
- [x] Management tables stack to cards on mobile
- [x] Form elements stack vertically on mobile
- [x] Touch targets remain ≥ 44px on mobile viewports

### Manual Walkthrough
- [ ] Open browser at `localhost:3000`, navigate to `/staff/login`
- [ ] Select a staff member, verify redirect to dashboard
- [ ] Verify stat cards show correct counts
- [ ] Navigate to management pages, verify CRUD operations work
- [ ] Test role-based visibility (switch to viewer, verify edit buttons hidden)
- [ ] Test appointment management (assign, reschedule, cancel)
- [ ] Verify page transitions feel smooth (Framer Motion)

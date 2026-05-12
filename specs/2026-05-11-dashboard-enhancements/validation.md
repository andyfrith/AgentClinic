# Validation — Dashboard Enhancements

## Acceptance Criteria

All criteria must pass before the branch can be merged.

### Build & Type Safety
- [x] `npx tsc --noEmit` produces zero errors
- [x] `npm run lint` passes with no warnings
- [x] `npm run format:check` passes

### Tests
- [x] `npm run test:run` — all 157 unit tests pass (133 existing + 24 new)
- [x] `npx playwright test` — all 59 E2E tests pass (requires running database + dev server)
- [x] Unit tests cover `StaffAppointmentCard` component (renders, interactions, states)
- [x] Unit tests cover API role enforcement (403 responses for viewers)
- [x] E2E tests cover staff login, CRUD, role-based UI, and inline controls

### API — Role Enforcement
- [x] All POST/PATCH/DELETE endpoints return 403 if `x-staff-id` header is missing
- [x] All POST/PATCH/DELETE endpoints return 403 if caller is `viewer` role
- [x] Staff CRUD endpoints (POST/PATCH/DELETE `/api/staff*`) return 403 if caller is not `admin`
- [x] All endpoints return 200/201 for `editor` and `admin` roles
- [x] Existing 400/404 error responses remain unchanged

### UI — Inline Appointment Controls
- [x] "Today's Appointments" section shows staff assignment dropdown
- [x] Staff dropdown lists all staff members; pre-selects currently assigned staff
- [x] Clicking a staff name toggles assignment (assign/unassign)
- [x] "Start" button visible only for `scheduled` appointments
- [x] "Complete" button visible only for `in-progress` appointments
- [x] "Cancel" button visible for non-terminal appointments (`scheduled`, `in-progress`)
- [x] Cancel shows a confirmation dialog before proceeding
- [x] Reschedule date input allows picking a new date
- [x] Actions show loading state while mutation is pending
- [x] Disabled state on all controls while any mutation is in flight
- [x] Error state shown if an individual action fails (toast or inline)

### UI — Success Toasts
- [x] Creating an entity shows a success toast
- [x] Updating an entity shows a success toast
- [x] Deleting an entity shows a success toast
- [x] Changing appointment status shows a success toast
- [x] Assigning/unassigning staff shows a success toast
- [x] Rescheduling an appointment shows a success toast
- [x] API errors show an error toast
- [ ] Toasts appear in both light and dark mode (requires manual check)

### UI — Role-Based Visibility
- [x] Viewer role: no Add/Edit/Delete buttons on management pages
- [x] Viewer role: no inline appointment controls visible
- [x] Editor role: sees all controls on management pages and dashboard
- [x] Admin role: sees all controls including staff management

### Navigation & Layout
- [x] Existing navigation links unchanged
- [x] Active nav link styling matches existing pattern
- [x] Staff dashboard remains at `/staff` with no URL changes

### Responsive
- [x] Staff dashboard renders without horizontal overflow at 375px, 768px, and 1280px
- [x] Appointment controls stack vertically on mobile (375px)
- [x] Appointment controls lay out inline on tablet and desktop (768px+, 1280px)
- [x] Touch targets ≥ 44px on mobile viewports
- [x] Management pages remain functional at all breakpoints

### Database
- [x] `docker compose up` starts PostgreSQL without errors
- [x] Existing data remains intact (no migrations added)

### Manual Walkthrough
- [ ] Open browser at `localhost:3000`, navigate to `/staff/login`
- [ ] Select an editor/admin staff member, verify redirect to dashboard
- [ ] Verify stat cards show correct counts
- [ ] Assign staff to an appointment from the dashboard
- [ ] Change appointment status (Start, Complete)
- [ ] Cancel an appointment (with confirmation)
- [ ] Reschedule an appointment
- [ ] Verify toast appears on each action
- [ ] Navigate to management pages, verify CRUD toasts
- [ ] Log in as viewer, verify no edit buttons or inline controls
- [ ] Verify page transitions feel smooth (Framer Motion)
- [ ] Verify responsive layout at all breakpoints

# Plan — Dashboard Enhancements

## 1. Toast Infrastructure
- [x] Install `sonner` package
- [x] Add `<Toaster />` to `Providers.tsx` (or root layout)
- [x] Configure default toast duration and styling to match the app theme
- [x] Verify toaster renders without layout shift

## 2. API-Level Role Enforcement
- [x] Add `src/app/api/_helpers/staff-auth.ts` with:
  - `getStaffMember(request: Request)` — reads `x-staff-id` header, queries staff record, returns staff or null
  - `requireRole(request: Request, allowedRoles: string[])` — calls `getStaffMember`, returns 403 response if missing or unauthorized
- [x] Gate `POST /api/agents` — require editor/admin
- [x] Gate `PATCH /api/agents/[id]` — require editor/admin
- [x] Gate `DELETE /api/agents/[id]` — require editor/admin
- [x] Gate `POST /api/ailments` — require editor/admin
- [x] Gate `PATCH /api/ailments/[id]` — require editor/admin
- [x] Gate `DELETE /api/ailments/[id]` — require editor/admin
- [x] Gate `POST /api/therapies` — require editor/admin
- [x] Gate `PATCH /api/therapies/[id]` — require editor/admin
- [x] Gate `DELETE /api/therapies/[id]` — require editor/admin
- [x] Gate `POST /api/appointments` — require editor/admin
- [x] Gate `PATCH /api/appointments/[id]` — require editor/admin
- [x] Gate `POST /api/appointments/[id]/assign` — require editor/admin
- [x] Gate `POST /api/staff` — require admin only
- [x] Gate `PATCH /api/staff/[id]` — require admin only
- [x] Gate `DELETE /api/staff/[id]` — require admin only
- [x] Update existing API route tests to cover 403 scenarios

## 3. Inline Appointment Controls Component
- [x] Create `src/components/StaffAppointmentCard.tsx`:
  - Accept appointment data, staff list, and mutation callbacks as props
  - **Staff assignment**: `Select` dropdown of all staff; currently assigned staff pre-selected; toggles via `useAssignStaff`
  - **Status actions**: conditional buttons based on current status:
    - `scheduled`: "Start" button → set status to `in-progress`
    - `in-progress`: "Complete" button → set status to `completed`
    - Any non-terminal status: "Cancel" button → confirmation dialog → set status to `cancelled`
  - **Reschedule**: date input or shadcn popover/date picker; updates appointment date via `useUpdateAppointment`
  - Loading spinners on individual action buttons during mutation
  - Error display per action if mutation fails
  - Disable controls while any mutation is pending
- [x] Replace read-only appointment cards in `src/app/staff/page.tsx` with `StaffAppointmentCard`
- [x] Fetch staff list on the dashboard page (needed for assignment dropdown)
- [x] Responsive layout: controls stack vertically on mobile, inline on tablet/desktop

## 4. Success Toasts on CRUD
- [x] Add toast callbacks to `use-crud.ts` mutation hooks:
  - `useCreateAgent/useCreateAilment/useCreateTherapy` → "Created successfully"
  - `useUpdateAgent/useUpdateAilment/useUpdateTherapy` → "Updated successfully"
  - `useDeleteAgent/useDeleteAilment/useDeleteTherapy` → "Deleted successfully"
- [x] Add toast callbacks to `use-appointments.ts` mutation hooks:
  - `useCreateAppointment` → "Appointment created"
  - `useUpdateAppointment` → "Appointment updated"
  - `useAssignStaff` → "Staff assigned" / "Staff unassigned"
- [x] Add toast to staff CRUD hooks in `use-staff.ts` where applicable
- [x] Use `toast.success()` for success, `toast.error()` for failures
- [x] Verify toasts appear in light and dark mode

## 5. Component Unit Tests
- [x] Create `src/components/__tests__/StaffAppointmentCard.test.tsx`:
  - Test renders appointment details (agent name, therapy, time, status)
  - Test staff assignment dropdown renders available staff
  - Test status buttons render conditionally based on current status
  - Test cancel confirmation dialog appears
  - Test reschedule date input renders
  - Test loading state disables controls
- [x] Create role enforcement tests at `src/app/api/__tests__/role-enforcement.test.ts`

## 6. E2E Tests
- [x] Create `e2e/staff.spec.ts`:
  - Staff login flow: select staff, verify redirect to dashboard, verify name shown
  - Stat cards: verify counts render on dashboard
  - Management CRUD: create, edit, delete an agent/ailment/therapy on staff pages
  - Role-based UI: login as viewer, verify no edit/delete buttons on management pages
  - Inline controls: assign staff, change status, cancel appointment, reschedule
- [x] Create `e2e/staff.spec.ts` with staff login, dashboard, CRUD, role-based UI, and responsive tests
- [x] Verify screenshots spec renders without errors

## 7. Validation & Polish
- [x] TypeScript compiles with zero errors (`npm run typecheck`)
- [x] `npm run lint` passes with no warnings
- [x] `npm run format` passes
- [x] `npm run test:run` — all 157 unit tests pass (133 existing + 24 new)
- [x] `npx playwright test` — all 59 E2E tests pass (requires running database + dev server)
- [ ] Manual walkthrough in browser (smoke test all flows) — user to verify
- [ ] Responsive check on mobile/tablet/desktop viewports — user to verify

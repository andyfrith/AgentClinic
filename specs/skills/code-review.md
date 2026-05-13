# Code Review Skill

## Prerequisites

- PR branch is up to date with target base branch
- Pre-merge validation has been run: `scripts/pre-merge-check.sh`
- All CI checks pass (if configured)

## Review Checklist

### 1. Spec Alignment

- [ ] Changes match the spec's in-scope items
- [ ] Deviations from spec are intentional and documented
- [ ] Out-of-scope items are not included (flag for extraction to new phase)

### 2. Type Safety

- [ ] No `any` types — use specific types or `unknown` with narrowing
- [ ] No `@ts-ignore` or `@ts-expect-error` without justification
- [ ] All API request/response shapes validated with Zod
- [ ] Drizzle query results typed via `$inferSelect` / `$inferInsert`

### 3. Error Handling

- [ ] API routes wrap logic in try/catch with meaningful error responses
- [ ] Mutation hooks handle errors (toast or fallback UI)
- [ ] Error boundaries or error.tsx at each route segment
- [ ] Loading and empty states present for all data-dependent views

### 4. Security

- [ ] All mutation endpoints have role-based access control (`requireRole`)
- [ ] Input validated with Zod on every API route
- [ ] No secrets, keys, or internal URLs exposed in code or responses
- [ ] Error responses don't leak stack traces or internal details

### 5. Code Quality

- [ ] No significant code duplication (extract shared logic)
- [ ] No unused imports or dead code
- [ ] Import paths use `@/` aliases (not relative)
- [ ] "use client" directives are justified (interactivity or hooks)
- [ ] Animations use StaggerList/StaggerItem consistently

### 6. Testing

- [ ] New code has corresponding tests (unit for hooks/components, API tests for routes)
- [ ] Tests cover success, error, loading, and edge-case states
- [ ] No test file only tests the "happy path"

### 7. Documentation

- [ ] CHANGELOG.md updated with today's date and grouped entries
- [ ] README updated if setup, features, or screenshots changed
- [ ] Screenshots regenerated if UI changed
- [ ] Skills docs updated if workflow changed

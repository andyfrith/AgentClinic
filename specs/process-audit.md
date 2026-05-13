# Process Audit — Spec-Driven Development Workflow

**Version:** 1.0  
**Date:** 2026-05-12  
**Audit scope:** Phases 1–6 (agent profile through polish & deploy)  
**Cadence:** This audit should be repeated at least every 3 phases or when the process changes materially.

---

## 1. Spec-Driven Process Health

### 1.1 Spec Completeness

Each phase produces three documents (`requirements.md`, `plan.md`, `validation.md`) following a consistent template.

| Criterion | Rating | Notes |
|---|---|---|
| Every phase has all 3 documents | ✅ | Phases 1–6 all complete |
| Specs link to mission, tech-stack, roadmap | ✅ | Consistently cross-referenced |
| In/out of scope clearly defined | ✅ | "In scope" and "Out of scope" sections present in all |
| Design decisions documented | ✅ | Rationale recorded for key choices |
| References section present | ✅ | Links to related specs included |
| Non-text artifacts (diagrams, wireframes) | ❌ | No visual design docs exist |
| API contracts (OpenAPI/Swagger) | ❌ | Zod schemas are the only API spec — no separate contract doc |
| Acceptance criteria measurable | ⚠️ | Most are, but some are vague ("feels smooth", "consistent look") |

### 1.2 Scope Creep Management

The AGENTS.md scope creep check policy was invoked at least once (Phase 4→5 split for inline appointment controls).

| Criterion | Rating | Notes |
|---|---|---|
| Policy documented in AGENTS.md | ✅ | Clear before/during implementation guidance |
| Scope creep flagged during phases | ⚠️ | Phase 4→5 split happened, but not consistently documented |
| Descoped items annotated with `[~]` | ❌ | No `[~]` markers or `→ moved to Phase N` notes found in spec docs |
| Roadmap updated when scope split | ✅ | Phase 5 was added to roadmap |
| Plan checkboxes match delivered code | ⚠️ | Phase 6 plan had items unchecked (button animations, nav hover) that were silently dropped |

### 1.3 Spec ↔ Code Alignment

| Phase | Alignment | Notes |
|---|---|---|
| 1 — Agent Profile | ✅ | All spec items delivered |
| 2 — Ailments & Therapies | ✅ | All spec items delivered |
| 3 — Appointment Booking | ✅ | All spec items delivered |
| 4 — Staff Views | ✅ | All spec items delivered |
| 5 — Dashboard Enhancements | ✅ | All spec items delivered |
| 6 — Polish & Deploy | ⚠️ | 3 plan items not implemented (button whileTap, nav hover, stat card hover); validation doc shows unchecked boxes |

### 1.4 Validation Doc Honesty

Validation documents retroactively check boxes. There is no mechanism to verify that checks were performed before the box was marked.

| Risk | Severity |
|---|---|
| "Manual Walkthrough" items checked without actual walkthrough | Medium |
| Checklist items checked at merge time rather than incrementally | Medium |
| No reviewer signature or timestamp on checks | Low |

---

## 2. Quality Gates & Safeguards

### 2.1 Automated Quality Gates

The `pre-merge-check.sh` script runs: README presence, TypeScript, lint, format, unit tests, changelog entry.

| Gate | Automated | In `validate` script | In `pre-merge-check.sh` | Notes |
|---|---|---|---|---|
| TypeScript (`tsc --noEmit`) | ✅ | ✅ | ✅ | |
| ESLint | ✅ | ✅ | ✅ | |
| Prettier format | ✅ | ✅ | ✅ | |
| Unit tests (vitest) | ✅ | ✅ | ✅ | |
| Changelog entry exists | ✅ | ❌ | ✅ | |
| Build (`npm run build`) | ✅ | ❌ | ❌ | Not in any gate |
| E2E tests (playwright) | ✅ | ❌ | ❌ | Separate command |
| Screenshots up to date | ❌ | ❌ | ❌ | No freshness check |
| Security audit (npm audit) | ✅ | ❌ | ❌ | Not in any gate |
| Dependency audit | ✅ | ❌ | ❌ | Not in any gate |
| Bundle size analysis | ❌ | ❌ | ❌ | Not configured |

### 2.2 Test Coverage Adequacy

| Dimension | Count | Adequate? |
|---|---|---|
| Unit tests | 157 tests, 27 files | ✅ Good baseline |
| E2E tests | ~59 tests across 6 specs | ✅ Good coverage |
| Component tests | 8 component test files | ✅ Covers all interactive components |
| Hook tests | 5 hook test files | ⚠️ Missing `use-stats.ts` tests |
| API route tests | 10 route test files | ⚠️ Missing edge cases (invalid JSON, boundary values, race conditions) |
| Schema tests | 1 file | ✅ |
| Integration tests | 0 | ❌ No full-stack tests |
| Visual regression tests | 0 | ❌ Screenshots are manual |
| Performance tests | 0 | ❌ Not configured |
| Security tests | 0 | ❌ No auth bypass, injection, or rate-limit tests |

### 2.3 Missing Safeguards

| Missing Safeguard | Risk | Priority |
|---|---|---|
| Build check in pre-merge | Merging code that doesn't build | High |
| E2E check in validate script | E2E failures caught after merge | High |
| Environment variable validation at startup | Opaque crash if DATABASE_URL is missing | High |
| Security headers (CSP, HSTS, etc.) | XSS, clickjacking, MIME sniffing | High |
| Rate limiting on API endpoints | Abuse, resource exhaustion | Medium |
| Request body size limits | Memory exhaustion from large payloads | Medium |
| Input max-length validation on string fields | Unbounded storage, potential DoS | Medium |
| Database-level unique constraint on appointments | Double-booking race condition | High |
| Session-based auth (vs. localStorage header) | Trivially spoofable auth | High |
| CI/CD pipeline | No automated deployment verification | Medium |
| Visual regression tests | UI regressions undetected | Low |
| Performance budget | No guard against bloat | Low |

---

## 3. Branch & Review Process

### 3.1 Branch Policy Compliance

| Criterion | Rating | Notes |
|---|---|---|
| All work on branches off master | ✅ | All phases on `feat/*` branches |
| Branch naming convention followed | ✅ | `feat/description`, `docs/description`, `chore/description` |
| No commits on master | ✅ | Master receives only PR merges |
| Feature branches deleted after merge | ✅ | Auto-deleted via `gh pr merge --delete-branch` |

### 3.2 Pull Request Process

| Criterion | Rating | Notes |
|---|---|---|
| PRs created for each phase | ✅ | 8 PRs created across all phases |
| PRs have descriptive titles | ✅ | Follow "Implement Phase N: Name" pattern |
| PRs have body with summary | ✅ | Summary of changes included |
| Code review step | ❌ | Single-contributor, no reviewer assigned |
| PR template / checklist | ❌ | No auto-enforced PR template |
| Required status checks | ❌ | No CI status checks configured |
| PR size manageable | ⚠️ | Phase 6 PR was 74 files / 2147 lines — large |

### 3.3 Commit Message Quality

| Criterion | Rating | Notes |
|---|---|---|
| Imperative mood | ✅ | "Implement", "Fix", "Add" consistently used |
| Descriptive subject lines | ✅ | Each commit clearly states what and why |
| Consistent formatting | ✅ | No random capitalization or punctuation |
| Linked to changes in body | ⚠️ | Body detail varies between commits |

---

## 4. Documentation & Knowledge Management

### 4.1 Changelog Quality

| Criterion | Rating | Notes |
|---|---|---|
| Date-sectioned entries | ✅ | All entries under `## YYYY-MM-DD` |
| Section subheadings (###) | ✅ | Organized by component/area |
| Imperative mood bullets | ✅ | Consistent style |
| Covers all phases | ✅ | Phases 1–6 fully documented |
| Bug fixes separated from features | ⚠️ | Some entries mix fix + feature under same heading |
| Scriptable updater | ✅ | `scripts/update-changelog.sh` works well |

### 4.2 README Completeness

| Section | Present | Notes |
|---|---|---|
| Project description | ✅ | |
| Getting started | ✅ | 4-step install, run, migrate, seed |
| Scripts table | ✅ | |
| Specs links | ✅ | Links to all 6 phase specs |
| Skills links | ✅ | Links to 3 skills |
| Tech stack table | ✅ | |
| Screenshots table | ✅ | 12 page screenshots |
| Deployment section | ✅ | Added in Phase 6 |
| Architecture overview | ❌ | No high-level architecture diagram |
| Component tree | ❌ | No component hierarchy documentation |
| Data flow diagram | ❌ | No API → Hook → Component flow doc |

### 4.3 Skills Documentation

| Skill | Status | Notes |
|---|---|---|
| pre-merge-validation | ✅ | Comprehensive, 136 lines |
| update-changelog | ✅ | Clear workflow + conventions |
| capture-screenshots | ✅ | Complete with checklist |
| code-review | ❌ | No documented review process |
| security-review | ❌ | No security review workflow |
| deployment | ❌ | No deployment skill |
| hotfix | ❌ | No emergency process documented |

---

## 5. Risk Areas & Technical Debt

### 5.1 Security Risks (from code review)

| Risk | Severity | File(s) | Status |
|---|---|---|---|
| `x-staff-id` header is trivially spoofable | Critical | `staff-auth.ts`, `StaffContext.tsx` | Existing |
| No UNIQUE constraint on `(agent_id, date)` — double-booking | Critical | `schema.ts` | Existing |
| No startup env validation — `DATABASE_URL!` crash | High | `db/index.ts` | Existing |
| No Content-Security-Policy or security headers | High | Missing `middleware.ts` | Existing |
| localStorage staff session — no expiry, no integrity | Medium | `StaffContext.tsx` | Existing |
| GET endpoints leak data without auth | Medium | All `GET` routes | Existing |
| No max-length on string fields (notes, bio, etc.) | Medium | Route Zod schemas | Existing |
| `assignedStaffId` leaked via public stats endpoint | Low | `stats/overview/route.ts` | Existing |

### 5.2 Code Quality Debt

| Debt | Severity | File(s) | Lines |
|---|---|---|---|
| 3 copies of `getStaffId()`/`authHeaders()` | Medium | `use-crud.ts`, `use-appointments.ts`, `use-staff.ts` | ~30 duplicated |
| 700+ lines of near-identical CRUD pages | Medium | `staff/agents`, `ailments`, `therapies` | ~700 |
| Broken stagger animation (no `<StaggerItem>` wrappers) | Medium | All list pages using `StaggerList` | N/A |
| `Record<string, unknown>` in `use-crud.ts` | Medium | `use-crud.ts` | Loses type safety |
| Unused `SeverityBadge` import | Low | `therapies/[id]/page.tsx` | 1 line |
| `canEdit` identical to `isEditor` in StaffContext | Low | `StaffContext.tsx` | 3 lines |
| Agent PATCH missing `updatedAt` update | Low | `agents/[id]/route.ts` | 1 line |

### 5.3 Testing Blind Spots

| Area | Missing | Impact |
|---|---|---|
| Integration tests | API + DB end-to-end | Schema changes may break API |
| Edge cases in API tests | Invalid JSON, boundary strings, SQL injection vectors | Regressions in error handling |
| Race condition tests | Concurrent appointment booking | Double-booking at scale |
| `use-stats` hook tests | No tests for stats query | Stats changes untested |
| Accessibility tests | No axe-core or similar | Regression in a11y |
| Visual regression tests | No automated screenshot diffing | UI regressions undetected |

---

## 6. Recommendations

### 6.1 Process Improvements (High Priority)

| # | Recommendation | Effort | Impact |
|---|---|---|---|
| 1 | **Add build check** to `pre-merge-check.sh`: `npm run build` must pass before merge | Small | Catches build-breaking merges |
| 2 | **Add E2E gate** to pre-merge: add `npx playwright test e2e/smoke.spec.ts` as a fast smoke test | Small | Prevents total breakage from merging |
| 3 | **Enforce changelog section consistency** — update `update-changelog.sh` to validate section headings match a defined list | Small | Keeps changelog clean |
| 4 | **Add a PR template** (`.github/PULL_REQUEST_TEMPLATE.md`) with checklist for typecheck, lint, tests, screenshots, changelog | Small | Enforces quality baseline on every PR |
| 5 | **Add `[~]` annotation rule** — update AGENTS.md to require `[~]` markers in plan docs when scope is descoped, with `→ moved to Phase N` | Small | Audit trail for scope decisions |

### 6.2 Code Quality Improvements

| # | Recommendation | Effort | Impact |
|---|---|---|---|
| 6 | Extract `getStaffId()`/`authHeaders()` to `src/lib/auth.ts` | Small | Eliminates 3 copies |
| 7 | Fix `StaggerList` — wrap list children in `<StaggerItem>` or apply `itemVariants` internally | Small | Fixes broken animation |
| 8 | Extract reusable `<CrudPage>` component for staff CRUD pages | Medium | Eliminates 700+ lines duplication |
| 9 | Replace `Record<string, unknown>` with entity-specific input types in `use-crud.ts` | Small | Restores type safety |
| 10 | Fix `agents/[id]/route.ts` to set `updatedAt` on PATCH | Small | Data consistency |

### 6.3 Security Improvements

| # | Recommendation | Effort | Impact |
|---|---|---|---|
| 11 | Add database UNIQUE constraint on appointments `(agent_id, date)` | Small | Prevents double-booking at DB level |
| 12 | Add env validation at startup (Zod `envSchema`) | Small | Clear error instead of opaque crash |
| 13 | Add security headers via `src/middleware.ts` (CSP, HSTS, X-Frame-Options, X-Content-Type-Options) | Small | Defence-in-depth |
| 14 | Add max-length constraints to Zod schemas (notes, bio, description) | Small | Prevents unbounded storage |
| 15 | Add rate limiting to API routes | Medium | Abuse prevention |

### 6.4 Testing Improvements

| # | Recommendation | Effort | Impact |
|---|---|---|---|
| 16 | Add API integration tests (DB + route handler together) | Medium | Catches schema-API misalignment |
| 17 | Add edge-case tests for all routes: invalid JSON, boundary values, non-existent FKs | Medium | Robust error handling |
| 18 | Add `use-stats` hook tests | Small | Fills testing gap |
| 19 | Add a visual regression test in the screenshots spec (pixel-diff against baseline) | Medium | Catches visual regressions |

### 6.5 Documentation Improvements

| # | Recommendation | Effort | Impact |
|---|---|---|---|
| 20 | Add architecture overview to README (component tree, data flow) | Medium | Accelerates new contributor onboarding |
| 21 | Create `specs/skills/code-review.md` — documented review checklist | Small | Formalizes review expectations |
| 22 | Create `specs/skills/deployment.md` — documented deploy process | Small | Ensures repeatable deploys |

---

## 7. Periodic Audit Checklist

Copy this checklist into the validation doc of each future phase's spec, or run it as a standalone process audit every 3 phases.

### Spec Health
- [ ] Spec documents exist for current and previous phase
- [ ] Specs have clear in/out of scope sections
- [ ] Design decisions are documented
- [ ] No unchecked plan items without `[~]` annotation
- [ ] Validation checklist reflects actual delivered scope

### Quality Gates
- [ ] `npm run validate` passes (typecheck + lint + format + unit tests)
- [ ] `npm run build` passes
- [ ] `npx playwright test e2e/smoke.spec.ts` passes
- [ ] All new code has corresponding tests (per test matrix in pre-merge-validation skill)
- [ ] CHANGELOG.md has entries for all changes
- [ ] README.md reflects current state

### Security
- [ ] No hardcoded secrets in code
- [ ] All mutation endpoints have role-based access control
- [ ] Input validation (Zod) on all API routes
- [ ] Error responses don't leak internal details
- [ ] `npm audit` shows no high/critical vulnerabilities

### Code Quality
- [ ] No `any` types added
- [ ] No significant code duplication introduced
- [ ] No unused imports or dead code
- [ ] All "use client" directives are justified
- [ ] Import paths use `@/` aliases

### Documentation
- [ ] README updated if setup, features, or screenshots changed
- [ ] CHANGELOG.md has today's date heading with grouped entries
- [ ] Skills docs updated if workflow changed
- [ ] Spec docs committed alongside code

---

## 8. Post-Audit Remediation (2026-05-12)

On 2026-05-12, a real failure exposed a gap the original audit warned about but didn't close: **tests passed on paper but failed on `master`**.

### Incident Summary

Seven test failures existed on `master` despite:
- All merge branches passing their individual CI
- The `pre-merge-check.sh` script existing
- The PR template listing test validation
- The pre-merge-validation skill documenting the test requirement

**Root cause:** Five audit branches were merged sequentially without re-running tests on `master` between merges. Each branch's tests passed in isolation, but the combined state had mock-vs-route misalignments that only appeared after all branches were merged. The manual pre-merge check was bypassed because the merging developer relied on in-isolation validation.

### Gaps Identified

| Gap | Description |
|---|---|
| No CI enforcement | Pre-merge checks were manual/voluntary — could be skipped |
| No post-merge validation | Tests never ran on `master` after the final merge in a sequence |
| No merge train process | No documented rule for re-validation between sequential merges |
| Self-merge without accountability | Single developer merging own PRs with no reviewer or CI to catch omissions |

### Remediation Actions Taken

| Action | File | Description |
|---|---|---|
| Created CI workflow | `.github/workflows/ci.yml` | Runs typecheck, lint, format, unit tests, build on every PR push and push to master |
| Updated pre-merge-validation skill | `specs/skills/pre-merge-validation.md` | Added "Merge train" section, "Post-merge verification" section, CI reference |
| Updated process audit | This section (§8) | Documents the incident and remediation |
| Will fix test failures | `src/app/api/*/__tests__/*` | 7 pre-existing mock misalignments to be corrected |

### New Audit Recommendations

| # | Recommendation | Effort | Impact |
|---|---|---|---|
| 23 | **Require CI before merge** — configure branch protection rules on GitHub to require CI status checks to pass before merging | Small | Enforces the CI pipeline |
| 24 | **Merge train validation** — documented in pre-merge-validation skill; when merging N branches in sequence, run tests on master after each merge | Small | Prevents combined-state failures |
| 25 | **Post-merge CI verification** — the CI workflow already runs on push to master; the process skill now requires waiting for it to complete post-merge | Small | Catches breakage immediately |

### Updated Periodic Audit Checklist

Add these items to the copy in each phase validation doc:

#### Merge Safety
- [ ] If merging multiple branches in sequence, tests were re-run on `master` after each intermediate merge
- [ ] CI is green on the PR branch before merging
- [ ] CI completed successfully on `master` after the last merge
- [ ] Branch protection rules require CI status checks (if GitHub is used)

---

*End of audit document. Next audit recommended after Phase 9 or upon significant process change.*

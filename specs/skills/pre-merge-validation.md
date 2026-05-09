# Skill: pre-merge-validation

Run before merging any branch to ensure all quality gates pass.

**Rule: All work must be done on a branch separate from `main`.** No commits, changes, or code generation should ever be made directly on `main`. Every change — regardless of size — must originate from a dedicated branch (e.g. `feat/...`, `fix/...`, `chore/...`).

## Prerequisites

- Node modules installed (`npm install`)
- Database running (`docker compose up -d`)
- Dev server is not required (checks run headless)

## Quick start

```bash
scripts/pre-merge-check.sh
```

This runs all checks below and exits zero only if all pass.

---

## Validation steps

### 1. README

Ensure `README.md` reflects the current state of the project. Update if:

- A new feature was added (describe it, link to relevant spec)
- The tech stack changed
- Setup instructions changed
- Stakeholder/audience info changed

**Rule**: README should be useful to a developer cloning the repo for the first time.

### 2. TypeScript

```bash
npx tsc --noEmit
```

**Rule**: Zero errors. Any `any` or type error must be fixed, not suppressed.

### 3. Lint

```bash
npm run lint
```

**Rule**: Zero warnings, zero errors.

### 4. Format

```bash
npm run format:check
```

To auto-fix:

```bash
npm run format
```

**Rule**: All source files must be formatted consistently. The CI gate rejects unformatted code.

### 5. Unit tests

```bash
npm run test:run
```

**Rule**: All tests must pass. If adding new code, add corresponding tests:

| Code change | Required tests |
|---|---|
| New utility function | Unit test for the function |
| New component | Component render test + any behavior tests |
| New hook | Hook test with mocked fetch/query |
| New API route | Route handler test with mocked DB |
| Schema change | Schema definition test |
| New page/flow | E2E test for the user flow |
| Responsive change | E2E viewport test (375px, 768px, 1280px) |

### 6. E2E tests

```bash
npx playwright test
```

**Rule**: All e2e tests pass. Requires dev server (config auto-starts it).

### 7. Changelog

Ensure `CHANGELOG.md` has an entry for today with all changes in this branch.

```bash
scripts/update-changelog.sh -
```

**Rule**: Every branch must add changelog entries before merging.

---

## One-liner (full validation)

```bash
npm run validate
```

Runs: `typecheck` → `lint` → `format:check` → `test:run`

Then separately:

```bash
npx playwright test
scripts/update-changelog.sh -
```

---

## Branch policy

- **Never commit directly to `main`.** All changes — code, docs, config, screenshots, seeds, migrations — must go through a branch.
- Branch naming convention: `<type>/<short-description>` (e.g. `feat/agent-filter`, `fix/avatar-loading`, `chore/update-deps`, `docs/api-readme`).
- The only exception is an emergency hotfix on a release branch, which still bypasses `main` directly.

## Pre-merge checklist

- [ ] Changes are on a branch (not `main`) — verify with `git branch --show-current`
- [ ] Updated `README.md` if project info, setup, or features changed
- [ ] `npm run validate` passes (typecheck + lint + format + unit tests)
- [ ] `npm run test:e2e` passes (all Playwright tests)
- [ ] New code has corresponding unit and/or e2e tests
- [ ] Spec docs in `specs/` are up to date with what was built
- [ ] `CHANGELOG.md` has entries for all changes in this branch
- [ ] Specs, changelog, and validation are all committed

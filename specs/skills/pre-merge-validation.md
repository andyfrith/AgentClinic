# Skill: pre-merge-validation

Run before merging any branch to ensure all quality gates pass.

**Rule: All work must be done on a branch separate from `master`.** No commits, changes, or code generation should ever be made directly on `master`. Every change — regardless of size — must originate from a dedicated branch (e.g. `feat/...`, `fix/...`, `chore/...`).

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

## CI enforcement

A GitHub Actions workflow (`.github/workflows/ci.yml`) runs on every push to any PR branch and on push to `master`. It enforces:

- TypeScript type check
- ESLint (zero warnings)
- Prettier format check
- Unit tests (all pass)
- Production build (succeeds)
- E2E smoke test (against a fresh database)

**Rule**: PRs cannot be merged unless CI is green. This is the safety net that catches failures even if the developer forgets to run the pre-merge script locally. For new projects, a CI pipeline must be configured before the first merge.

**Rule**: Before creating a branch, verify you are not on `master`. Run `git branch --show-current` as the first step of any task. If it says `master`, create your feature branch immediately before writing any code.

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

- **Never commit directly to `master`.** All changes — code, docs, config, screenshots, seeds, migrations — must go through a branch.
- Branch naming convention: `<type>/<short-description>` (e.g. `feat/agent-filter`, `fix/avatar-loading`, `chore/update-deps`, `docs/api-readme`).
- The only exception is an emergency hotfix on a release branch, which still bypasses `master` directly.

---

## Merge train (sequential merges)

When merging multiple branches in sequence (e.g., a series of audit branches that touch overlapping files), the tests can pass on each branch in isolation but fail once merged together. This is exactly what happened when audit branches were merged sequentially without re-validation.

**Rules for sequential merges:**

1. **Run tests on the target branch before merging** — before merging branch B into `master`, ensure `master` merged into B passes all tests. This catches conflicts introduced by branch A.

2. **Re-run the pre-merge check after every merge in a sequence** — after merging each branch in a train, run `scripts/pre-merge-check.sh` on `master` before proceeding to merge the next branch.

3. **Validate the combined state** — when branches modify overlapping files (e.g., one branch adds route handlers, another adds tests for them), create a short-lived integration branch that merges both together first, run tests on it, then merge to `master`.

4. **CI is your safety net** — the `.github/workflows/ci.yml` workflow runs on push to `master`. If a merged branch breaks `master`, CI will fail on the push event and you can revert before the next developer pulls.

---

## Post-merge verification

After any merge to `master`:

1. **Wait for CI to complete** — verify the `CI` workflow passes on the `master` branch.
2. **Check for cascading failures** — if tests fail on `master` post-merge, revert the merge commit immediately and investigate.
3. **Pull the latest master and re-validate** — other developers should run `scripts/pre-merge-check.sh` after pulling the latest `master` to ensure their working tree is clean.

---

## Self-merge note

When the same person authors a PR and merges it (no code review), they are responsible for:

1. Verifying CI is green on the PR branch
2. Waiting for CI to complete post-merge on `master`
3. Ensuring the merge commit doesn't introduce failures

This is the scenario that failed in practice: the pre-merge validation skill existed, the script existed, but neither was enforced automatically. The CI workflow closes this gap by making validtion mandatory rather than voluntary.

---

## Pre-merge checklist

- [ ] Changes are on a branch (not `master`) — verify with `git branch --show-current`
- [ ] `npm run validate` passes (typecheck + lint + format + unit tests)
- [ ] `npm run build` passes
- [ ] `npx playwright test e2e/smoke.spec.ts` passes
- [ ] New code has corresponding unit and/or e2e tests
- [ ] Spec docs in `specs/` are up to date with what was built
- [ ] `CHANGELOG.md` has entries for all changes in this branch
- [ ] CI is green on the PR branch
- [ ] For sequential merges: tests re-run on `master` after the previous merge in the train
- [ ] Specs, changelog, and validation are all committed

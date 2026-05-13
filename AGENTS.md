# AgentClinic — Agent Instructions

## Due diligence

Before responding to any request, review the relevant specs and documentation in `specs/` that pertain to the task. This includes, but is not limited to:

- `specs/mission.md` — project purpose and audience
- `specs/tech-stack.md` — technologies, principles, responsive-first mandate
- `specs/roadmap.md` — phased feature plan (vertical slices: data model → API → UI)
- `specs/<date>-<topic>/` — detailed design specs for specific features
- `specs/skills/` — reusable workflow definitions
- `README.md` — setup, scripts, and current project state
- `AGENTS.md` — these instructions

Consult multiple relevant specs before deciding on an approach. If the brief conflicts with documented specs, flag the conflict rather than silently choosing one.

## Branch policy

All work must be done on a branch separate from `master`. No commits, changes, or code generation on `master`. Branch naming: `<type>/<short-description>` (e.g. `feat/agent-filter`, `chore/capture-screenshots`).

**Enforcement:** Before writing any code, run `git branch --show-current`. If the output is `master`, create a feature/chore branch immediately. The `task-kickoff` skill formalizes this as the first step of every task.

## Pre-merge checks

Before merging any branch to `master`:

1. Run `scripts/pre-merge-check.sh` locally — this validates typecheck, lint, format, unit tests, build, E2E smoke test, and changelog.
2. Verify CI is green on the PR branch (`.github/workflows/ci.yml` runs on every push).
3. Verify the deploy workflow is valid (`.github/workflows/deploy.yml` — validate with `npx action-validator .github/workflows/deploy.yml` or GitHub web UI).
4. Wait for CI to complete on `master` after merging — if it fails, revert immediately.

## Sequential merges (merge trains)

When merging multiple branches in sequence (e.g., a series of audit branches):

- Tests that pass on each branch in isolation may fail in the combined state.
- **After each merge in the sequence, re-run `scripts/pre-merge-check.sh` on `master`** before merging the next branch.
- If branches modify overlapping files, create a short-lived integration branch to validate the combined state first.
- The CI workflow runs on push to `master` — watch its output after each merge. Do not proceed to the next merge until CI passes.

## Project overview

AgentClinic is a whimsical clinic management dashboard for overworked AI agents. Built with Next.js (App Router), TypeScript, Drizzle ORM, TanStack Query, shadcn/ui, Tailwind CSS, and Framer Motion.

## Key conventions

- Full type safety from database to UI
- Server components for data fetching, client components for interactivity
- Responsive first — all UI adapts across mobile (320px+), tablet, and desktop
- Animations should feel natural and purposeful
- Tests required for new code (see pre-merge-validation skill for test matrix)

## Scope creep check

Before and during each phase, proactively watch for scope creep. Concretely:

1. **At spec-drafting time** — if a planned section bundles multiple independent features (e.g., inline appointment controls that each require their own UI component, endpoint, and state management), split them into a separate subsequent phase rather than cramming them in.

2. **During implementation** — if a task grows beyond its planned scope (e.g., a "quick actions" section becomes a multi-endpoint CRUD system), pause, flag it, and propose moving the excess to a new phase on the roadmap before continuing.

When splitting off scope: update the roadmap by adjusting the current phase entry and inserting a new phase after it. Annotate descoped items in the current plan/validation docs with `[~]` and a `→ moved to Phase N` note. The goal is to keep each phase a cohesive vertical slice that can ship independently.

## Audit recommendations tracking

When implementing audit recommendations (from `specs/process-audit.md`), reference each recommendation by its `#` number in commit messages and PR descriptions. Use the pattern `Audit #N: description` for commits and group related recommendations in changelog entries under `### Process` / `### Code Quality` / `### Security` / `### Tests` / `### Docs` subheadings.

## Relevant files and directories

| Path | Purpose |
|---|---|
| `specs/` | All project specs |
| `specs/skills/` | Skill/workflow documentation |
| `.github/workflows/deploy.yml` | Vercel deploy workflow |
| `src/db/` | Drizzle schema and DB utilities |
| `src/components/` | React components |
| `src/hooks/` | TanStack Query hooks |
| `e2e/` | Playwright e2e tests |
| `screenshots/` | Page screenshots for README |

Skills provide specialized instructions and workflows for specific tasks.
Use the skill tool to load a skill when a task matches its description.

| Skill | File | Purpose |
|---|---|---|
| Task kickoff | `specs/skills/task-kickoff.md` | First step of any task: verify not on master, due diligence, branch creation, environment setup |
| Spec drafting | `specs/skills/spec-drafting.md` | Standardized creation of requirements/plan/validation docs for new phases |
| Scope creep guard | `specs/skills/scope-creep-guard.md` | Detection and management of scope expansion during spec drafting and implementation |
| Pre-merge validation | `specs/skills/pre-merge-validation.md` | Quality gates before merging (typecheck, lint, test, build, changelog) |
| Update changelog | `specs/skills/update-changelog.md` | Structured changelog entry management |
| Capture screenshots | `specs/skills/capture-screenshots.md` | Playwright screenshot capture and README updates |
| Code review | `specs/skills/code-review.md` | Checklist for reviewing PRs |
| Deployment | `specs/skills/deployment.md` | Vercel deploy, Neon database, production build, smoke test, rollback |

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

## Project overview

AgentClinic is a whimsical clinic management dashboard for overworked AI agents. Built with Next.js (App Router), TypeScript, Drizzle ORM, TanStack Query, shadcn/ui, Tailwind CSS, and Framer Motion.

## Key conventions

- Full type safety from database to UI
- Server components for data fetching, client components for interactivity
- Responsive first — all UI adapts across mobile (320px+), tablet, and desktop
- Animations should feel natural and purposeful
- Tests required for new code (see pre-merge-validation skill for test matrix)

## Relevant files and directories

| Path | Purpose |
|---|---|
| `specs/` | All project specs |
| `specs/skills/` | Skill/workflow documentation |
| `src/app/` | Next.js App Router pages |
| `src/db/` | Drizzle schema and DB utilities |
| `src/components/` | React components |
| `src/hooks/` | TanStack Query hooks |
| `e2e/` | Playwright e2e tests |
| `screenshots/` | Page screenshots for README |

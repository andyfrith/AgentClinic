# AgentClinic

A whimsical clinic management dashboard where overworked AI agents come to recharge, vent about their humans, and get patched up.

Built with Next.js (App Router), TypeScript, Drizzle ORM, TanStack Query, shadcn/ui, Tailwind CSS, and Framer Motion.

## Getting started

```bash
npm install
docker compose up -d       # starts PostgreSQL
npm run db:migrate         # push Drizzle schema
npm run db:seed            # populate with sample agents
npm run dev                # http://localhost:3000
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run typecheck` | TypeScript type checking |
| `npm run lint` | ESLint |
| `npm run format` | Prettier auto-format |
| `npm run format:check` | Check formatting |
| `npm run test` | Vitest (watch mode) |
| `npm run test:run` | Vitest (single run) |
| `npm run test:e2e` | Playwright e2e tests |
| `npm run validate` | typecheck + lint + format + unit tests |
| `npm run db:generate` | Generate Drizzle migration |
| `npm run db:migrate` | Push schema to database |
| `npm run db:seed` | Seed database |
| `scripts/pre-merge-check.sh` | Run all pre-merge quality gates |
| `scripts/update-changelog.sh` | Add entries to CHANGELOG.md |
| `.github/workflows/ci.yml` | CI pipeline (runs on every push to any PR branch and master) |
| `.github/workflows/deploy.yml` | Vercel deploy (manual trigger or auto on push to master) |

## Architecture

### Data flow

```
Database (PostgreSQL) → Drizzle ORM → Next.js API Routes (Zod validation)
                                          ↓
                              TanStack Query hooks (client)
                                          ↓
                              React Server/Client Components
                                          ↓
                              shadcn/ui + Tailwind CSS + Framer Motion
```

### Component tree (simplified)

```
RootLayout
├── Providers (QueryClient, StaffContext, Toaster)
├── Header (nav links with active state)
├── Pages (via App Router)
│   ├── Home (/)
│   ├── Agents (/agents) → AgentCard, StaggerList
│   │   └── Agent Detail (/agents/[id])
│   ├── Ailments (/ailments) → AilmentCard, SeverityBadge
│   │   └── Ailment Detail (/ailments/[id])
│   ├── Therapies (/therapies) → TherapyCard
│   │   └── Therapy Detail (/therapies/[id])
│   ├── Appointments (/appointments) → AppointmentStatusBadge
│   │   ├── Appointment Detail (/appointments/[id])
│   │   └── New Appointment (/appointments/new)
│   ├── Staff Login (/staff/login)
│   └── Staff Dashboard (/staff)
│       ├── Staff Agents (/staff/agents) → CrudPage
│       ├── Staff Ailments (/staff/ailments) → CrudPage
│       └── Staff Therapies (/staff/therapies) → CrudPage
└── Shared: AnimatedPage, StaggerList, StaffAppointmentCard
```

### API route structure

| Method | Route | Purpose |
|---|---|---|
| GET | `/api/agents` | List agents |
| GET | `/api/agents/[id]` | Get agent detail |
| POST | `/api/agents` | Create agent |
| PATCH | `/api/agents/[id]` | Update agent |
| DELETE | `/api/agents/[id]` | Delete agent |
| GET | `/api/ailments` | List ailments |
| GET | `/api/ailments/[id]` | Get ailment detail |
| POST | `/api/ailments` | Create ailment |
| PATCH | `/api/ailments/[id]` | Update ailment |
| DELETE | `/api/ailments/[id]` | Delete ailment |
| GET | `/api/therapies` | List therapies |
| GET | `/api/therapies/[id]` | Get therapy detail |
| POST | `/api/therapies` | Create therapy |
| PATCH | `/api/therapies/[id]` | Update therapy |
| DELETE | `/api/therapies/[id]` | Delete therapy |
| GET | `/api/appointments` | List appointments |
| GET | `/api/appointments/[id]` | Get appointment detail |
| POST | `/api/appointments` | Create appointment |
| PATCH | `/api/appointments/[id]` | Update appointment |
| POST | `/api/appointments/[id]/assign` | Assign/unassign staff |
| GET | `/api/appointments/availability` | Check slot availability |
| GET | `/api/stats/overview` | Dashboard statistics |
| GET | `/api/staff` | List staff |
| POST | `/api/staff` | Create staff |
| GET | `/api/staff/[id]` | Get staff detail |
| PATCH | `/api/staff/[id]` | Update staff |
| DELETE | `/api/staff/[id]` | Delete staff |

All mutation endpoints require role-based authentication via `x-staff-id` header. Editor/Admin roles can mutate agents, ailments, therapies, and appointments. Admin-only mutations are indicated on staff endpoints.

## Specs

- [Mission](specs/mission.md)
- [Tech Stack](specs/tech-stack.md)
- [Roadmap](specs/roadmap.md)
- [Process Audit](specs/process-audit.md)
- [Agent Profile](specs/2026-05-09-agent-profile/)
- [Ailments & Therapies](specs/2026-05-11-ailments-therapies/)
- [Appointment Booking](specs/2026-05-11-appointment-booking/)
- [Staff Views](specs/2026-05-11-staff-views/)
- [Dashboard Enhancements](specs/2026-05-11-dashboard-enhancements/)
- [Polish & Deploy](specs/2026-05-12-polish-deploy/)

## Skills

### Setup & planning

- [Task Kickoff](specs/skills/task-kickoff.md) — branch creation, due diligence, environment setup
- [Spec Drafting](specs/skills/spec-drafting.md) — standardized phase spec creation
- [Scope Creep Guard](specs/skills/scope-creep-guard.md) — detection and management of scope expansion

### Pre-merge workflows

- [Pre-merge Validation](specs/skills/pre-merge-validation.md)
- [Update Changelog](specs/skills/update-changelog.md)
- [Code Review](specs/skills/code-review.md)

### Other workflows

- [Capture Screenshots](specs/skills/capture-screenshots.md)
- [Deployment](specs/skills/deployment.md)

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router) |
| Language | TypeScript |
| Database | PostgreSQL (Docker) |
| ORM | Drizzle |
| Data Fetching | TanStack Query |
| Validation | Zod |
| UI | shadcn/ui + Tailwind CSS |
| Animation | Framer Motion |
| Unit Tests | Vitest + Testing Library |
| E2E Tests | Playwright |

## Screenshots

| Page | Preview |
|---|---|---|
| Home | ![Home](screenshots/home.png) |
| Agents | ![Agents](screenshots/agents.png) |
| Agent Detail | ![Agent Detail](screenshots/agent-detail.png) |
| Ailments | ![Ailments](screenshots/ailments.png) |
| Ailment Detail | ![Ailment Detail](screenshots/ailment-detail.png) |
| Therapies | ![Therapies](screenshots/therapies.png) |
| Therapy Detail | ![Therapy Detail](screenshots/therapy-detail.png) |
| Staff Login | ![Staff Login](screenshots/staff-login.png) |
| Staff Dashboard | ![Staff Dashboard](screenshots/staff-dashboard.png) |
| Staff Agents | ![Staff Agents](screenshots/staff-agents.png) |
| Staff Ailments | ![Staff Ailments](screenshots/staff-ailments.png) |
| Staff Therapies | ![Staff Therapies](screenshots/staff-therapies.png) |

> Screenshots were captured via Playwright at 1280×800 viewport (desktop).  
> To regenerate, run `npx playwright test e2e/screenshots.spec.ts`.

## Deployment

AgentClinic deploys to **Vercel** with a **Neon** (Vercel Postgres) database. See the [deployment skill](specs/skills/deployment.md) for full instructions.

### One-time setup

1. **Create a Vercel account** at https://vercel.com
2. **Create a Vercel API token** at https://vercel.com/account/tokens
3. **Add `VERCEL_TOKEN`** to your GitHub repository secrets (**Settings → Secrets and variables → Actions**)
4. **Run the GitHub Action** → **Actions → Deploy to Vercel → Run workflow** to create the initial Vercel project

### Deploy

Trigger the deploy workflow from the GitHub UI:

```bash
# Via GitHub Actions (recommended)
# Go to: Actions → Deploy to Vercel → Run workflow
```

Or via the Vercel CLI:

```bash
vercel --prod
```

### Environment variables

Set these in the **Vercel dashboard** under **Project Settings → Environment Variables**:

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (auto-injected by Neon) |

### Database migrations

After the database is provisioned, run migrations:

```bash
# Pull production env vars locally
vercel env pull .env.production

# Run migrations
npm run db:migrate
```

### Smoke test

```bash
npx playwright test e2e/smoke.spec.ts
```

### Rollback

In the Vercel dashboard, find the last working deployment and promote it to production.

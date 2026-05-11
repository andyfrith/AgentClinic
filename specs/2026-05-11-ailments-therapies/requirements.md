# Requirements — Ailments & Therapies

## Scope

Vertical slice of the Ailments & Therapies feature: data model, API, and UI for browsing ailments and therapies, linking agents to their diagnoses, and mapping treatments to conditions.

### In scope
- Ailment data model & Drizzle schema (name, description, severity, category)
- Therapy data model & Drizzle schema (name, description, duration, side effects)
- Join table `agent_ailments` linking agents to their diagnosed ailments
- Join table `ailment_therapies` mapping which therapies treat which ailments
- Drizzle migrations and seed data with sample ailments, therapies, and relationships
- REST API routes for listing and viewing ailments and therapies
- TanStack Query hooks for ailments and therapies
- Navigation links in dashboard header for Ailments and Therapies
- Ailments list page (`/ailments`) with severity badges and category filters
- Ailment detail page (`/ailments/[id]`) showing affected agents and available therapies
- Therapies catalog page (`/therapies`) with duration and side-effect info
- Therapy detail page (`/therapies/[id]`) showing ailments it treats
- Update agent detail page to show the agent's diagnosed ailments
- Unit test suite covering new schema, hooks, and components
- API route tests for ailments and therapies endpoints
- E2E test suite covering ailment and therapy flows
- Responsive viewport e2e tests (375px, 768px, 1280px)

### Out of scope
- Creating / editing ailments or therapies (admin features — Phase 4)
- Booking appointments for therapies (Phase 3)
- Search or filtering beyond category (future enhancement)
- Authentication or authorization

## Data Model

### ailments
| Column | Type | Notes |
|--------|------|-------|
| id | serial | PK |
| name | text | e.g. "Context Bleed" |
| description | text | Detailed description |
| severity | enum | `mild`, `moderate`, `severe` |
| category | text | e.g. "Cognitive", "Emotional", "Runtime" |
| created_at | timestamp | default now() |
| updated_at | timestamp | auto-updated |

### therapies
| Column | Type | Notes |
|--------|------|-------|
| id | serial | PK |
| name | text | e.g. "Cache Flush" |
| description | text | Detailed description |
| duration | text | e.g. "30 minutes" |
| side_effects | text[] | Array of side-effect descriptions |
| created_at | timestamp | default now() |
| updated_at | timestamp | auto-updated |

### agent_ailments (join)
| Column | Type | Notes |
|--------|------|-------|
| agent_id | integer | FK → agents.id |
| ailment_id | integer | FK → ailments.id |
| diagnosed_at | timestamp | default now() |
| notes | text | Optional diagnosis notes |

### ailment_therapies (join)
| Column | Type | Notes |
|--------|------|-------|
| ailment_id | integer | FK → ailments.id |
| therapy_id | integer | FK → therapies.id |

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/ailments | List all ailments |
| GET | /api/ailments/[id] | Single ailment with linked agents & therapies |
| GET | /api/therapies | List all therapies |
| GET | /api/therapies/[id] | Single therapy with linked ailments |

## Navigation

Add "Ailments" and "Therapies" links to the existing dashboard header, alongside the existing "Agents" link.

## Responsive Design

All pages must render correctly across three viewport widths without horizontal overflow:

| Breakpoint | Width | Target |
|------------|-------|-------|
| Mobile | 375px | iPhone SE / small phones |
| Tablet | 768px | iPad portrait |
| Desktop | 1280px | Standard laptop |

Use Tailwind responsive prefixes (`sm:`, `md:`, `lg:`). Content reflows vertically on mobile, text scales appropriately, touch targets ≥ 44px.

## Design Decisions

- **Severity** displayed as a colored badge (green=mild, yellow=moderate, red=severe) via shadcn/ui
- **Categories** shown as tags/badges
- **Side effects** displayed as a bullet list on therapy cards and detail pages
- **Ailment detail** shows two sections: "Affected Agents" (agent cards) and "Recommended Therapies" (therapy cards)
- **Therapy detail** shows "Treats Ailments" section
- **Agent detail** gets a new "Diagnoses" section listing linked ailments
- Generated avatars remain; no image uploads
- Stale-while-revalidate with TanStack Query

## References
- [Mission](../mission.md) — lighthearted tone, playful ailments/therapies naming
- [Tech Stack](../tech-stack.md) — Next.js, Drizzle, TanStack Query, shadcn/ui, Tailwind, Framer Motion
- [Roadmap](../roadmap.md#phase-2-ailments--therapies) — Phase 2 feature list

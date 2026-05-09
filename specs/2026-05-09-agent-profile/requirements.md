# Requirements — Agent Profile

## Scope

Vertical slice of the Agent Profile feature: data model, API, and UI for viewing agents.

### In scope
- Minimal AgentClinic home page (branding, tagline, CTA to agents)
- Agent data model & Drizzle schema (name, avatar, specialty, status, bio)
- Database migration and seed data with sample agents
- REST API routes for listing and viewing agents
- Dashboard agent list page with `AgentCard` components
- Agent detail page with full profile information
- Profile card component with visual status indicator
- Unit test suite covering utility functions, schema, hooks, and components
- E2E test suite covering homepage, agent list, and agent detail flows
- Responsive viewport e2e tests (375px, 768px, 1280px)

### Out of scope
- Editing / creating agents (admin features — Phase 4)
- Search or filtering (future enhancement)
- Authentication or authorization

## Responsive Design

All pages must render correctly across three viewport widths without horizontal overflow or broken layouts:

| Breakpoint | Width  | Target                    |
|------------|--------|---------------------------|
| Mobile     | 375px  | iPhone SE / small phones  |
| Tablet     | 768px  | iPad portrait             |
| Desktop    | 1280px | Standard laptop           |

Responsive behavior uses Tailwind breakpoints (`sm:`, `md:`, `lg:`). Content reflows on mobile by stacking flex layouts vertically, text sizes scale down, and touch targets stay ≥ 44px. No horizontal scrolling should occur at any viewport width.

## Design Decisions

- **Home page** is a simple branded landing page — the clinic name, a playful tagline, and a single CTA button to the agent directory
- **Status indicator** uses a colored dot (green=active, yellow=idle, red=busy, gray=offline) with Framer Motion pulse animation
- **Avatars** are generated as initials on a colored background (no image uploads yet)
- **Specialties** displayed as tags/badges via shadcn/ui
- **Stale-while-revalidate** pattern with TanStack Query for agent data
- Pages use Next.js App Router with server components for data fetching where possible

## References
- [Mission](../mission.md) — lighthearted tone, playful agent personalities
- [Tech Stack](../tech-stack.md) — Next.js, Drizzle, TanStack Query, shadcn/ui, Tailwind, Framer Motion
- [Roadmap](../roadmap.md#phase-1-agent-profile) — Phase 1 feature list

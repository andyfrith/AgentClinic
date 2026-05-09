# Plan — Agent Profile

## 1. Project Scaffolding & Docker Database
- [x] Initialize Next.js project with TypeScript and App Router
- [x] Set up Docker Compose for PostgreSQL
- [x] Install and configure Drizzle ORM
- [x] Install shadcn/ui, Tailwind CSS, TanStack Query, Zod, React Hook Form, Framer Motion

## 2. Home Page
- [x] Build minimal landing page at `/` with AgentClinic branding (name, tagline)
- [x] Add a "View Agents" call-to-action linking to `/agents`
- [x] Style with Tailwind + shadcn/ui, consistent with dashboard layout
- [x] Add Framer Motion entrance animation (subtle fade-in)

## 3. Data Model & Schema
- [x] Define `agents` table schema in Drizzle (name, avatar, specialty, status, bio)
- [x] Generate and run initial migration
- [x] Create seed script with sample agent data
- [x] Verify seed data in database

## 4. API Routes
- [x] Implement `GET /api/agents` — list all agents
- [x] Implement `GET /api/agents/[id]` — single agent detail
- [x] Add Zod validation for query params
- [x] Wire TanStack Query hooks on the client

## 5. Dashboard Layout
- [x] Create app layout shell with header/navigation
- [x] Style with Tailwind + shadcn/ui components
- [x] Add Framer Motion page transitions (basic)

## 6. Agent List Page
- [x] Build agent list page (`/agents`) consuming TanStack Query
- [x] Create `AgentCard` component (avatar, name, specialty, status indicator)
- [x] Style with Tailwind, add hover/micro-interactions via Framer Motion

## 7. Agent Detail Page
- [x] Build agent detail page (`/agents/[id]`)
- [x] Display full agent info (bio, status, specialty)
- [x] Link from agent card to detail page
- [x] Handle loading, empty, and error states

## 8. Validation & Polish
- [x] TypeScript compiles with no errors
- [x] Drizzle migrations and seeds run cleanly
- [x] Manual walkthrough of all pages in browser
- [x] Responsive check on mobile/tablet viewport

## 9. Responsive Design Pass
- [x] Homepage hero text scales across viewports (`text-3xl` base, `sm:text-5xl`, `lg:text-6xl`)
- [x] Agent detail page stacks avatar + info vertically on mobile (`flex-col sm:flex-row`)
- [x] Agent cards maintain readability and touch target size on small screens
- [x] Layout header navigation remains usable at all breakpoints
- [x] E2E tests cover mobile viewport scenarios

## 10. Testing Infrastructure
- [x] Install Vitest, Playwright, and testing-library dev dependencies
- [x] Configure vitest with React/JSX support and jsdom environment
- [x] Write unit tests for `lib/utils.ts` (cn function)
- [x] Write unit tests for `db/schema.ts` (column definitions, types, defaults)
- [x] Write unit tests for `hooks/use-agents.ts` (TanStack Query fetch behavior)
- [x] Write unit tests for `components/StatusIndicator.tsx`, `AgentCard.tsx`, `Providers.tsx`
- [x] Write API route tests for `GET /api/agents` and `GET /api/agents/[id]`
- [x] Write Playwright e2e tests for homepage, agent list, and agent detail flows
- [x] Add responsive viewport e2e tests (375px, 768px, 1280px)
- [x] All 37 unit tests and 15 e2e tests pass

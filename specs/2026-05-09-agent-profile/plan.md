# Plan — Agent Profile

## 1. Project Scaffolding & Docker Database
- [ ] Initialize Next.js project with TypeScript and App Router
- [ ] Set up Docker Compose for PostgreSQL
- [ ] Install and configure Drizzle ORM
- [ ] Install shadcn/ui, Tailwind CSS, TanStack Query, Zod, React Hook Form, Framer Motion

## 2. Home Page
- [ ] Build minimal landing page at `/` with AgentClinic branding (name, tagline)
- [ ] Add a "View Agents" call-to-action linking to `/agents`
- [ ] Style with Tailwind + shadcn/ui, consistent with dashboard layout
- [ ] Add Framer Motion entrance animation (subtle fade-in)

## 3. Data Model & Schema
- [ ] Define `agents` table schema in Drizzle (name, avatar, specialty, status, bio)
- [ ] Generate and run initial migration
- [ ] Create seed script with sample agent data
- [ ] Verify seed data in database

## 4. API Routes
- [ ] Implement `GET /api/agents` — list all agents
- [ ] Implement `GET /api/agents/[id]` — single agent detail
- [ ] Add Zod validation for query params
- [ ] Wire TanStack Query hooks on the client

## 5. Dashboard Layout
- [ ] Create app layout shell with header/navigation
- [ ] Style with Tailwind + shadcn/ui components
- [ ] Add Framer Motion page transitions (basic)

## 6. Agent List Page
- [ ] Build agent list page (`/agents`) consuming TanStack Query
- [ ] Create `AgentCard` component (avatar, name, specialty, status indicator)
- [ ] Style with Tailwind, add hover/micro-interactions via Framer Motion

## 7. Agent Detail Page
- [ ] Build agent detail page (`/agents/[id]`)
- [ ] Display full agent info (bio, status, specialty)
- [ ] Link from agent card to detail page
- [ ] Handle loading, empty, and error states

## 8. Validation & Polish
- [ ] TypeScript compiles with no errors
- [ ] Drizzle migrations and seeds run cleanly
- [ ] Manual walkthrough of all pages in browser
- [ ] Responsive check on mobile/tablet viewport

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

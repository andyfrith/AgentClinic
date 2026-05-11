# Plan — Ailments & Therapies

## 1. Data Model & Schema
- [x] Define `ailments` table (name, description, severity enum, category, timestamps)
- [x] Define `therapies` table (name, description, duration, side_effects text[], timestamps)
- [x] Define `agent_ailments` join table (agent_id FK, ailment_id FK, diagnosed_at, notes)
- [x] Define `ailment_therapies` join table (ailment_id FK, therapy_id FK)
- [x] Update Drizzle schema file and generate migration
- [x] Create seed script with sample ailments, therapies, and relationships
- [x] Seed script links existing agents to relevant ailments
- [x] Verify seed data in database

## 2. API Routes
- [x] Implement `GET /api/ailments` — list all ailments
- [x] Implement `GET /api/ailments/[id]` — single ailment with linked agents & therapies
- [x] Implement `GET /api/therapies` — list all therapies
- [x] Implement `GET /api/therapies/[id]` — single therapy with linked ailments
- [x] Add Zod validation for query params and route params
- [x] Wire TanStack Query hooks on the client (`use-ailments.ts`, `use-therapies.ts`)

## 3. Navigation
- [x] Add "Ailments" and "Therapies" links to the dashboard header
- [x] Style active states matching existing nav pattern

## 4. Ailments List Page
- [x] Build page at `/ailments` consuming TanStack Query
- [x] Show severity badges (green/yellow/red)
- [x] Show category tags
- [x] Responsive grid layout (single column on mobile, multi on desktop)

## 5. Ailment Detail Page
- [x] Build page at `/ailments/[id]`
- [x] Display full ailment info (name, description, severity, category)
- [x] "Affected Agents" section showing linked agent cards
- [x] "Recommended Therapies" section showing linked therapy cards
- [x] Handle loading, empty, and error states

## 6. Therapies List Page
- [x] Build page at `/therapies` consuming TanStack Query
- [x] Show duration and side-effect previews
- [x] Responsive grid layout

## 7. Therapy Detail Page
- [x] Build page at `/therapies/[id]`
- [x] Display full therapy info (name, description, duration, side effects)
- [x] "Treats Ailments" section showing linked ailment cards
- [x] Handle loading, empty, and error states

## 8. Agent Detail Update
- [x] Add "Diagnoses" section to agent detail page
- [x] Show linked ailments as badges/links

## 9. Testing
- [x] Unit tests for Drizzle schema (column definitions, types, defaults, relations)
- [x] Unit tests for TanStack Query hooks (`use-ailments.ts`, `use-therapies.ts`)
- [x] Unit tests for new components (severity badge, ailment card, therapy card)
- [x] API route tests for `GET /api/ailments`, `GET /api/ailments/[id]`
- [x] API route tests for `GET /api/therapies`, `GET /api/therapies/[id]`
- [x] Playwright e2e tests for ailments list, ailment detail flows
- [x] Playwright e2e tests for therapies catalog, therapy detail flows
- [x] Playwright e2e tests for agent detail showing diagnoses
- [x] Responsive viewport e2e tests (375px, 768px, 1280px)

## 10. Validation & Polish
- [x] TypeScript compiles with no errors
- [x] Drizzle migrations and seeds run cleanly
- [x] Manual walkthrough of all new pages in browser
- [x] Responsive check on mobile/tablet viewport

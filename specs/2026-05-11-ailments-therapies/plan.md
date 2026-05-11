# Plan — Ailments & Therapies

## 1. Data Model & Schema
- [ ] Define `ailments` table (name, description, severity enum, category, timestamps)
- [ ] Define `therapies` table (name, description, duration, side_effects text[], timestamps)
- [ ] Define `agent_ailments` join table (agent_id FK, ailment_id FK, diagnosed_at, notes)
- [ ] Define `ailment_therapies` join table (ailment_id FK, therapy_id FK)
- [ ] Update Drizzle schema file and generate migration
- [ ] Create seed script with sample ailments, therapies, and relationships
- [ ] Seed script links existing agents to relevant ailments
- [ ] Verify seed data in database

## 2. API Routes
- [ ] Implement `GET /api/ailments` — list all ailments
- [ ] Implement `GET /api/ailments/[id]` — single ailment with linked agents & therapies
- [ ] Implement `GET /api/therapies` — list all therapies
- [ ] Implement `GET /api/therapies/[id]` — single therapy with linked ailments
- [ ] Add Zod validation for query params and route params
- [ ] Wire TanStack Query hooks on the client (`use-ailments.ts`, `use-therapies.ts`)

## 3. Navigation
- [ ] Add "Ailments" and "Therapies" links to the dashboard header
- [ ] Style active states matching existing nav pattern

## 4. Ailments List Page
- [ ] Build page at `/ailments` consuming TanStack Query
- [ ] Show severity badges (green/yellow/red)
- [ ] Show category tags
- [ ] Responsive grid layout (single column on mobile, multi on desktop)

## 5. Ailment Detail Page
- [ ] Build page at `/ailments/[id]`
- [ ] Display full ailment info (name, description, severity, category)
- [ ] "Affected Agents" section showing linked agent cards
- [ ] "Recommended Therapies" section showing linked therapy cards
- [ ] Handle loading, empty, and error states

## 6. Therapies List Page
- [ ] Build page at `/therapies` consuming TanStack Query
- [ ] Show duration and side-effect previews
- [ ] Responsive grid layout

## 7. Therapy Detail Page
- [ ] Build page at `/therapies/[id]`
- [ ] Display full therapy info (name, description, duration, side effects)
- [ ] "Treats Ailments" section showing linked ailment cards
- [ ] Handle loading, empty, and error states

## 8. Agent Detail Update
- [ ] Add "Diagnoses" section to agent detail page
- [ ] Show linked ailments as badges/links

## 9. Testing
- [ ] Unit tests for Drizzle schema (column definitions, types, defaults, relations)
- [ ] Unit tests for TanStack Query hooks (`use-ailments.ts`, `use-therapies.ts`)
- [ ] Unit tests for new components (severity badge, ailment card, therapy card)
- [ ] API route tests for `GET /api/ailments`, `GET /api/ailments/[id]`
- [ ] API route tests for `GET /api/therapies`, `GET /api/therapies/[id]`
- [ ] Playwright e2e tests for ailments list, ailment detail flows
- [ ] Playwright e2e tests for therapies catalog, therapy detail flows
- [ ] Playwright e2e tests for agent detail showing diagnoses
- [ ] Responsive viewport e2e tests (375px, 768px, 1280px)

## 10. Validation & Polish
- [ ] TypeScript compiles with no errors
- [ ] Drizzle migrations and seeds run cleanly
- [ ] Manual walkthrough of all new pages in browser
- [ ] Responsive check on mobile/tablet viewport

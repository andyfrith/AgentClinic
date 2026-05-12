# Plan — Polish & Deploy

## 1. Animated Primitives
- [ ] Create `src/components/AnimatedPage.tsx` — reusable client component wrapping children in a `motion.div` with fade+slide-up animation (replaces duplicate `motion.div` boilerplate on every page)
- [ ] Create `src/components/StaggerList.tsx` — wraps children with `motion.div` stagger container; each child gets fade+slide with sequential delay
- [ ] Export both from `src/components/index.ts` (or use direct imports)

## 2. Route-Level Loading, Error, and Not-Found States
- [ ] Add `src/app/loading.tsx` — full-page skeleton
- [ ] Add `src/app/error.tsx` — error boundary with retry, animated entry
- [ ] Add `src/app/not-found.tsx` — 404 page with link home
- [ ] Add `src/app/agents/loading.tsx` — skeleton matching agent list layout
- [ ] Add `src/app/agents/error.tsx` — error boundary with back link
- [ ] Add `src/app/agents/not-found.tsx` — agent-specific 404
- [ ] Add `src/app/agents/[id]/loading.tsx` — skeleton matching detail layout
- [ ] Add `src/app/agents/[id]/error.tsx` — error boundary with back link
- [ ] Add `src/app/ailments/loading.tsx`
- [ ] Add `src/app/ailments/error.tsx`
- [ ] Add `src/app/ailments/not-found.tsx`
- [ ] Add `src/app/ailments/[id]/loading.tsx`
- [ ] Add `src/app/ailments/[id]/error.tsx`
- [ ] Add `src/app/therapies/loading.tsx`
- [ ] Add `src/app/therapies/error.tsx`
- [ ] Add `src/app/therapies/not-found.tsx`
- [ ] Add `src/app/therapies/[id]/loading.tsx`
- [ ] Add `src/app/therapies/[id]/error.tsx`
- [ ] Add `src/app/appointments/loading.tsx`
- [ ] Add `src/app/appointments/error.tsx`
- [ ] Add `src/app/appointments/not-found.tsx`
- [ ] Add `src/app/appointments/[id]/loading.tsx`
- [ ] Add `src/app/appointments/[id]/error.tsx`
- [ ] Add `src/app/appointments/new/loading.tsx`
- [ ] Add `src/app/appointments/new/error.tsx`
- [ ] Add `src/app/staff/loading.tsx`
- [ ] Add `src/app/staff/error.tsx`
- [ ] Add `src/app/staff/not-found.tsx`
- [ ] Add `src/app/staff/login/loading.tsx`
- [ ] Add `src/app/staff/login/error.tsx`
- [ ] Add `src/app/staff/agents/loading.tsx`
- [ ] Add `src/app/staff/agents/error.tsx`
- [ ] Add `src/app/staff/ailments/loading.tsx`
- [ ] Add `src/app/staff/ailments/error.tsx`
- [ ] Add `src/app/staff/therapies/loading.tsx`
- [ ] Add `src/app/staff/therapies/error.tsx`

## 3. Refactor Existing Pages to Use AnimatedPage
- [ ] `src/app/page.tsx` — wrap hero content with `<AnimatedPage>`
- [ ] `src/app/agents/page.tsx` — replace `motion.div` with `<AnimatedPage>`, use `<StaggerList>` for agent cards
- [ ] `src/app/agents/[id]/page.tsx` — replace `motion.div` with `<AnimatedPage>`
- [ ] `src/app/ailments/page.tsx` — replace `motion.div` with `<AnimatedPage>`, use `<StaggerList>`
- [ ] `src/app/ailments/[id]/page.tsx` — replace `motion.div` with `<AnimatedPage>`
- [ ] `src/app/therapies/page.tsx` — replace `motion.div` with `<AnimatedPage>`, use `<StaggerList>`
- [ ] `src/app/therapies/[id]/page.tsx` — replace `motion.div` with `<AnimatedPage>`
- [ ] `src/app/appointments/page.tsx` — replace `motion.div` with `<AnimatedPage>`, use `<StaggerList>`
- [ ] `src/app/appointments/[id]/page.tsx` — replace `motion.div` with `<AnimatedPage>`
- [ ] `src/app/staff/page.tsx` — replace `motion.div` with `<AnimatedPage>`
- [ ] `src/app/staff/agents/page.tsx` — replace `motion.div` with `<AnimatedPage>`
- [ ] `src/app/staff/ailments/page.tsx` — replace `motion.div` with `<AnimatedPage>`
- [ ] `src/app/staff/therapies/page.tsx` — replace `motion.div` with `<AnimatedPage>`

## 4. Micro-interactions
- [ ] Add `whileHover` + `whileTap` to `Button` component in `src/components/ui/button.tsx`
- [ ] Add `whileHover` scale effect to `AgentCard`
- [ ] Add `whileHover` scale effect to `AilmentCard` (if not already present)
- [ ] Add `whileHover` scale effect to `TherapyCard` (if not already present)
- [ ] Add staggered entrance to `StatusIndicator` pulsing dot
- [ ] Add hover effect to `SiteHeader` nav links with `motion.div`
- [ ] Add stat card hover animation on staff dashboard

## 5. Meta Tags, Favicon, SEO
- [ ] Expand root `layout.tsx` metadata with Open Graph, Twitter card, theme color
- [ ] Add per-page `generateMetadata` or `metadata` exports:
  - `src/app/agents/page.tsx` — metadata
  - `src/app/agents/[id]/page.tsx` — dynamic `generateMetadata`
  - `src/app/ailments/page.tsx` — metadata
  - `src/app/ailments/[id]/page.tsx` — dynamic `generateMetadata`
  - `src/app/therapies/page.tsx` — metadata
  - `src/app/therapies/[id]/page.tsx` — dynamic `generateMetadata`
  - `src/app/appointments/page.tsx` — metadata
  - `src/app/appointments/new/page.tsx` — metadata
  - `src/app/appointments/[id]/page.tsx` — dynamic `generateMetadata`
  - `src/app/staff/page.tsx` — metadata
  - `src/app/staff/login/page.tsx` — metadata
- [ ] Create `src/app/sitemap.ts`
- [ ] Create `src/app/robots.ts`
- [ ] Create custom SVG favicon at `public/favicon.svg`
- [ ] Remove default Next.js SVGs from `public/` (file.svg, globe.svg, next.svg, vercel.svg, window.svg)
- [ ] Link favicon in root layout

## 6. Production Database & Deployment Config
- [ ] Create `docker-compose.prod.yml` with production PostgreSQL config
- [ ] Create `.env.example` with all required environment variables
- [ ] Document deployment steps in `README.md` deployment section

## 7. E2E Smoke Test
- [ ] Create `e2e/smoke.spec.ts` — visits every main page and verifies:
  - Home page renders
  - Agents list renders
  - Agent detail renders (click first agent)
  - Ailments list renders
  - Therapies list renders
  - Appointments list renders
  - Staff login renders
  - Navigation between pages works
  - No console errors on any page

## 8. Validation
- [ ] TypeScript compiles with zero errors (`npm run typecheck`)
- [ ] `npm run lint` passes with no warnings
- [ ] `npm run format:check` passes
- [ ] `npm run test:run` — all unit tests pass
- [ ] `npx playwright test e2e/smoke.spec.ts` — smoke test passes
- [ ] Existing E2E tests remain unaffected

# Validation — Polish & Deploy

## Acceptance Criteria

All criteria must pass before the branch can be merged.

### Build & Type Safety
- [ ] `npx tsc --noEmit` produces zero errors
- [ ] `npm run lint` passes with no warnings
- [ ] `npm run format:check` passes

### Tests
- [ ] `npm run test:run` — all existing unit tests pass
- [ ] `npx playwright test e2e/smoke.spec.ts` — smoke test passes
- [ ] No existing tests broken by refactoring

### Loading States
- [ ] Every route segment has a `loading.tsx` with appropriate skeleton layout
- [ ] Loading skeletons match the layout of their corresponding page
- [ ] Loading states are visually consistent (use `Skeleton` component with `animate-pulse`)

### Error Boundaries
- [ ] Every route segment has an `error.tsx` with retry button or back link
- [ ] Error boundaries use Framer Motion for animated entry
- [ ] Error states are visually distinct (destructive border/background)
- [ ] Server errors don't crash the entire app (each segment is isolated)

### Not Found
- [ ] Top-level `not-found.tsx` renders for unknown routes
- [ ] List-level `not-found.tsx` is accessible but detail pages keep inline handling

### Animations
- [ ] `AnimatedPage` provides consistent fade+slide-up entrance on every page
- [ ] `StaggerList` animates list items sequentially with small delay
- [ ] Buttons have `whileTap` scale feedback
- [ ] Cards have `whileHover` lift effect
- [ ] Navigation links have hover animation
- [ ] Animations feel natural, not gratuitous

### SEO
- [ ] Root layout exports full metadata (title, description, Open Graph, Twitter card, theme color)
- [ ] Every page has a unique title and description
- [ ] Detail pages use `generateMetadata` for dynamic titles
- [ ] `sitemap.ts` includes all public routes
- [ ] `robots.ts` allows all crawlers
- [ ] Custom favicon renders in browser tab

### Deployment
- [ ] `docker-compose.prod.yml` starts PostgreSQL without errors
- [ ] `.env.example` documents all required variables
- [ ] Deployment section exists in README

### Smoke Test
- [ ] Home page renders without console errors
- [ ] All list pages render without console errors
- [ ] Detail pages render without console errors
- [ ] Navigation links work and don't produce console errors
- [ ] Staff login page renders without console errors

### Scope Boundaries
- [x] No new database tables or migrations
- [x] No new API routes
- [x] No new feature pages
- [x] Existing page behavior preserved (only animation refactoring)

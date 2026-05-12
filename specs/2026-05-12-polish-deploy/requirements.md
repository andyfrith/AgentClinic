# Requirements — Polish & Deploy

## Scope

Vertical slice focused on production polish: loading/error/empty state robustness, Framer Motion page transitions and micro-interactions, SEO basics, and deployment infrastructure.

### In scope
- `loading.tsx`, `error.tsx`, `not-found.tsx` files for every route segment
- Reusable animated page wrapper and stagger list components
- Framer Motion micro-interactions on buttons, cards, stat cards, navigation
- Enhanced metadata: per-page titles, Open Graph tags, Twitter cards
- `sitemap.ts` and `robots.ts` for SEO
- Custom favicon and cleaned-up `public/` assets
- Production Docker Compose and deployment docs
- E2E smoke test covering all major user flows

### Out of scope
- Real authentication (passwords, SSO, OAuth)
- Real-time updates (WebSockets, polling)
- New database tables or migrations
- New API endpoints or pages
- Accessibility audit (deferred to dedicated phase)
- Performance benchmarking or Lighthouse scoring
- CI/CD pipeline configuration
- Actual cloud deployment (documentation only)

## Design Decisions

- **Route-level boundaries** — Each route segment gets its own `loading.tsx` and `error.tsx`. The `loading.tsx` files use the existing `Skeleton` component with page-appropriate layouts. The `error.tsx` files use Framer Motion for the error state reveal. Detail pages that already handle loading/error inline will also get route-level files as a fallback wrapper, but keep their inline handlers for specific error messaging.
- **Page transition wrapper** — A reusable `AnimatedPage` client component wraps page content with a consistent fade+slide animation, replacing the current `motion.div` boilerplate duplicated across every page.
- **Stagger list** — A `StaggerList` component wraps map-rendered lists to animate children appearing sequentially with a small delay between each.
- **Micro-interactions** — Cards get `whileHover` scale/lift effects; buttons get `whileTap` scale; navigation links get `whileHover` underline animation. All via Framer Motion.
- **Metadata** — Root layout already exports `Metadata`. Each page will export its own metadata object with appropriate title and description. The root metadata gets expanded with Open Graph and Twitter card properties.
- **Sitemap** — Generated via `src/app/sitemap.ts` exporting all public routes.
- **Robots** — Generated via `src/app/robots.ts` allowing all crawlers.
- **Favicon** — SVG-based favicon replacing the default Next.js `.ico`. Clean up default Vercel/Next.js SVGs from `public/`.
- **Production database** — Add a `docker-compose.prod.yml` and document production environment variables in `.env.example`.
- **Smoke test** — A single Playwright spec (`e2e/smoke.spec.ts`) that visits every main page and verifies content renders, navigation works, and no console errors occur.

## References
- [Mission](../mission.md)
- [Tech Stack](../tech-stack.md)
- [Roadmap](../roadmap.md#phase-6-polish--deploy)

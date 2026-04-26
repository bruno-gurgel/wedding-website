# Research: Fabhia & Bruno Wedding Website

**Branch**: `001-wedding-website` | **Phase**: 0 | **Date**: 2026-04-26

## 1. Next.js 16 + App Router — Key Decisions

**Decision**: Use the App Router with Server Components as default; opt into Client Components only where interactivity or browser APIs are required.

**Rationale**: Next.js 16.2.4 is installed. The App Router is the default and preferred routing model. Server Components reduce client bundle size by default, which directly supports the LCP and bundle-size requirements in the constitution.

**Key API notes** (from Next.js 16 docs):
- Server Functions / Server Actions: use `'use server'` directive; invoked via form `action` props or event handlers.
- Route Handlers live in `app/api/*/route.ts`; cannot share a segment with `page.tsx`.
- `revalidatePath('/')` or `revalidateTag(...)` triggers cache invalidation after mutations.
- `cookies()` API is async: `const cookieStore = await cookies()`.
- `next/font/google` self-hosts fonts at build time — no runtime Google Fonts network request.
- `next/image` provides automatic size optimization, lazy loading, and CLS prevention.

**Alternatives considered**:
- Pages Router: Rejected — legacy, no Server Components, more boilerplate for this use case.

---

## 2. Animation Strategy — Motion vs. GSAP Boundary

**Decision**: Use Motion (`motion/react`) for scroll-triggered section reveals and UI transitions. Use GSAP + ScrollTrigger exclusively for the Hero section's parallax effect and cinematic entrance sequence.

**Rationale**: Motion integrates naturally with React's component model and is well-suited for declarative `whileInView` and `AnimatePresence` patterns. GSAP ScrollTrigger is the industry standard for complex, timeline-based scroll animations and parallax — it provides finer control over the hero's cinematic sequence than Motion's simpler scroll API.

**Boundary**:
- Hero section: GSAP (`gsap.registerPlugin(ScrollTrigger)`) — parallax layers, staggered text entrance, pinning.
- All other sections: Motion (`motion/react`) — `whileInView`, `initial`/`animate`, `exit` with `AnimatePresence`.
- Navigation active-state transitions: Motion.

**Key implementation notes**:
- GSAP + React: use `useGSAP` hook from `@gsap/react` to manage contexts and avoid memory leaks.
- Motion `whileInView` with `viewport={{ once: true }}` for one-shot section reveals.
- `'use client'` directive required for all animation components (browser APIs).

**Alternatives considered**:
- GSAP for everything: More verbose, less ergonomic for React state-driven animations.
- Motion for everything: Motion's scroll API lacks the timeline precision needed for the hero.

---

## 3. Database — Neon + Prisma

**Decision**: Neon (serverless PostgreSQL) accessed via Prisma ORM. Use Prisma's `@prisma/client` with the Neon serverless driver adapter for optimal cold-start performance on Vercel Edge/Serverless.

**Rationale**: Neon is available via the Vercel Marketplace (zero-config integration, `DATABASE_URL` auto-provisioned). Prisma 6.x supports the Neon serverless adapter (`@prisma/adapter-neon`), which avoids TCP connection overhead in serverless environments.

**Prisma adapter setup** (latest Prisma 6 pattern):
```ts
import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)
const adapter = new PrismaNeon(sql)
const prisma = new PrismaClient({ adapter })
```

**Singleton pattern**: Export a single Prisma client instance from `lib/db.ts` to prevent connection pool exhaustion in development hot-reload.

**Alternatives considered**:
- Direct `@neondatabase/serverless` without Prisma: Rejected — loses type safety and schema management.
- Drizzle ORM: Valid alternative, but Prisma is specified by the user.
- Traditional `pg` driver: Rejected — TCP connections are inefficient in serverless; Neon's HTTP driver is preferred.

---

## 4. Gift List — Optimistic Updates

**Decision**: Implement gift claim as a client-side optimistic update using `useOptimistic` (React 19) or local state rollback, followed by a Server Action or Route Handler call.

**Rationale**: React 19 ships `useOptimistic` for exactly this pattern. It allows the UI to reflect the claimed state immediately, then reconcile with the server response. If the server rejects (e.g., gift already taken by another guest), the optimistic state is rolled back and an error message is shown.

**Pattern**:
```tsx
const [optimisticGifts, setOptimistic] = useOptimistic(gifts)

async function handleClaim(giftId: string) {
  setOptimistic(prev => prev.map(g => g.id === giftId ? { ...g, isTaken: true } : g))
  const result = await claimGift(giftId) // Server Action
  if (!result.ok) {
    // React auto-reverts optimistic state; show error toast
  }
}
```

**Alternatives considered**:
- SWR/React Query for optimistic mutations: Adds dependency weight; `useOptimistic` is built into React 19 which is already installed.
- Polling for gift state: Poor UX; rejected.

---

## 5. Admin Access — Passphrase Pattern

**Decision**: Store the admin passphrase in an environment variable (`ADMIN_PASSPHRASE`). The `/admin` page uses a client-side form that sends the passphrase to a Server Action; the Server Action sets a short-lived cookie (`admin_session`) on success. Subsequent requests to `/admin` check for the cookie.

**Rationale**: No full auth system is needed. A cookie-based session (not a JWT, not a database session) is sufficient for a single-user admin view that is not publicly advertised. The passphrase never appears in the client bundle.

**Security boundary**: The passphrase check happens exclusively in a Server Action or Route Handler — never in client-side code. The cookie is `httpOnly`, `sameSite: 'lax'`, and has a 24-hour expiry.

**Alternatives considered**:
- URL query param for passphrase: Rejected — passphrase would appear in browser history and server logs.
- NextAuth / Lucia: Rejected — massively over-engineered for a single hardcoded credential.

---

## 6. Font Pairing

**Decision**: Cormorant Garamond (serif, headings and display text) + Jost (geometric sans-serif, body, navigation, UI labels).

**Rationale**: Cormorant Garamond is an elegant, high-contrast editorial serif — widely used in luxury wedding design. Jost is a clean, modern geometric sans that pairs without competing. Both are available on Google Fonts and loadable via `next/font/google` with zero layout shift.

**Implementation**:
```ts
import { Cormorant_Garamond, Jost } from 'next/font/google'
const cormorant = Cormorant_Garamond({ subsets: ['latin'], weight: ['300', '400', '600'], variable: '--font-cormorant' })
const jost = Jost({ subsets: ['latin'], variable: '--font-jost' })
```

**Alternatives considered**:
- Playfair Display + Lato: Classic pairing but slightly more generic.
- EB Garamond + Inter: EB Garamond is less refined at display sizes.

---

## 7. Color Palette & Design Tokens

**Decision**: Ivory background, deep eucalyptus green, dusty rose/blush, and champagne gold. Delivered as CSS custom properties in a `tokens.css` file imported into the Tailwind 4 configuration.

**Palette**:
| Token | Hex | Usage |
|---|---|---|
| `--color-ivory` | `#F8F4EF` | Page background |
| `--color-green-deep` | `#2A4A35` | Primary text, nav, accents |
| `--color-blush` | `#D4A99A` | Section accents, highlights |
| `--color-gold` | `#B8974A` | Decorative lines, price labels |
| `--color-cream` | `#EDE8E0` | Card backgrounds |
| `--color-charcoal` | `#2C2C2C` | Body text |

**Tailwind 4 custom tokens**: In Tailwind 4, CSS variables are referenced directly in utility classes via `@theme` directive in the global CSS file.

---

## 8. Deployment — Vercel

**Decision**: Deploy to Vercel with Neon Postgres provisioned via the Vercel Marketplace integration.

**Key configuration**:
- `DATABASE_URL` and `DATABASE_URL_UNPOOLED` provided automatically by Vercel + Neon integration.
- `ADMIN_PASSPHRASE` added manually in Vercel environment variables.
- `next.config.ts` — no special configuration needed for this project.
- Vercel automatically detects Next.js and configures the build pipeline.

**Vercel build command**: `prisma generate && next build`
**Package manager**: pnpm (Vercel auto-detects via `pnpm-lock.yaml`).

---

## 9. Project Structure Decision

Single Next.js application (no monorepo). The App Router provides the routing layer; no separate backend service is needed.

```
app/                    # Next.js App Router
├── layout.tsx
├── page.tsx            # Single-page home (all 6 sections)
├── admin/
│   └── page.tsx        # Passphrase-protected RSVP admin
└── api/
    ├── rsvp/
    │   └── route.ts    # GET (admin) / POST (guest submission)
    └── gifts/
        └── [id]/
            └── route.ts # PATCH (claim gift)
components/
├── sections/           # One component per section
├── ui/                 # Shared UI primitives
└── animations/         # GSAP and Motion wrappers
lib/
├── db.ts               # Prisma singleton
├── tokens.ts           # Design token constants (TypeScript)
└── constants.ts        # Wedding date, venue, gift data seed
prisma/
└── schema.prisma
public/
└── photos/             # Static couple photos
styles/
└── globals.css         # Tailwind 4 + CSS custom properties
```

All NEEDS CLARIFICATION items resolved: none remain.

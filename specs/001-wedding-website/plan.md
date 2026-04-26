# Implementation Plan: Fabhia & Bruno Wedding Website

**Branch**: `001-wedding-website` | **Date**: 2026-04-26 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/001-wedding-website/spec.md`

## Summary

A premium single-page wedding website for Fabhia & Bruno (wedding: August 22, 2026,
15:30 BRT, Horto Brasília Convention, Jardim Botânico, Brasília/DF). The site has
six scroll sections, a live countdown, a guest RSVP form with database persistence,
an optimistic gift list, and a passphrase-protected admin view. Built with Next.js 16
App Router + TypeScript, styled with Tailwind CSS 4, animated with Motion and GSAP,
backed by Neon PostgreSQL via Prisma, and deployed to Vercel.

## Technical Context

**Language/Version**: TypeScript 5.x / Node.js 20+ / React 19.2.4
**Primary Dependencies**: Next.js 16.2.4 (App Router), Tailwind CSS 4, Motion (`motion/react`),
GSAP + ScrollTrigger + `@gsap/react`, Prisma 6, `@prisma/adapter-neon`, `@neondatabase/serverless`
**Storage**: Neon (serverless PostgreSQL) via Vercel Marketplace — `DATABASE_URL` auto-provisioned
**Testing**: Vitest (unit), Playwright (E2E for RSVP, gift claim, admin flows)
**Target Platform**: Vercel (serverless functions + CDN edge), desktop-primary web app
**Project Type**: web-app (single-page + /admin route)
**Performance Goals**: LCP ≤ 2.5s, CLS < 0.1, INP ≤ 200ms, Lighthouse ≥ 90 (Performance, Accessibility, Best Practices)
**Constraints**: pnpm package manager; no payment processing; no file uploads; no real-time features; static couple photos only; no auth system (single passphrase admin)
**Scale/Scope**: ~200–400 wedding guests, 1 admin user, ~15 gifts, wedding date fixed at 2026-08-22

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Gate | Status | Notes |
|---|---|---|---|
| I. Code Quality | TypeScript strict mode must be configured. ESLint with `eslint-config-next` must be passing. No magic values — design tokens in `lib/tokens.ts` + CSS custom properties. | ✅ PASS | `tsconfig.json` strict mode on; Tailwind 4 tokens via `@theme` directive; no inline hardcoded values. |
| II. Testing Standards | E2E tests MUST cover RSVP submission, gift claim, and admin access flows. | ✅ PLANNED | Playwright E2E for all three critical journeys defined in spec. |
| III. UX Consistency | Shared design token system mandatory. WCAG 2.1 AA contrast. All interactive elements keyboard-accessible. Mobile-first at 375px. All states (loading, error, empty) designed. | ✅ PASS | Token system in `styles/globals.css` + `lib/tokens.ts`. Contrast verified against palette in research.md. |
| IV. Performance Requirements | `next/image` mandatory for all images. LCP ≤ 2.5s. Bundle increases > 10 KB gzipped require justification. | ⚠️ NOTE | GSAP (~55 KB gzipped) + Motion (~30 KB) together add ~85 KB client JS. Justified: these are the animation libraries explicitly required by the spec and constitute the core cinematic experience. Both are loaded only in Client Components. |

**Complexity Tracking**:

| Approved Exception | Why Needed | Simpler Alternative Rejected Because |
|---|---|---|
| GSAP + Motion (both) | GSAP provides ScrollTrigger timeline control for hero; Motion provides declarative React-integrated scroll reveals for other sections | Using only one would either lose the cinematic hero precision (Motion-only) or create verbose, non-declarative component code throughout (GSAP-only) |
| Passphrase cookie auth | Protects sensitive RSVP data from casual access | URL param: passphrase appears in logs/history. No auth at all: RSVP data exposed to anyone who finds /admin |

## Project Structure

### Documentation (this feature)

```text
specs/001-wedding-website/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   ├── rsvp.md          # RSVP API contract
│   ├── gifts.md         # Gifts API contract
│   └── admin.md         # Admin auth contract
└── tasks.md             # Phase 2 output (created by /speckit-tasks)
```

### Source Code (repository root)

```text
app/
├── layout.tsx                  # Root layout: fonts, metadata, global styles
├── page.tsx                    # Home page: all 6 sections composed
├── globals.css → styles/       # (imported from layout)
├── admin/
│   └── page.tsx                # Passphrase-protected RSVP admin view
└── api/
    ├── rsvp/
    │   └── route.ts            # POST (submit), GET (admin list)
    ├── gifts/
    │   └── [id]/
    │       └── route.ts        # PATCH (claim)
    └── admin/
        └── auth/
            └── route.ts        # POST (verify passphrase, set cookie)

components/
├── sections/
│   ├── HeroSection.tsx         # Full-screen hero, GSAP, countdown
│   ├── OurStorySection.tsx     # Couple story, photo carousel
│   ├── CeremonySection.tsx     # Venue, map embed, details
│   ├── RSVPSection.tsx         # RSVP form (client component)
│   ├── GiftListSection.tsx     # Gift cards with optimistic claim
│   └── DressCodeSection.tsx    # Moodboard, color palette
├── ui/
│   ├── Navigation.tsx          # Fixed top bar, active section tracking
│   ├── Countdown.tsx           # Live countdown timer (client)
│   ├── PhotoCarousel.tsx       # Story photo carousel (client)
│   ├── GiftCard.tsx            # Single gift card with claim button
│   ├── RSVPForm.tsx            # RSVP form with validation
│   └── ColorSwatch.tsx         # Dress code color palette display
└── animations/
    ├── HeroParallax.tsx        # GSAP ScrollTrigger hero wrapper
    └── SectionReveal.tsx       # Motion whileInView reveal wrapper

lib/
├── db.ts                       # Prisma + Neon adapter singleton
├── tokens.ts                   # Design token constants (TS)
├── constants.ts                # Wedding date, venue info, nav items
└── utils.ts                    # Shared helpers (cn, formatPrice, etc.)

actions/
├── rsvp.ts                     # Server Actions for RSVP submission
├── gifts.ts                    # Server Actions for gift claim
└── admin.ts                    # Server Actions for admin auth

prisma/
├── schema.prisma               # Data model (RSVPResponse, Gift)
├── migrations/                 # Auto-generated migration files
└── seed.ts                     # Gift list seed data

styles/
└── globals.css                 # Tailwind 4 @import, @theme tokens, base styles

public/
└── photos/                     # Static couple photos + gift images

tests/
├── e2e/
│   ├── rsvp.spec.ts            # Playwright: RSVP submission flow
│   ├── gifts.spec.ts           # Playwright: gift claim flow
│   └── admin.spec.ts           # Playwright: admin passphrase + table
└── unit/
    ├── countdown.test.ts       # Vitest: countdown timer logic
    └── gifts.test.ts           # Vitest: optimistic update logic
```

**Structure Decision**: Single Next.js 16 App Router application. No monorepo. Server Components are the default; Client Components are used only for interactive/animation features (Navigation, Countdown, PhotoCarousel, RSVPForm, GiftCard, HeroParallax, SectionReveal).

---

## Phase 0: Research Summary

See [research.md](./research.md) for full findings. Key decisions:

1. **App Router default**: Server Components reduce client bundle; Client Components only where needed.
2. **Animation boundary**: GSAP ScrollTrigger for hero; Motion (`motion/react`) for all other sections.
3. **Prisma + Neon adapter**: `@prisma/adapter-neon` + `@neondatabase/serverless` for serverless-optimized DB access.
4. **Optimistic gift claim**: React 19 `useOptimistic` for instant UI feedback with server reconciliation.
5. **Admin auth**: `httpOnly` cookie (`admin_session`) set by Server Action after passphrase verification.
6. **Fonts**: Cormorant Garamond (serif, headings) + Jost (sans, body/nav) via `next/font/google`.
7. **Color palette**: Ivory, deep eucalyptus green, dusty blush, champagne gold.

All NEEDS CLARIFICATION items: none.

---

## Phase 1: Design Artifacts

### Design Tokens

```ts
// lib/tokens.ts — mirrored in styles/globals.css @theme block
export const colors = {
  ivory:     '#F8F4EF',
  greenDeep: '#2A4A35',
  blush:     '#D4A99A',
  gold:      '#B8974A',
  cream:     '#EDE8E0',
  charcoal:  '#2C2C2C',
}

export const animation = {
  durationStandard:   '300ms',
  durationCinematic:  '800ms',
  easingOut:          'cubic-bezier(0.16, 1, 0.3, 1)',
  easingInOut:        'cubic-bezier(0.87, 0, 0.13, 1)',
}

export const spacing = {
  sectionPaddingY: '6rem',  // 96px desktop
  sectionPaddingX: '2rem',  // 32px desktop
}
```

### Section Order & Anchor IDs

| # | Section | Anchor | Component |
|---|---|---|---|
| 1 | Hero | `#inicio` | `HeroSection` |
| 2 | Our Story | `#nossa-historia` | `OurStorySection` |
| 3 | Ceremony & Reception | `#cerimonia` | `CeremonySection` |
| 4 | RSVP | `#confirmacao` | `RSVPSection` |
| 5 | Gift List | `#presentes` | `GiftListSection` |
| 6 | Dress Code | `#dress-code` | `DressCodeSection` |

### Data Model

See [data-model.md](./data-model.md) — two entities: `RSVPResponse`, `Gift`.

### API Contracts

See [contracts/rsvp.md](./contracts/rsvp.md), [contracts/gifts.md](./contracts/gifts.md), [contracts/admin.md](./contracts/admin.md).

### Quickstart

See [quickstart.md](./quickstart.md) for local setup, environment variables, seeding, and deployment.

---

## Constitution Check (Post-Design)

All gates pass. The only approved exception (dual animation library bundle) is documented in the Complexity Tracking table above and is inherent to the feature requirements.

---

## Next Step

Run `/speckit-tasks` to generate the task breakdown for implementation.

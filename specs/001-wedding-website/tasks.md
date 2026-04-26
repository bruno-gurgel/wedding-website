---
description: "Task list for Fabhia & Bruno Wedding Website"
---

# Tasks: Fabhia & Bruno Wedding Website

**Input**: Design documents from `specs/001-wedding-website/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

**Tests**: E2E tests included for the three critical user journeys (RSVP, gift claim, admin) per the constitution's testing mandate.

**Organization**: Tasks grouped by user story for independent implementation and delivery.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1–US4)
- File paths are relative to repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install dependencies and establish the project foundation.

- [ ] T001 Install animation and database dependencies: `pnpm add motion gsap @gsap/react prisma @prisma/client @prisma/adapter-neon @neondatabase/serverless`
- [ ] T002 Enable TypeScript strict mode — set `"strict": true` in `tsconfig.json` and verify `pnpm tsc --noEmit` passes
- [ ] T003 [P] Create `styles/globals.css` with Tailwind 4 `@import "tailwindcss"`, `@theme` block for all design tokens (ivory, greenDeep, blush, gold, cream, charcoal, font variables, animation durations)
- [ ] T004 [P] Create `lib/tokens.ts` exporting typed design token constants mirroring the CSS custom properties in `styles/globals.css`
- [ ] T005 [P] Create `lib/constants.ts` with wedding date (`2026-08-22T15:30:00-03:00`), venue name/address, nav section anchors array, and photo paths array for the carousel
- [ ] T006 [P] Create `lib/utils.ts` with `cn()` class-merging helper and `formatPrice(price: Decimal): string` for BRL formatting

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Database schema, Prisma client, and root layout must exist before any user story can ship.

**⚠️ CRITICAL**: No user story work begins until this phase is complete.

- [ ] T007 Create `prisma/schema.prisma` with `RSVPResponse` and `Gift` models exactly as specified in `specs/001-wedding-website/data-model.md`, using `@prisma/adapter-neon` preview feature
- [ ] T008 Run `pnpm prisma migrate dev --name init` to create the initial migration and verify tables exist
- [ ] T009 Create `lib/db.ts` exporting a singleton Prisma client using `PrismaNeon` adapter with `@neondatabase/serverless` — guard against hot-reload re-instantiation in development
- [ ] T010 [P] Create `prisma/seed.ts` with 10–15 sample gift entries (name, description, price in BRL, placeholder externalUrl, displayOrder); run `pnpm prisma db seed` and verify gifts appear
- [ ] T011 Create `app/layout.tsx` — root layout importing Cormorant Garamond and Jost from `next/font/google` with CSS variable output (`variable: '--font-cormorant'`, `variable: '--font-jost'`), applying both font variables to `<html>`, setting `lang="pt-BR"`, and importing `styles/globals.css`
- [ ] T012 [P] Create `.env.local` template file (`.env.local.example`) documenting `DATABASE_URL`, `ADMIN_PASSPHRASE`, and `ADMIN_SESSION_SECRET` — do not commit real values

**Checkpoint**: Foundation ready — run `pnpm dev`, open `localhost:3000`, and verify the page loads without errors before continuing.

---

## Phase 3: User Story 1 — Guest Submits RSVP (Priority: P1) 🎯 MVP

**Goal**: A guest can submit their name and attendance choice; the response is persisted.

**Independent Test**: Navigate to `localhost:3000/#confirmacao`, fill the form, submit, verify confirmation appears, run `pnpm prisma studio` and confirm the row exists in `rsvp_responses`.

### Tests for User Story 1 ⚠️

> **Write these tests FIRST — they must FAIL before implementation begins**

- [ ] T013 [P] [US1] Create `tests/e2e/rsvp.spec.ts` with Playwright tests: happy path (submit attending=true), happy path (attending=false), validation (empty name blocked), server error graceful message — tests must fail before T014

### Implementation for User Story 1

- [ ] T014 [US1] Create `actions/rsvp.ts` — `submitRSVP(formData: FormData)` Server Action that trims and validates `guestName`, sets `attending` boolean, calls `db.rSVPResponse.create()`, returns `{ ok: boolean; error?: string }`
- [ ] T015 [US1] Create `app/api/rsvp/route.ts` — `POST` handler that mirrors the Server Action (validates body, persists to DB, returns 201/400/500); `GET` handler returns 403 (auth implemented in US3)
- [ ] T016 [US1] Create `components/ui/RSVPForm.tsx` — client component using `useActionState` with `submitRSVP`; fields: text input for name, two radio buttons (attending/not attending); inline validation error; pending spinner on submit; success confirmation message replaces form on success
- [ ] T017 [US1] Create `components/sections/RSVPSection.tsx` — section wrapper with `id="confirmacao"`, heading, subtext, renders `<RSVPForm />`; wrapped in `<SectionReveal>` (Motion, added in US4 — use a `<div>` placeholder for now)
- [ ] T018 [US1] Add `<RSVPSection />` to `app/page.tsx` as section 4 of the page

**Checkpoint**: User Story 1 fully functional — guest can submit RSVP, see confirmation, and the row is in the database.

---

## Phase 4: User Story 2 — Guest Claims a Gift (Priority: P2)

**Goal**: Guest browses gifts and marks one as chosen; it disappears optimistically for all visitors.

**Independent Test**: Load `localhost:3000/#presentes`, verify seeded gifts appear, click claim on one, verify it disappears immediately, reload the page and confirm it remains gone. Attempt to claim a pre-taken gift and verify the conflict message.

### Tests for User Story 2 ⚠️

> **Write these tests FIRST — they must FAIL before implementation begins**

- [ ] T019 [P] [US2] Create `tests/e2e/gifts.spec.ts` with Playwright tests: gift list renders, claiming removes a gift optimistically, reloading confirms the gift remains gone, claiming an already-taken gift shows conflict message — tests must fail before T020

### Implementation for User Story 2

- [ ] T020 [US2] Create `actions/gifts.ts` — `claimGift(giftId: string)` Server Action that attempts `db.gift.update({ where: { id, isTaken: false }, data: { isTaken: true, takenAt: new Date() } })`; returns `{ ok: true }` on success or `{ ok: false, error: '...', isTaken: true }` on conflict (Prisma `P2025` or conditional check)
- [ ] T021 [US2] Create `app/api/gifts/[id]/route.ts` — `PATCH` handler implementing the same logic as the Server Action; returns 200/409/404/500 per the contract in `specs/001-wedding-website/contracts/gifts.md`
- [ ] T022 [US2] Create `components/ui/GiftCard.tsx` — client component accepting a `Gift` prop; uses `useOptimistic` to immediately hide the gift on claim click; calls `claimGift()`; on server conflict rolls back and shows a toast/inline message in Portuguese; includes gift name, description, price (formatted BRL), external store link (opens in new tab)
- [ ] T023 [US2] Create `components/sections/GiftListSection.tsx` — Server Component that fetches `db.gift.findMany({ where: { isTaken: false }, orderBy: { displayOrder: 'asc' } })` at request time; renders a grid of `<GiftCard>`; renders empty state ("Todos os presentes já foram escolhidos 🎉") when list is empty; `id="presentes"`
- [ ] T024 [US2] Add `<GiftListSection />` to `app/page.tsx` as section 5

**Checkpoint**: US1 and US2 both independently functional. Both E2E test suites pass.

---

## Phase 5: User Story 3 — Admin RSVP View (Priority: P3)

**Goal**: The couple can access `/admin`, enter the passphrase, and see all RSVP responses.

**Independent Test**: Navigate to `localhost:3000/admin`, enter wrong passphrase → error shown, enter correct passphrase → RSVP table appears with all submitted responses including names, status, and dates.

### Tests for User Story 3 ⚠️

> **Write these tests FIRST — they must FAIL before implementation begins**

- [ ] T025 [P] [US3] Create `tests/e2e/admin.spec.ts` with Playwright tests: wrong passphrase shows error, correct passphrase shows RSVP table, empty state when no RSVPs — tests must fail before T026

### Implementation for User Story 3

- [ ] T026 [US3] Create `app/api/admin/auth/route.ts` — `POST` handler that reads `passphrase` from JSON body, compares with `process.env.ADMIN_PASSPHRASE` using constant-time comparison (`crypto.timingSafeEqual`), on success sets `httpOnly` `admin_session` cookie (HMAC-signed current timestamp using `ADMIN_SESSION_SECRET`, 24h expiry), returns 200/401
- [ ] T027 [US3] Create `actions/admin.ts` — `verifyPassphrase(formData: FormData)` Server Action that calls the auth logic, sets the cookie via `next/headers` `cookies()` API, returns `{ ok: boolean; error?: string }`
- [ ] T028 [US3] Create `app/admin/page.tsx` — Server Component; reads `admin_session` cookie via `await cookies()`; if missing or invalid: renders passphrase form (client sub-component); if valid: fetches all `db.rSVPResponse.findMany({ orderBy: { createdAt: 'desc' } })` and renders a table with columns: Guest Name, Attending (Sim/Não), Submitted At; includes summary row (total / attending / not attending); empty state if no responses

**Checkpoint**: Admin view works independently. All three E2E suites pass.

---

## Phase 6: User Story 4 — Navigation & Full Site Experience (Priority: P4)

**Goal**: All six sections render with cinematic animations; fixed nav highlights active section; mobile layout works at 375px.

**Independent Test**: Load the site, verify hero countdown ticks, scroll through all six sections and confirm nav highlights update, click nav items and confirm smooth scroll, resize to 375px and verify no horizontal overflow and all content is readable.

### Implementation for User Story 4

- [ ] T029 [P] [US4] Create `components/animations/SectionReveal.tsx` — client component wrapping `motion.div` from `motion/react` with `initial={{ opacity: 0, y: 40 }}`, `whileInView={{ opacity: 1, y: 0 }}`, `viewport={{ once: true, margin: '-80px' }}`, configurable `duration` and `delay` props; apply to OurStory, Ceremony, RSVP, GiftList, DressCode sections
- [ ] T030 [P] [US4] Create `components/ui/Countdown.tsx` — client component using `useEffect` + `setInterval(1000)` to compute days/hours/minutes/seconds remaining until `2026-08-22T15:30:00-03:00`; clamps at zero; displays in four labeled boxes with digit styling
- [ ] T031 [US4] Create `components/animations/HeroParallax.tsx` — client component using `useGSAP` from `@gsap/react`; registers `ScrollTrigger`; on mount creates a GSAP timeline for: staggered text entrance (couple names, date, subtitle fade-up), background image parallax on scroll, pin/scrub effect as user scrolls past hero; cleans up on unmount
- [ ] T032 [US4] Create `components/sections/HeroSection.tsx` — full-screen (`min-h-screen`) section with `id="inicio"`; renders `<HeroParallax>` as wrapper; inside: couple names ("Fabhia & Bruno") in Cormorant Garamond display size, wedding date in Jost, `<Countdown />` component; background uses `next/image` with `fill` and `priority` for the hero photo
- [ ] T033 [US4] Create `components/ui/PhotoCarousel.tsx` — client component; accepts `photos: string[]` prop from `lib/constants.ts`; keyboard and click navigable; uses `next/image` for each slide; Motion `AnimatePresence` for slide transitions; prev/next controls
- [ ] T034 [US4] Create `components/sections/OurStorySection.tsx` — wraps content in `<SectionReveal>`; `id="nossa-historia"`; left column: couple story text (8 years, travels, apartment renovation, pets Sirius and Tokyo); right column: `<PhotoCarousel />`
- [ ] T035 [US4] Create `components/sections/CeremonySection.tsx` — wraps in `<SectionReveal>`; `id="cerimonia"`; displays date (22 de agosto de 2026), time (15h30 — pontualmente), venue name and full address; parking note; Google Maps `<iframe>` embed (URL from `lib/constants.ts`); responsive two-column layout
- [ ] T036 [US4] Create `components/ui/ColorSwatch.tsx` — renders a row of color circles/rectangles with color name labels using the token palette; accepts `swatches: Array<{ name: string; hex: string }>` prop
- [ ] T037 [US4] Create `components/sections/DressCodeSection.tsx` — wraps in `<SectionReveal>`; `id="dress-code"`; moodboard-style grid layout with dress code description text (outdoor garden, light and comfortable, no black); renders `<ColorSwatch>` with the palette; uses background textures or soft overlapping images if photos are provided
- [ ] T038 [US4] Create `components/ui/Navigation.tsx` — client component; fixed top bar; uses `IntersectionObserver` to track which section anchor is in view and highlights the corresponding nav item; smooth-scroll on nav item click; hides/shows background blur on scroll; renders nav items from `lib/constants.ts` anchors array
- [ ] T039 [US4] Compose final `app/page.tsx` with all six sections in order: `<HeroSection>`, `<OurStorySection>`, `<CeremonySection>`, `<RSVPSection>`, `<GiftListSection>`, `<DressCodeSection>`; add `<Navigation>` outside the section flow (fixed position)
- [ ] T040 [US4] Wrap all non-hero sections with `<SectionReveal>` and verify Motion animations trigger correctly on scroll; remove the placeholder `<div>` added in T017

**Checkpoint**: All six sections render. Nav works. Countdown ticks. Mobile layout renders without horizontal overflow at 375px.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Quality gates, accessibility, and production readiness.

- [ ] T041 [P] Add loading state (spinner/skeleton) to `RSVPForm` during submission and to `GiftCard` during claim — use `useFormStatus` or the `pending` boolean from `useActionState`
- [ ] T042 [P] Add error boundary or try/catch error state to `GiftListSection` (server fetch failure → friendly empty state, not a crash)
- [ ] T043 Verify WCAG 2.1 AA contrast for all text/background combinations — check ivory on greenDeep, charcoal on ivory, blush as accent; update token values if any fail 4.5:1 threshold
- [ ] T044 [P] Run `pnpm tsc --noEmit` and resolve all TypeScript errors
- [ ] T045 [P] Run `pnpm lint` and resolve all ESLint warnings
- [ ] T046 Configure Playwright in `playwright.config.ts` — base URL `http://localhost:3000`, Chromium + Mobile Chrome (375px) viewports
- [ ] T047 Run full E2E suite (`pnpm test:e2e`) and confirm all tests pass
- [ ] T048 Run through the quickstart.md verification checklist manually — all 10 items must pass
- [ ] T049 [P] Update `package.json` build script to `"build": "prisma generate && prisma migrate deploy && next build"` for Vercel compatibility
- [ ] T050 [P] Create `public/photos/` directory with placeholder images and update `lib/constants.ts` photo paths — document where real couple photos should be placed

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately; T003–T006 run in parallel
- **Foundational (Phase 2)**: Requires Phase 1 complete — T007→T008→T009 sequential; T010, T012 parallel after T009
- **US1 (Phase 3)**: Requires Phase 2 complete; T013 (E2E tests) → T014 → T015 → T016 → T017 → T018
- **US2 (Phase 4)**: Requires Phase 2 complete; can run in parallel with US1 if staffed; T019 → T020 → T021 → T022 → T023 → T024
- **US3 (Phase 5)**: Requires Phase 2 complete; can run in parallel with US1 and US2; T025 → T026 → T027 → T028
- **US4 (Phase 6)**: Requires US1 and US2 complete (sections exist to compose); T029–T030 parallel; T031 → T032; T033–T037 parallel after T029; T038 → T039 → T040
- **Polish (Phase 7)**: Requires all user stories complete; T041–T042, T044–T045, T049–T050 parallel

### Within Each User Story

- E2E tests written FIRST, confirmed failing, then implementation proceeds
- Database/action layer before UI components
- Server components before client composition

### Parallel Opportunities per Story

```bash
# Phase 1 — run together:
T003 styles/globals.css
T004 lib/tokens.ts
T005 lib/constants.ts
T006 lib/utils.ts

# Phase 2 — sequential then parallel:
T007 → T008 → T009 (sequential, each depends on previous)
T010 || T012 (parallel after T009)

# Phase 6 — run together:
T029 SectionReveal.tsx
T030 Countdown.tsx
# then T031 → T032 → (T033 || T034 || T035 || T036 || T037) → T038 → T039 → T040
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Write T013 tests (must fail)
4. Complete Phase 3: US1 (RSVP)
5. **STOP and VALIDATE**: RSVP form works end-to-end, E2E tests pass
6. Site is functional for guest RSVPs

### Incremental Delivery

1. Setup + Foundational → DB ready, layout shell exists
2. US1 → RSVP works → validate independently
3. US2 → Gift list works → validate independently
4. US3 → Admin view works → validate independently
5. US4 → Full cinematic experience → mobile verified
6. Polish → All gates pass → deploy to Vercel

### Parallel Team Strategy

With two developers after Phase 2 completes:
- **Dev A**: US1 (RSVP) + US3 (Admin) — both are data/form focused
- **Dev B**: US2 (Gift List) + US4 (Animations/Navigation) — both are UI focused

---

## Notes

- `[P]` tasks operate on different files with no incomplete dependencies — safe to parallelize
- `[Story]` labels map tasks to spec.md user stories for traceability
- E2E tests must be written before implementation and must FAIL before implementation begins (constitution requirement)
- `useOptimistic` requires React 19 — already installed (`react: 19.2.4`)
- GSAP ScrollTrigger must be registered once: `gsap.registerPlugin(ScrollTrigger)` inside `useGSAP` callback
- All images go through `next/image` — no raw `<img>` tags permitted
- Admin passphrase comparison MUST use `crypto.timingSafeEqual` to prevent timing attacks
- All user-facing text is in Brazilian Portuguese (pt-BR)

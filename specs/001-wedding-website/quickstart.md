# Quickstart: Fabhia & Bruno Wedding Website

**Branch**: `001-wedding-website` | **Date**: 2026-04-26

## Prerequisites

- Node.js ≥ 20
- pnpm ≥ 9
- A Neon Postgres database (via Vercel Marketplace or neon.tech directly)
- A Vercel account (for deployment)

---

## Local Development Setup

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment variables

Create `.env.local` at the project root:

```env
# Neon PostgreSQL (from Vercel Marketplace or neon.tech)
DATABASE_URL="postgresql://user:password@ep-xxx.eu-central-1.aws.neon.tech/wedding?sslmode=require"

# Admin access
ADMIN_PASSPHRASE="choose-a-strong-passphrase"
ADMIN_SESSION_SECRET="a-random-32-char-secret-string"
```

### 3. Generate Prisma client and run migrations

```bash
pnpm prisma generate
pnpm prisma migrate dev --name init
```

### 4. Seed the gift list

```bash
pnpm prisma db seed
```

### 5. Start the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Verification Checklist

After setup, verify the following manually:

- [ ] Home page loads at `localhost:3000` with the Hero section visible
- [ ] Countdown timer updates every second
- [ ] Navigation bar smooth-scrolls to each section
- [ ] RSVP form submits successfully (check console + database)
- [ ] Gift list displays seeded gifts
- [ ] Marking a gift as claimed removes it from the list optimistically
- [ ] Admin page at `localhost:3000/admin` shows the passphrase form
- [ ] Correct passphrase shows RSVP table; wrong passphrase shows error
- [ ] All sections visible on 375px viewport (browser devtools responsive mode)

---

## Adding Couple Photos

Place static photos in `public/photos/`. Reference them in components as `/photos/filename.jpg`.

The photo carousel in the Our Story section reads from a static array in `lib/constants.ts`. Add photo paths there.

---

## Seeding Gift Data

Edit `prisma/seed.ts` to add real gift items before going live. Each gift requires:

```ts
{
  name: 'Jogo de Panelas Le Creuset',
  description: 'Conjunto premium de panelas em ferro fundido esmaltado',
  price: 1490.00,
  externalUrl: 'https://store.example.com/product',
  imageUrl: '/photos/gifts/panelas.jpg', // optional
  displayOrder: 1,
}
```

Re-run `pnpm prisma db seed` after editing.

---

## Deployment to Vercel

### First deploy

1. Push the branch to GitHub.
2. Import the repository in Vercel.
3. Add the Neon Postgres integration from the Vercel Marketplace.
4. Add environment variables in Vercel dashboard: `ADMIN_PASSPHRASE`, `ADMIN_SESSION_SECRET`.
5. Set the build command to: `prisma generate && prisma migrate deploy && next build`
6. Deploy.

### Subsequent deploys

Push to `main` triggers automatic re-deployment. Schema migrations run automatically via the build command.

---

## Running Tests (when implemented)

```bash
# Unit + integration tests
pnpm test

# Type checking
pnpm tsc --noEmit

# Lint
pnpm lint
```

---

## Useful Commands

```bash
# Open Prisma Studio (database GUI)
pnpm prisma studio

# Reset database (dev only)
pnpm prisma migrate reset

# Check bundle size
pnpm build && pnpm next analyze  # requires @next/bundle-analyzer
```

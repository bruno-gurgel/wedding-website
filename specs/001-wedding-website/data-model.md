# Data Model: Fabhia & Bruno Wedding Website

**Branch**: `001-wedding-website` | **Phase**: 1 | **Date**: 2026-04-26

## Entities

### RSVPResponse

Stores a single guest's confirmation response.

| Field | Type | Constraints | Notes |
|---|---|---|---|
| `id` | `String` | PK, `@default(cuid())` | Unique identifier |
| `guestName` | `String` | Required, max 200 chars | Guest's display name |
| `attending` | `Boolean` | Required | True = attending, False = cannot attend |
| `createdAt` | `DateTime` | `@default(now())` | Submission timestamp, UTC |

**Validation rules**:
- `guestName` MUST be non-empty and MUST be trimmed before storage.
- No uniqueness constraint on `guestName` — duplicate submissions are permitted.

**State transitions**: None (append-only; no editing or deletion by guests).

---

### Gift

Represents a single gift option in the curated gift list.

| Field | Type | Constraints | Notes |
|---|---|---|---|
| `id` | `String` | PK, `@default(cuid())` | Unique identifier |
| `name` | `String` | Required | Display name of the gift |
| `description` | `String` | Required | Short description shown on the card |
| `price` | `Decimal` | Required, precision 10,2 | Price in BRL |
| `externalUrl` | `String` | Required | Link to external store product page |
| `imageUrl` | `String?` | Optional | URL of product image (external or `/public`) |
| `displayOrder` | `Int` | Required, `@default(0)` | Controls card sort order |
| `isTaken` | `Boolean` | `@default(false)` | True when claimed by a guest |
| `takenAt` | `DateTime?` | Nullable | Timestamp when the gift was claimed |

**State transitions**:
```
available (isTaken: false) → taken (isTaken: true, takenAt: now())
```

**Concurrency**: The `isTaken` flag is updated atomically. If two guests claim simultaneously, the second update sees `isTaken: true` and returns a conflict response. No rollback of the first update occurs.

---

## Prisma Schema

```prisma
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["driverAdapters"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model RSVPResponse {
  id         String   @id @default(cuid())
  guestName  String
  attending  Boolean
  createdAt  DateTime @default(now())

  @@map("rsvp_responses")
}

model Gift {
  id           String    @id @default(cuid())
  name         String
  description  String
  price        Decimal   @db.Decimal(10, 2)
  externalUrl  String
  imageUrl     String?
  displayOrder Int       @default(0)
  isTaken      Boolean   @default(false)
  takenAt      DateTime?

  @@map("gifts")
}
```

---

## Seed Data Structure

The gift list is seeded via `prisma/seed.ts`. Gifts are ordered by `displayOrder`. The seed script is idempotent (uses `upsert` by `id`).

RSVP responses are not seeded — they are guest-generated only.

---

## Database Notes

- **Provider**: Neon (PostgreSQL), accessed via `@prisma/adapter-neon` + `@neondatabase/serverless`.
- **Migrations**: Managed by `prisma migrate deploy` on first deploy and on schema changes.
- **No soft deletes**: Gifts are never deleted; the taken state is toggled only from `false → true`.
- **No admin writes**: The admin view is read-only. No delete or edit functionality is required.

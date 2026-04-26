# Contract: Gifts API

**Route**: `app/api/gifts/[id]/route.ts`

---

## GET /api/gifts — List Available Gifts

**Note**: The gift list is loaded as part of the Server Component on the home page — not via this API. This endpoint is included for completeness and potential client-side revalidation.

**Purpose**: Return all gifts with their current `isTaken` state.

### Request

```
GET /api/gifts
```

### Response — Success

```
HTTP 200 OK
Content-Type: application/json
```

```json
{
  "gifts": [
    {
      "id": "clgift001",
      "name": "Jogo de Panelas Le Creuset",
      "description": "Conjunto premium de panelas em ferro fundido esmaltado",
      "price": "1490.00",
      "externalUrl": "https://example.com/panelas",
      "imageUrl": "/photos/gifts/panelas.jpg",
      "displayOrder": 1,
      "isTaken": false
    }
  ]
}
```

---

## PATCH /api/gifts/[id] — Claim a Gift

**Purpose**: Mark a specific gift as taken by a guest.

### Request

```
PATCH /api/gifts/:id
Content-Type: application/json
```

**Body**:
```json
{
  "action": "claim"
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `action` | `"claim"` | Yes | Only `"claim"` is supported at launch |

### Response — Success

```
HTTP 200 OK
Content-Type: application/json
```

```json
{
  "id": "clgift001",
  "isTaken": true,
  "takenAt": "2026-07-15T10:23:00.000Z"
}
```

### Response — Conflict (already taken)

```
HTTP 409 Conflict
Content-Type: application/json
```

```json
{
  "error": "Este presente já foi escolhido por outra pessoa.",
  "isTaken": true
}
```

### Response — Not Found

```
HTTP 404 Not Found
Content-Type: application/json
```

```json
{
  "error": "Gift not found"
}
```

### Response — Server Error

```
HTTP 500 Internal Server Error
Content-Type: application/json
```

```json
{
  "error": "Não foi possível registrar sua escolha. Tente novamente."
}
```

---

## Server Action: claimGift (alternative to PATCH route)

Used by the Gift card component for the optimistic update pattern.

```ts
// app/actions/gifts.ts
'use server'
export async function claimGift(giftId: string): Promise<{ ok: boolean; error?: string; isTaken?: boolean }>
```

**Conflict handling**: If `isTaken` is already `true` when the Server Action runs, return `{ ok: false, error: '...', isTaken: true }` so the client can roll back the optimistic state.

---

## Admin View: No Write Operations

The admin view at `/admin` is read-only. There are no endpoints for deleting gifts, unclaiming gifts, or editing gift details. Gift data is managed via the Prisma seed script or direct database access.

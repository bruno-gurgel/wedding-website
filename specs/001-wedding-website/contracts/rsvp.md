# Contract: RSVP API

**Route**: `app/api/rsvp/route.ts`

---

## POST /api/rsvp — Submit Guest RSVP

**Purpose**: Store a guest's attendance confirmation.

### Request

```
POST /api/rsvp
Content-Type: application/json
```

**Body**:
```json
{
  "guestName": "Maria Silva",
  "attending": true
}
```

| Field | Type | Required | Validation |
|---|---|---|---|
| `guestName` | `string` | Yes | Non-empty after trim, max 200 chars |
| `attending` | `boolean` | Yes | Must be a boolean |

### Response — Success

```
HTTP 201 Created
Content-Type: application/json
```

```json
{
  "id": "clxyz123",
  "guestName": "Maria Silva",
  "attending": true,
  "createdAt": "2026-07-01T18:00:00.000Z"
}
```

### Response — Validation Error

```
HTTP 400 Bad Request
Content-Type: application/json
```

```json
{
  "error": "guestName is required"
}
```

### Response — Server Error

```
HTTP 500 Internal Server Error
Content-Type: application/json
```

```json
{
  "error": "Failed to save RSVP. Please try again."
}
```

---

## GET /api/rsvp — List All Responses (Admin)

**Purpose**: Return all RSVP responses for the admin view.

**Authorization**: Requires the `admin_session` cookie to be present and valid. Returns `403` if not.

### Request

```
GET /api/rsvp
Cookie: admin_session=<token>
```

### Response — Success

```
HTTP 200 OK
Content-Type: application/json
```

```json
{
  "responses": [
    {
      "id": "clxyz123",
      "guestName": "Maria Silva",
      "attending": true,
      "createdAt": "2026-07-01T18:00:00.000Z"
    }
  ],
  "summary": {
    "total": 42,
    "attending": 38,
    "notAttending": 4
  }
}
```

### Response — Unauthorized

```
HTTP 403 Forbidden
Content-Type: application/json
```

```json
{
  "error": "Unauthorized"
}
```

---

## Server Action: submitRSVP (alternative to POST route)

Used by the RSVP form component directly. Same validation rules as POST /api/rsvp.

```ts
// app/actions/rsvp.ts
'use server'
export async function submitRSVP(formData: FormData): Promise<{ ok: boolean; error?: string }>
```

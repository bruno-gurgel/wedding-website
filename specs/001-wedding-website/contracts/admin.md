# Contract: Admin Authentication

**Route**: `app/api/admin/auth/route.ts` + `app/actions/admin.ts`

---

## POST /api/admin/auth — Verify Passphrase

**Purpose**: Check the submitted passphrase against the environment variable and set an `admin_session` cookie on success.

### Request

```
POST /api/admin/auth
Content-Type: application/json
```

**Body**:
```json
{
  "passphrase": "the-secret-phrase"
}
```

### Response — Success

```
HTTP 200 OK
Set-Cookie: admin_session=<signed-token>; HttpOnly; SameSite=Lax; Max-Age=86400; Path=/
Content-Type: application/json
```

```json
{ "ok": true }
```

**Cookie spec**:
| Property | Value |
|---|---|
| Name | `admin_session` |
| Value | HMAC-signed timestamp or opaque token |
| HttpOnly | Yes |
| SameSite | Lax |
| Max-Age | 86400 (24 hours) |
| Secure | Yes (production only) |

### Response — Unauthorized

```
HTTP 401 Unauthorized
Content-Type: application/json
```

```json
{ "error": "Incorrect passphrase" }
```

---

## GET /admin — Admin Page

**File**: `app/admin/page.tsx`

**Behavior**:
1. Server Component reads the `admin_session` cookie via `await cookies()`.
2. If cookie is absent or invalid: render the passphrase form (no redirect, no error exposed).
3. If cookie is valid: fetch all RSVP responses from the database and render the admin table.

**No separate logout endpoint is required** — the cookie expires automatically after 24 hours.

---

## Environment Variables

| Variable | Description | Required |
|---|---|---|
| `ADMIN_PASSPHRASE` | The hardcoded passphrase for admin access | Yes |
| `DATABASE_URL` | Neon PostgreSQL connection string | Yes |
| `ADMIN_SESSION_SECRET` | Secret for signing the session cookie | Yes |

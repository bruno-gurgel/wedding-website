import { createHmac, timingSafeEqual } from 'crypto'

const COOKIE_NAME = 'admin_session'
const MAX_AGE_MS = 24 * 60 * 60 * 1000

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret) throw new Error('ADMIN_SESSION_SECRET is not set')
  return secret
}

function sign(payload: string): string {
  const hmac = createHmac('sha256', getSecret())
  hmac.update(payload)
  return hmac.digest('hex')
}

function safeEqual(a: string, b: string): boolean {
  const ua = new TextEncoder().encode(a)
  const ub = new TextEncoder().encode(b)
  if (ua.length !== ub.length) return false
  return timingSafeEqual(ua, ub)
}

export function createSessionToken(): string {
  const ts = Date.now().toString()
  const sig = sign(ts)
  return `${ts}.${sig}`
}

export function verifySessionCookie(token: string): boolean {
  try {
    const dot = token.lastIndexOf('.')
    if (dot === -1) return false
    const ts = token.slice(0, dot)
    const sig = token.slice(dot + 1)
    const expected = sign(ts)
    if (!safeEqual(sig, expected)) return false
    return Date.now() - Number(ts) < MAX_AGE_MS
  } catch {
    return false
  }
}

export function safeStringEqual(a: string, b: string): boolean {
  return safeEqual(a, b)
}

export { COOKIE_NAME }

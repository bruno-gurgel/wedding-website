import { NextRequest, NextResponse } from 'next/server'
import { createSessionToken, COOKIE_NAME, safeStringEqual } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { passphrase?: unknown }
    const passphrase = typeof body.passphrase === 'string' ? body.passphrase : ''
    const expected = process.env.ADMIN_PASSPHRASE ?? ''

    if (!safeStringEqual(passphrase, expected)) {
      return NextResponse.json({ error: 'Incorrect passphrase' }, { status: 401 })
    }

    const res = NextResponse.json({ ok: true })
    res.cookies.set(COOKIE_NAME, createSessionToken(), {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
    })
    return res
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

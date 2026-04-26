'use server'

import { cookies } from 'next/headers'
import { createSessionToken, COOKIE_NAME, safeStringEqual } from '@/lib/auth'

export async function verifyPassphrase(
  _prev: { ok: boolean; error?: string } | null,
  formData: FormData,
): Promise<{ ok: boolean; error?: string }> {
  const passphrase = (formData.get('passphrase') as string | null) ?? ''
  const expected = process.env.ADMIN_PASSPHRASE ?? ''

  try {
    if (!safeStringEqual(passphrase, expected)) {
      return { ok: false, error: 'Senha incorreta. Tente novamente.' }
    }

    const cookieStore = await cookies()
    cookieStore.set(COOKIE_NAME, createSessionToken(), {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
    })

    return { ok: true }
  } catch {
    return { ok: false, error: 'Erro interno. Tente novamente.' }
  }
}

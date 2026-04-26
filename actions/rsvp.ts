'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function submitRSVP(
  _prev: { ok: boolean; error?: string } | null,
  formData: FormData,
): Promise<{ ok: boolean; error?: string }> {
  const guestName = (formData.get('guestName') as string | null)?.trim() ?? ''
  const attendingRaw = formData.get('attending')

  if (!guestName) {
    return { ok: false, error: 'Por favor, informe seu nome.' }
  }

  if (attendingRaw === null) {
    return { ok: false, error: 'Por favor, confirme se poderá comparecer.' }
  }

  const attending = attendingRaw === 'true'

  try {
    await db.rSVPResponse.create({
      data: { guestName, attending },
    })
    revalidatePath('/admin')
    return { ok: true }
  } catch {
    return { ok: false, error: 'Não foi possível registrar sua confirmação. Tente novamente.' }
  }
}

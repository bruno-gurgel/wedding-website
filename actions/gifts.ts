'use server'

import { db } from '@/lib/db'

export async function claimGift(
  giftId: string,
): Promise<{ ok: boolean; error?: string; isTaken?: boolean }> {
  try {
    await db.gift.update({
      where: { id: giftId, isTaken: false },
      data: { isTaken: true, takenAt: new Date() },
    })
    return { ok: true }
  } catch (e: unknown) {
    const code = (e as { code?: string })?.code
    // P2025 = record not found (isTaken: true already, or id doesn't exist)
    if (code === 'P2025') {
      return { ok: false, error: 'Este presente já foi escolhido por outra pessoa.', isTaken: true }
    }
    return { ok: false, error: 'Não foi possível registrar sua escolha. Tente novamente.' }
  }
}

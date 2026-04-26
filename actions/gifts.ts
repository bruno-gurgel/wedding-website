'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'

export async function addGift(
  _prev: { ok: boolean; error?: string } | null,
  formData: FormData,
): Promise<{ ok: boolean; error?: string }> {
  const name = (formData.get('name') as string)?.trim()
  const description = (formData.get('description') as string)?.trim()
  const priceRaw = (formData.get('price') as string)?.trim()
  const externalUrl = (formData.get('externalUrl') as string)?.trim()
  const displayOrderRaw = (formData.get('displayOrder') as string)?.trim()

  if (!name || !description || !priceRaw || !externalUrl) {
    return { ok: false, error: 'Todos os campos obrigatórios devem ser preenchidos.' }
  }

  const price = parseFloat(priceRaw.replace(',', '.'))
  if (isNaN(price) || price <= 0) {
    return { ok: false, error: 'Preço inválido.' }
  }

  const displayOrder = displayOrderRaw ? parseInt(displayOrderRaw, 10) : undefined

  try {
    const maxOrder = await db.gift.aggregate({ _max: { displayOrder: true } })
    await db.gift.create({
      data: {
        name,
        description,
        price,
        externalUrl,
        displayOrder: displayOrder ?? (maxOrder._max.displayOrder ?? 0) + 1,
      },
    })
    revalidatePath('/admin')
    revalidatePath('/')
    return { ok: true }
  } catch {
    return { ok: false, error: 'Não foi possível adicionar o presente. Tente novamente.' }
  }
}

export async function deleteGift(giftId: string): Promise<{ ok: boolean; error?: string }> {
  try {
    await db.gift.delete({ where: { id: giftId } })
    revalidatePath('/admin')
    revalidatePath('/')
    return { ok: true }
  } catch {
    return { ok: false, error: 'Não foi possível remover o presente.' }
  }
}

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

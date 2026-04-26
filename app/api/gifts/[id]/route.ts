import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params

  try {
    const body = await req.json() as { action?: unknown }
    if (body.action !== 'claim') {
      return NextResponse.json({ error: 'Only action "claim" is supported.' }, { status: 400 })
    }

    const gift = await db.gift.update({
      where: { id, isTaken: false },
      data: { isTaken: true, takenAt: new Date() },
    })
    return NextResponse.json({ id: gift.id, isTaken: gift.isTaken, takenAt: gift.takenAt })
  } catch (e: unknown) {
    const code = (e as { code?: string })?.code
    if (code === 'P2025') {
      return NextResponse.json(
        { error: 'Este presente já foi escolhido por outra pessoa.', isTaken: true },
        { status: 409 },
      )
    }
    return NextResponse.json(
      { error: 'Não foi possível registrar sua escolha. Tente novamente.' },
      { status: 500 },
    )
  }
}

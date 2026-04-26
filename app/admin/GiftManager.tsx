'use client'

import { useTransition } from 'react'
import { deleteGift } from '@/actions/gifts'
import { formatPrice } from '@/lib/utils'

export interface SerializedGift {
  id: string
  name: string
  description: string
  price: string
  externalUrl: string
  displayOrder: number
  isTaken: boolean
}

interface GiftManagerProps {
  gifts: SerializedGift[]
}

function DeleteButton({ giftId }: { giftId: string }) {
  const [pending, startTransition] = useTransition()

  return (
    <button
      disabled={pending}
      onClick={() => startTransition(async () => { await deleteGift(giftId) })}
      className="font-sans text-xs text-red-500 hover:text-red-700 disabled:opacity-40 transition-colors"
    >
      {pending ? 'Removendo...' : 'Remover'}
    </button>
  )
}

export function GiftManager({ gifts }: GiftManagerProps) {
  if (gifts.length === 0) {
    return (
      <p className="font-sans text-sm text-[--color-charcoal]/60">Nenhum presente cadastrado ainda.</p>
    )
  }

  const available = gifts.filter((g) => !g.isTaken).length

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-6 font-sans text-sm text-[--color-charcoal]/60">
        <span>Total: <strong className="text-[--color-charcoal]">{gifts.length}</strong></span>
        <span>Disponíveis: <strong className="text-[--color-green-deep]">{available}</strong></span>
        <span>Escolhidos: <strong className="text-[--color-charcoal]">{gifts.length - available}</strong></span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse font-sans text-sm">
          <thead>
            <tr className="border-b border-[--color-green-deep]/20">
              <th className="text-left py-3 pr-4 font-medium text-[--color-charcoal]/60 uppercase tracking-wider text-xs">Nome</th>
              <th className="text-left py-3 pr-4 font-medium text-[--color-charcoal]/60 uppercase tracking-wider text-xs">Preço</th>
              <th className="text-left py-3 pr-4 font-medium text-[--color-charcoal]/60 uppercase tracking-wider text-xs">Status</th>
              <th className="text-left py-3 font-medium text-[--color-charcoal]/60 uppercase tracking-wider text-xs">Ações</th>
            </tr>
          </thead>
          <tbody>
            {gifts.map((gift) => (
              <tr key={gift.id} className="border-b border-[--color-green-deep]/10 hover:bg-[--color-cream]/50">
                <td className="py-3 pr-4">
                  <p className="text-[--color-charcoal] font-medium">{gift.name}</p>
                  <p className="text-[--color-charcoal]/50 text-xs mt-0.5 line-clamp-1">{gift.description}</p>
                </td>
                <td className="py-3 pr-4 text-[--color-charcoal]/70 whitespace-nowrap">
                  {formatPrice(gift.price.toString())}
                </td>
                <td className="py-3 pr-4 whitespace-nowrap">
                  {gift.isTaken ? (
                    <span className="text-[--color-charcoal]/40 text-xs">Escolhido ✓</span>
                  ) : (
                    <span className="text-[--color-green-deep] text-xs">Disponível</span>
                  )}
                </td>
                <td className="py-3">
                  <DeleteButton giftId={gift.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

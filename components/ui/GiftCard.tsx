'use client'

import { useOptimistic, useTransition, useState } from 'react'
import { claimGift } from '@/actions/gifts'
import { formatPrice } from '@/lib/utils'
import type { Gift } from '@prisma/client'

interface GiftCardProps {
  gift: Gift
}

export function GiftCard({ gift }: GiftCardProps) {
  const [optimisticTaken, setOptimisticTaken] = useOptimistic(gift.isTaken)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  if (optimisticTaken) return null

  function handleClaim() {
    setError(null)
    startTransition(async () => {
      setOptimisticTaken(true)
      const result = await claimGift(gift.id)
      if (!result.ok) {
        setError(result.error ?? 'Erro ao escolher presente.')
      }
    })
  }

  return (
    <div
      data-testid="gift-card"
      className="bg-[--color-cream] p-6 flex flex-col gap-4 border border-[--color-green-deep]/10 hover:border-[--color-green-deep]/30 transition-colors"
    >
      <div className="flex flex-col gap-1">
        <h3 className="font-serif text-xl text-[--color-green-deep]">{gift.name}</h3>
        <p className="font-sans text-sm text-[--color-charcoal]/70 leading-relaxed">{gift.description}</p>
      </div>

      <div className="flex items-center justify-between mt-auto pt-2 border-t border-[--color-green-deep]/10">
        <span className="font-sans text-sm text-[--color-gold] font-medium">
          {formatPrice(gift.price.toString())}
        </span>
        <a
          href={gift.externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-sans text-xs uppercase tracking-widest text-[--color-green-deep]/60 hover:text-[--color-green-deep] transition-colors"
        >
          Ver na loja ↗
        </a>
      </div>

      {error && (
        <p className="font-sans text-xs text-red-600" role="alert">{error}</p>
      )}

      <button
        data-testid="gift-claim"
        onClick={handleClaim}
        disabled={isPending}
        className="w-full border border-[--color-green-deep] py-2 font-sans text-xs uppercase tracking-widest text-[--color-green-deep] transition-colors hover:bg-[--color-green-deep] hover:text-[--color-ivory] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? 'Registrando...' : 'Vou dar este presente'}
      </button>
    </div>
  )
}

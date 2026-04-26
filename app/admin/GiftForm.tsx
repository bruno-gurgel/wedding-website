'use client'

import { useActionState, useEffect, useRef } from 'react'
import { addGift } from '@/actions/gifts'

const initialState = null

export function GiftForm() {
  const [state, action, pending] = useActionState(addGift, initialState)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state?.ok) formRef.current?.reset()
  }, [state])

  return (
    <form ref={formRef} action={action} className="flex flex-col gap-4">
      {state?.error && (
        <p className="font-sans text-sm text-red-600" role="alert">{state.error}</p>
      )}
      {state?.ok && (
        <p className="font-sans text-sm text-[--color-green-deep]">Presente adicionado com sucesso.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="font-sans text-xs uppercase tracking-widest text-[--color-charcoal]/60">
            Nome <span className="text-red-500">*</span>
          </label>
          <input
            name="name"
            type="text"
            required
            placeholder="Ex: KitchenAid Artisan"
            className="border border-[--color-green-deep]/30 bg-transparent px-3 py-2 font-sans text-sm text-[--color-charcoal] placeholder:text-[--color-charcoal]/30 focus:outline-none focus:border-[--color-green-deep]"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-sans text-xs uppercase tracking-widest text-[--color-charcoal]/60">
            Preço (R$) <span className="text-red-500">*</span>
          </label>
          <input
            name="price"
            type="text"
            required
            placeholder="Ex: 2399,00"
            className="border border-[--color-green-deep]/30 bg-transparent px-3 py-2 font-sans text-sm text-[--color-charcoal] placeholder:text-[--color-charcoal]/30 focus:outline-none focus:border-[--color-green-deep]"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="font-sans text-xs uppercase tracking-widest text-[--color-charcoal]/60">
          Descrição <span className="text-red-500">*</span>
        </label>
        <textarea
          name="description"
          required
          rows={2}
          placeholder="Breve descrição do presente"
          className="border border-[--color-green-deep]/30 bg-transparent px-3 py-2 font-sans text-sm text-[--color-charcoal] placeholder:text-[--color-charcoal]/30 focus:outline-none focus:border-[--color-green-deep] resize-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="font-sans text-xs uppercase tracking-widest text-[--color-charcoal]/60">
            Link da loja <span className="text-red-500">*</span>
          </label>
          <input
            name="externalUrl"
            type="url"
            required
            placeholder="https://..."
            className="border border-[--color-green-deep]/30 bg-transparent px-3 py-2 font-sans text-sm text-[--color-charcoal] placeholder:text-[--color-charcoal]/30 focus:outline-none focus:border-[--color-green-deep]"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-sans text-xs uppercase tracking-widest text-[--color-charcoal]/60">
            Ordem de exibição
          </label>
          <input
            name="displayOrder"
            type="number"
            min="1"
            placeholder="Auto"
            className="border border-[--color-green-deep]/30 bg-transparent px-3 py-2 font-sans text-sm text-[--color-charcoal] placeholder:text-[--color-charcoal]/30 focus:outline-none focus:border-[--color-green-deep]"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="self-start border border-[--color-green-deep] px-6 py-2 font-sans text-xs uppercase tracking-widest text-[--color-green-deep] transition-colors hover:bg-[--color-green-deep] hover:text-[--color-ivory] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {pending ? 'Adicionando...' : 'Adicionar presente'}
      </button>
    </form>
  )
}

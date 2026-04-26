'use client'

import { useActionState } from 'react'
import { submitRSVP } from '@/actions/rsvp'

const initialState = null

export function RSVPForm() {
  const [state, action, pending] = useActionState(submitRSVP, initialState)

  if (state?.ok) {
    return (
      <div
        data-testid="rsvp-confirmation"
        className="text-center py-12"
      >
        <p className="font-serif text-3xl text-[--color-green-deep] mb-3">
          Confirmação recebida!
        </p>
        <p className="font-sans text-[--color-charcoal]/70">
          Ficamos muito felizes. Até lá!
        </p>
      </div>
    )
  }

  return (
    <form action={action} className="flex flex-col gap-6 max-w-md mx-auto">
      <div className="flex flex-col gap-2">
        <label htmlFor="guestName" className="font-sans text-sm uppercase tracking-widest text-[--color-green-deep]">
          Seu nome
        </label>
        <input
          id="guestName"
          name="guestName"
          type="text"
          data-testid="rsvp-name"
          required
          autoComplete="name"
          placeholder="Nome completo"
          className="border border-[--color-green-deep]/30 rounded-none bg-transparent px-4 py-3 font-sans text-[--color-charcoal] placeholder:text-[--color-charcoal]/40 focus:outline-none focus:border-[--color-green-deep] transition-colors"
        />
      </div>

      <fieldset className="flex flex-col gap-3">
        <legend className="font-sans text-sm uppercase tracking-widest text-[--color-green-deep] mb-1">
          Presença confirmada?
        </legend>
        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="radio"
            name="attending"
            value="true"
            data-testid="rsvp-attending-yes"
            className="accent-[--color-green-deep] w-4 h-4"
          />
          <span className="font-sans text-[--color-charcoal] group-hover:text-[--color-green-deep] transition-colors">
            Sim, estarei lá! 🎉
          </span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="radio"
            name="attending"
            value="false"
            data-testid="rsvp-attending-no"
            className="accent-[--color-green-deep] w-4 h-4"
          />
          <span className="font-sans text-[--color-charcoal] group-hover:text-[--color-green-deep] transition-colors">
            Infelizmente não poderei comparecer
          </span>
        </label>
      </fieldset>

      {state?.error && (
        <p data-testid="rsvp-error" className="text-red-600 font-sans text-sm" role="alert">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        data-testid="rsvp-submit"
        disabled={pending}
        className="mt-2 border border-[--color-green-deep] bg-transparent px-8 py-3 font-sans text-sm uppercase tracking-widest text-[--color-green-deep] transition-colors hover:bg-[--color-green-deep] hover:text-[--color-ivory] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {pending ? 'Enviando...' : 'Confirmar presença'}
      </button>
    </form>
  )
}

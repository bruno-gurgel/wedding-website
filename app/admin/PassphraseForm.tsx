'use client'

import { useActionState } from 'react'
import { verifyPassphrase } from '@/actions/admin'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function AdminPassphraseForm() {
  const [state, action, pending] = useActionState(verifyPassphrase, null)
  const router = useRouter()

  useEffect(() => {
    if (state?.ok) {
      router.refresh()
    }
  }, [state, router])

  return (
    <form action={action} className="flex flex-col gap-4">
      <input
        type="password"
        name="passphrase"
        data-testid="admin-passphrase"
        placeholder="Senha de acesso"
        required
        className="border border-[--color-green-deep]/30 bg-transparent px-4 py-3 font-sans text-[--color-charcoal] placeholder:text-[--color-charcoal]/40 focus:outline-none focus:border-[--color-green-deep] transition-colors"
      />
      {state?.error && (
        <p data-testid="admin-error" className="text-red-600 font-sans text-sm" role="alert">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        data-testid="admin-submit"
        disabled={pending}
        className="border border-[--color-green-deep] py-3 font-sans text-sm uppercase tracking-widest text-[--color-green-deep] transition-colors hover:bg-[--color-green-deep] hover:text-[--color-ivory] disabled:opacity-50"
      >
        {pending ? 'Verificando...' : 'Entrar'}
      </button>
    </form>
  )
}

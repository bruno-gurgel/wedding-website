import { cookies } from 'next/headers'
import { verifySessionCookie } from '@/lib/auth'
import { db } from '@/lib/db'
import { AdminPassphraseForm } from './PassphraseForm'

async function getRSVPs() {
  return db.rSVPResponse.findMany({ orderBy: { createdAt: 'desc' } })
}

export default async function AdminPage() {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')?.value
  const isAuthenticated = !!session && verifySessionCookie(session)

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[--color-ivory] flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <h1 className="font-serif text-3xl text-[--color-green-deep] mb-8 text-center">
            Área Administrativa
          </h1>
          <AdminPassphraseForm />
        </div>
      </main>
    )
  }

  const responses = await getRSVPs()
  const attending = responses.filter((r) => r.attending).length

  return (
    <main className="min-h-screen bg-[--color-ivory] px-6 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-serif text-4xl text-[--color-green-deep] mb-2">
          Confirmações de Presença
        </h1>
        <div className="flex gap-6 font-sans text-sm text-[--color-charcoal]/60 mb-10">
          <span>Total: <strong className="text-[--color-charcoal]">{responses.length}</strong></span>
          <span>Confirmados: <strong className="text-[--color-green-deep]">{attending}</strong></span>
          <span>Não vêm: <strong className="text-red-500">{responses.length - attending}</strong></span>
        </div>

        {responses.length === 0 ? (
          <p className="font-sans text-[--color-charcoal]/60">Nenhuma confirmação recebida ainda.</p>
        ) : (
          <table data-testid="rsvp-table" className="w-full border-collapse font-sans text-sm">
            <thead>
              <tr className="border-b border-[--color-green-deep]/20">
                <th className="text-left py-3 pr-6 font-medium text-[--color-charcoal]/60 uppercase tracking-wider text-xs">Nome</th>
                <th className="text-left py-3 pr-6 font-medium text-[--color-charcoal]/60 uppercase tracking-wider text-xs">Presença</th>
                <th className="text-left py-3 font-medium text-[--color-charcoal]/60 uppercase tracking-wider text-xs">Data</th>
              </tr>
            </thead>
            <tbody>
              {responses.map((r) => (
                <tr key={r.id} className="border-b border-[--color-green-deep]/10 hover:bg-[--color-cream]/50">
                  <td className="py-3 pr-6 text-[--color-charcoal]">{r.guestName}</td>
                  <td className="py-3 pr-6">
                    {r.attending ? (
                      <span className="text-[--color-green-deep] font-medium">Sim ✓</span>
                    ) : (
                      <span className="text-red-500">Não</span>
                    )}
                  </td>
                  <td className="py-3 text-[--color-charcoal]/50">
                    {r.createdAt.toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  )
}

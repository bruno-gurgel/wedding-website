import { SectionReveal } from '@/components/animations/SectionReveal'
import { RSVPForm } from '@/components/ui/RSVPForm'

export function RSVPSection() {
  return (
    <section id="confirmacao" className="py-32 px-6 bg-[--color-cream]">
      <SectionReveal>
      <div className="max-w-2xl mx-auto text-center">
        <p className="font-sans text-xs uppercase tracking-[0.3em] text-[--color-gold] mb-4">
          Confirmação de presença
        </p>
        <h2 className="font-serif text-5xl md:text-6xl text-[--color-green-deep] mb-4">
          Você vai?
        </h2>
        <p className="font-sans text-[--color-charcoal]/70 mb-12 max-w-sm mx-auto leading-relaxed">
          Confirme sua presença até <strong>1º de agosto de 2026</strong> para que possamos
          preparar tudo com carinho para você.
        </p>
        <RSVPForm />
      </div>
      </SectionReveal>
    </section>
  )
}

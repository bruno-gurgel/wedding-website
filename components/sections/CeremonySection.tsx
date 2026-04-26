import { SectionReveal } from '@/components/animations/SectionReveal'
import { VENUE } from '@/lib/constants'

export function CeremonySection() {
  return (
    <section id="cerimonia" className="py-32 px-6 bg-[--color-cream]">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <SectionReveal>
          <div className="flex flex-col gap-8">
            <div>
              <p className="font-sans text-xs uppercase tracking-[0.3em] text-[--color-gold] mb-4">
                Cerimônia &amp; recepção
              </p>
              <h2 className="font-serif text-5xl md:text-6xl text-[--color-green-deep] mb-6">
                O grande dia
              </h2>
            </div>

            <dl className="flex flex-col gap-6">
              <div>
                <dt className="font-sans text-xs uppercase tracking-widest text-[--color-charcoal]/50 mb-1">Data</dt>
                <dd className="font-serif text-2xl text-[--color-green-deep]">22 de agosto de 2026</dd>
              </div>
              <div>
                <dt className="font-sans text-xs uppercase tracking-widest text-[--color-charcoal]/50 mb-1">Horário</dt>
                <dd className="font-serif text-2xl text-[--color-green-deep]">15h30 — pontualmente</dd>
              </div>
              <div>
                <dt className="font-sans text-xs uppercase tracking-widest text-[--color-charcoal]/50 mb-1">Local</dt>
                <dd className="font-serif text-2xl text-[--color-green-deep]">{VENUE.name}</dd>
                <dd className="font-sans text-[--color-charcoal]/70 mt-1">{VENUE.address}</dd>
              </div>
            </dl>

            <div className="flex flex-col gap-3 p-6 border border-[--color-green-deep]/15 bg-[--color-ivory]">
              <p className="font-sans text-sm text-[--color-charcoal]/70 leading-relaxed">
                🌿 A cerimônia e a recepção acontecem no mesmo local — não será necessário
                se deslocar entre os momentos.
              </p>
              <p className="font-sans text-sm text-[--color-charcoal]/70 leading-relaxed">
                🚗 Estacionamento disponível no local para todos os convidados.
              </p>
              <p className="font-sans text-sm text-[--color-charcoal]/70 leading-relaxed">
                ⏰ A cerimônia iniciará pontualmente às 15h30. Por favor, chegue com
                alguns minutos de antecedência.
              </p>
            </div>
          </div>
        </SectionReveal>

        <SectionReveal delay={0.15}>
          <div className="w-full aspect-square overflow-hidden">
            <iframe
              src={VENUE.mapsEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Localização: Horto Brasília Convention"
              className="w-full h-full"
            />
          </div>
        </SectionReveal>
      </div>
    </section>
  )
}

import { SectionReveal } from '@/components/animations/SectionReveal'
import { PhotoCarousel } from '@/components/ui/PhotoCarousel'
import { STORY_PHOTOS } from '@/lib/constants'

export function OurStorySection() {
  return (
    <section id="nossa-historia" className="py-32 px-6 bg-[--color-ivory]">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <SectionReveal>
          <div className="flex flex-col gap-8">
            <div>
              <p className="font-sans text-xs uppercase tracking-[0.3em] text-[--color-gold] mb-4">
                Nossa história
              </p>
              <h2 className="font-serif text-5xl md:text-6xl text-[--color-green-deep] mb-6">
                8 anos, uma vida
              </h2>
            </div>

            <div className="flex flex-col gap-5 font-sans text-[--color-charcoal]/80 leading-relaxed">
              <p>
                Tudo começou com um encontro que nenhum dos dois esperava. Em oito anos juntos,
                construímos uma história de viagens memoráveis, aventuras inesperadas e um amor
                que só cresceu com o tempo.
              </p>
              <p>
                Reformamos nosso apartamento tijolo por tijolo, transformando um espaço em um lar —
                nosso lar. Ali, fomos joined por Sirius e Tokyo, nossos dois companheiros de quatro
                patas que enchem de vida cada canto da casa.
              </p>
              <p>
                Agora, chegou a hora de tornar oficial o que já era certo há muito tempo.
                Queremos celebrar com cada pessoa que fez parte dessa história.
              </p>
            </div>

            <div className="flex gap-8 pt-4 border-t border-[--color-green-deep]/10">
              <div>
                <p className="font-serif text-4xl text-[--color-green-deep]">8</p>
                <p className="font-sans text-xs uppercase tracking-widest text-[--color-charcoal]/50 mt-1">anos juntos</p>
              </div>
              <div>
                <p className="font-serif text-4xl text-[--color-green-deep]">2</p>
                <p className="font-sans text-xs uppercase tracking-widest text-[--color-charcoal]/50 mt-1">pets amados</p>
              </div>
              <div>
                <p className="font-serif text-4xl text-[--color-green-deep]">∞</p>
                <p className="font-sans text-xs uppercase tracking-widest text-[--color-charcoal]/50 mt-1">memórias</p>
              </div>
            </div>
          </div>
        </SectionReveal>

        <SectionReveal delay={0.15}>
          <PhotoCarousel photos={STORY_PHOTOS} />
        </SectionReveal>
      </div>
    </section>
  )
}

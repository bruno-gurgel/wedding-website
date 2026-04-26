import { SectionReveal } from '@/components/animations/SectionReveal'
import { ColorSwatch } from '@/components/ui/ColorSwatch'
import { dressCodeSwatches } from '@/lib/tokens'

export function DressCodeSection() {
  return (
    <section id="dress-code" className="py-32 px-6 bg-[--color-green-deep]">
      <div className="max-w-4xl mx-auto text-center">
        <SectionReveal>
          <p className="font-sans text-xs uppercase tracking-[0.3em] text-[--color-ivory]/50 mb-4">
            Dress code
          </p>
          <h2 className="font-serif text-5xl md:text-6xl text-[--color-ivory] mb-6">
            Venha à vontade
          </h2>
          <p className="font-sans text-[--color-ivory]/70 max-w-lg mx-auto leading-relaxed mb-12">
            A cerimônia será realizada em um espaço ao ar livre, no jardim. Pedimos
            trajes elegantes e confortáveis — tecidos leves são muito bem-vindos.
          </p>
        </SectionReveal>

        <SectionReveal delay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 text-left">
            <div className="border border-[--color-ivory]/15 p-6">
              <p className="font-serif text-xl text-[--color-ivory] mb-2">✓ Recomendamos</p>
              <ul className="font-sans text-sm text-[--color-ivory]/70 leading-relaxed flex flex-col gap-1">
                <li>Vestidos e ternos em cores claras</li>
                <li>Tecidos como linho, seda ou viscose</li>
                <li>Calçados confortáveis para grama</li>
                <li>Cores terrosas, neutras ou pastéis</li>
              </ul>
            </div>
            <div className="border border-[--color-ivory]/15 p-6">
              <p className="font-serif text-xl text-[--color-ivory] mb-2">✗ Evite</p>
              <ul className="font-sans text-sm text-[--color-ivory]/70 leading-relaxed flex flex-col gap-1">
                <li>Branco ou off-white (noiva)</li>
                <li>Preto fechado</li>
                <li>Salto agulha muito fino</li>
                <li>Trajes informais ou esportivos</li>
              </ul>
            </div>
            <div className="border border-[--color-ivory]/15 p-6">
              <p className="font-serif text-xl text-[--color-ivory] mb-2">Paleta sugerida</p>
              <p className="font-sans text-sm text-[--color-ivory]/70 leading-relaxed mb-6">
                Tons que harmonizam com o ambiente e a decoração do dia.
              </p>
              <ColorSwatch swatches={dressCodeSwatches} />
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  )
}

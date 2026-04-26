import Image from 'next/image'
import { Countdown } from '@/components/ui/Countdown'
import { HeroParallax } from '@/components/animations/HeroParallax'

export function HeroSection() {
  return (
    <section id="inicio" className="relative min-h-screen flex items-center justify-center bg-[--color-green-deep]">
      {/* Background hero image — replace /photos/hero.jpg with real photo */}
      <div className="absolute inset-0">
        <Image
          src="/photos/hero.jpg"
          alt="Fabhia e Bruno"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-[--color-green-deep]/40" />
      </div>

      <HeroParallax>
        <div className="relative z-10 text-center px-6 py-32">
          <p
            data-hero-animate
            className="font-sans text-xs uppercase tracking-[0.4em] text-[--color-ivory]/60 mb-6"
          >
            22 de agosto de 2026
          </p>

          <h1
            data-hero-animate
            className="font-serif text-7xl md:text-9xl lg:text-[10rem] text-[--color-ivory] leading-none mb-2"
          >
            Fabhia
          </h1>
          <p
            data-hero-animate
            className="font-sans text-xs uppercase tracking-[0.6em] text-[--color-ivory]/60 my-4"
          >
            &amp;
          </p>
          <h1
            data-hero-animate
            className="font-serif text-7xl md:text-9xl lg:text-[10rem] text-[--color-ivory] leading-none mb-12"
          >
            Bruno
          </h1>

          <div data-hero-animate className="mb-16">
            <p className="font-sans text-xs uppercase tracking-[0.3em] text-[--color-ivory]/50 mb-6">
              Faltam
            </p>
            <Countdown />
          </div>

          <p
            data-hero-animate
            className="font-sans text-sm text-[--color-ivory]/60 tracking-wider"
          >
            Horto Brasília Convention — Jardim Botânico, Brasília
          </p>
        </div>
      </HeroParallax>
    </section>
  )
}

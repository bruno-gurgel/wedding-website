'use client'

import { useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'motion/react'

interface PhotoCarouselProps {
  photos: readonly string[]
}

export function PhotoCarousel({ photos }: PhotoCarouselProps) {
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(1)

  function go(next: number) {
    setDirection(next > index ? 1 : -1)
    setIndex(next)
  }
  function prev() { go((index - 1 + photos.length) % photos.length) }
  function next() { go((index + 1) % photos.length) }

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit:   (d: number) => ({ x: d > 0 ? '-100%' : '100%', opacity: 0 }),
  }

  return (
    <div className="relative aspect-[4/5] w-full overflow-hidden bg-[--color-cream]">
      <AnimatePresence custom={direction} initial={false} mode="popLayout">
        <motion.div
          key={photos[index]}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={photos[index] ?? '/photos/couple-1.jpg'}
            alt={`Foto ${index + 1} de Fabhia e Bruno`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>

      <button
        onClick={prev}
        aria-label="Foto anterior"
        className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-[--color-ivory]/80 hover:bg-[--color-ivory] transition-colors"
      >
        ←
      </button>
      <button
        onClick={next}
        aria-label="Próxima foto"
        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-[--color-ivory]/80 hover:bg-[--color-ivory] transition-colors"
      >
        →
      </button>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {photos.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            aria-label={`Ir para foto ${i + 1}`}
            className={`w-1.5 h-1.5 rounded-full transition-colors ${i === index ? 'bg-[--color-ivory]' : 'bg-[--color-ivory]/40'}`}
          />
        ))}
      </div>
    </div>
  )
}

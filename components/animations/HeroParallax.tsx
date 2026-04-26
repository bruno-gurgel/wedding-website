'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { ReactNode } from 'react'

gsap.registerPlugin(ScrollTrigger)

interface HeroParallaxProps {
  children: ReactNode
}

export function HeroParallax({ children }: HeroParallaxProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (!containerRef.current || !bgRef.current || !contentRef.current) return

      // Cinematic entrance — stagger text children
      const textEls = contentRef.current.querySelectorAll('[data-hero-animate]')
      gsap.fromTo(
        textEls,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1.4,
          stagger: 0.18,
          ease: 'power3.out',
          delay: 0.3,
        },
      )

      // Parallax background on scroll
      gsap.to(bgRef.current, {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })

      // Fade content out as user scrolls past hero
      gsap.to(contentRef.current, {
        opacity: 0,
        y: -40,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: '60% top',
          end: 'bottom top',
          scrub: true,
        },
      })
    },
    { scope: containerRef },
  )

  return (
    <div ref={containerRef} className="relative overflow-hidden">
      <div
        ref={bgRef}
        className="absolute inset-0 scale-110"
        aria-hidden="true"
      />
      <div ref={contentRef} className="relative z-10">
        {children}
      </div>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { NAV_ITEMS, SECTION_IDS } from '@/lib/constants'
import { cn } from '@/lib/utils'

export function Navigation() {
  const [activeId, setActiveId] = useState<string>('')
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    const sectionEls = SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[]

    sectionEls.forEach((el) => {
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveId(el.id)
        },
        { threshold: 0.4 },
      )
      obs.observe(el)
      observers.push(obs)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [])

  function scrollTo(anchor: string) {
    const id = anchor.replace('#', '')
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-16',
        scrolled
          ? 'bg-[--color-ivory]/95 backdrop-blur-sm border-b border-[--color-green-deep]/10'
          : 'bg-transparent',
      )}
    >
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-6">
        <a
          href="#inicio"
          onClick={(e) => { e.preventDefault(); scrollTo('#inicio') }}
          className="font-serif text-lg text-[--color-green-deep]"
        >
          F &amp; B
        </a>

        <ul className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map(({ label, anchor }) => {
            const id = anchor.replace('#', '')
            const isActive = activeId === id
            return (
              <li key={anchor}>
                <a
                  href={anchor}
                  onClick={(e) => { e.preventDefault(); scrollTo(anchor) }}
                  className={cn(
                    'font-sans text-xs uppercase tracking-widest transition-colors',
                    isActive
                      ? 'text-[--color-green-deep]'
                      : scrolled
                        ? 'text-[--color-charcoal]/60 hover:text-[--color-green-deep]'
                        : 'text-[--color-ivory]/70 hover:text-[--color-ivory]',
                  )}
                >
                  {label}
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}

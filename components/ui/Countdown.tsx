'use client'

import { useEffect, useState } from 'react'
import { WEDDING_DATE } from '@/lib/constants'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function getTimeLeft(): TimeLeft {
  const diff = Math.max(0, WEDDING_DATE.getTime() - Date.now())
  return {
    days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours:   Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

function pad(n: number) {
  return String(n).padStart(2, '0')
}

export function Countdown() {
  const [time, setTime] = useState<TimeLeft | null>(null)

  useEffect(() => {
    const tick = () => setTime(getTimeLeft())
    const id = setInterval(tick, 1000)
    requestAnimationFrame(tick)
    return () => clearInterval(id)
  }, [])

  if (!time) return null

  const units = [
    { value: time.days,    label: 'dias' },
    { value: time.hours,   label: 'horas' },
    { value: time.minutes, label: 'min' },
    { value: time.seconds, label: 'seg' },
  ]

  return (
    <div className="flex gap-6 md:gap-10 justify-center">
      {units.map(({ value, label }) => (
        <div key={label} className="flex flex-col items-center gap-1">
          <span className="font-serif text-5xl md:text-7xl text-[--color-ivory] tabular-nums leading-none">
            {pad(value)}
          </span>
          <span className="font-sans text-xs uppercase tracking-[0.2em] text-[--color-ivory]/60">
            {label}
          </span>
        </div>
      ))}
    </div>
  )
}

import type { Metadata } from 'next'
import { Cormorant_Garamond, Jost } from 'next/font/google'
import '@/styles/globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const jost = Jost({
  subsets: ['latin'],
  variable: '--font-jost',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Fabhia & Bruno — 22.08.2026',
  description: 'Celebre conosco o casamento de Fabhia e Bruno em 22 de agosto de 2026, em Brasília.',
  openGraph: {
    title: 'Fabhia & Bruno — 22.08.2026',
    description: 'Celebre conosco o casamento de Fabhia e Bruno em 22 de agosto de 2026, em Brasília.',
    locale: 'pt_BR',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      className={`${cormorant.variable} ${jost.variable}`}
    >
      <body>{children}</body>
    </html>
  )
}

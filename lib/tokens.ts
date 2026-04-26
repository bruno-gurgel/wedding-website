export const colors = {
  ivory:     '#F8F4EF',
  greenDeep: '#2A4A35',
  blush:     '#D4A99A',
  gold:      '#7A5E12',
  cream:     '#EDE8E0',
  charcoal:  '#2C2C2C',
} as const

export const animation = {
  durationStandard:  300,
  durationCinematic: 800,
  easingOut:   [0.16, 1, 0.3, 1] as const,
  easingInOut: [0.87, 0, 0.13, 1] as const,
} as const

export const dressCodeSwatches = [
  { name: 'Marfim',     hex: '#F8F4EF' },
  { name: 'Sage',       hex: '#8BAF8E' },
  { name: 'Blush',      hex: '#D4A99A' },
  { name: 'Champagne',  hex: '#B8974A' },
  { name: 'Areia',      hex: '#C8B99A' },
] as const

export const WEDDING_DATE = new Date('2026-08-22T15:30:00-03:00')

export const VENUE = {
  name:    'Horto Brasília Convention',
  address: 'Jardim Botânico, Brasília – DF',
  mapsEmbedUrl:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3838.905!2d-47.845!3d-15.865!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zSG9ydG8gQnJhc8OtbGlh!5e0!3m2!1spt-BR!2sbr!4v1234567890',
} as const

export const NAV_ITEMS = [
  { label: 'Início',         anchor: '#inicio' },
  { label: 'Nossa História', anchor: '#nossa-historia' },
  { label: 'Cerimônia',      anchor: '#cerimonia' },
  { label: 'Confirmação',    anchor: '#confirmacao' },
  { label: 'Presentes',      anchor: '#presentes' },
  { label: 'Dress Code',     anchor: '#dress-code' },
] as const

export const SECTION_IDS = [
  'inicio',
  'nossa-historia',
  'cerimonia',
  'confirmacao',
  'presentes',
  'dress-code',
] as const

/** Static photo paths — place files in public/photos/ */
export const STORY_PHOTOS = [
  '/photos/couple-1.jpg',
  '/photos/couple-2.jpg',
  '/photos/couple-3.jpg',
  '/photos/couple-4.jpg',
  '/photos/couple-5.jpg',
] as const

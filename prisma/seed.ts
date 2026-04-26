import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { neonConfig } from '@neondatabase/serverless'
import ws from 'ws'

neonConfig.webSocketConstructor = ws

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

const gifts = [
  {
    id: 'gift-001',
    name: 'Jogo de Panelas Le Creuset',
    description: 'Conjunto premium de panelas em ferro fundido esmaltado, ideal para cozinhar com estilo e durabilidade.',
    price: 1490.0,
    externalUrl: 'https://www.lecreuset.com.br',
    displayOrder: 1,
  },
  {
    id: 'gift-002',
    name: 'KitchenAid Artisan',
    description: 'Batedeira planetária 4,7L em cores exclusivas — o sonho de qualquer cozinha.',
    price: 2399.0,
    externalUrl: 'https://www.kitchenaid.com.br',
    displayOrder: 2,
  },
  {
    id: 'gift-003',
    name: 'Jogo de Cama King Karsten',
    description: 'Lençol, fronhas e edredom 400 fios 100% algodão egípcio. Conforto de hotel em casa.',
    price: 890.0,
    externalUrl: 'https://www.karsten.com.br',
    displayOrder: 3,
  },
  {
    id: 'gift-004',
    name: 'Adega de Vinho Tramontina',
    description: 'Adega climatizada para 16 garrafas com iluminação LED e controle de temperatura.',
    price: 1299.0,
    externalUrl: 'https://www.tramontina.com.br',
    displayOrder: 4,
  },
  {
    id: 'gift-005',
    name: 'Aparelho de Jantar Oxford 42 peças',
    description: 'Louça porcelana branca com borda dourada. Elegante para o dia a dia e ocasiões especiais.',
    price: 750.0,
    externalUrl: 'https://www.oxfordporcelanas.com.br',
    displayOrder: 5,
  },
  {
    id: 'gift-006',
    name: 'Cafeteira Nespresso Vertuo Next',
    description: 'Cafeteira de cápsulas com tecnologia Centrifusion para um café perfeito em segundos.',
    price: 699.0,
    externalUrl: 'https://www.nespresso.com/br',
    displayOrder: 6,
  },
  {
    id: 'gift-007',
    name: 'Aspirador Robô Roomba',
    description: 'Robô aspirador com mapeamento inteligente — para manter a casa limpa sem esforço.',
    price: 2199.0,
    externalUrl: 'https://www.irobot.com.br',
    displayOrder: 7,
  },
  {
    id: 'gift-008',
    name: 'Churrasqueira a Carvão Weber',
    description: 'Churrasqueira esférica premium 57cm, ideal para churrascadas com amigos e família.',
    price: 1599.0,
    externalUrl: 'https://www.weber.com/BR',
    displayOrder: 8,
  },
  {
    id: 'gift-009',
    name: 'Jogo de Toalhas de Banho Buddemeyer',
    description: 'Kit com 8 peças em algodão egípcio 560g/m² — maciez e absorção excepcionais.',
    price: 480.0,
    externalUrl: 'https://www.buddemeyer.com.br',
    displayOrder: 9,
  },
  {
    id: 'gift-010',
    name: 'Air Fryer Philips Airfryer XXL',
    description: 'Fritadeira sem óleo 7,2L com tecnologia TurboStar para resultados crocantes e saudáveis.',
    price: 899.0,
    externalUrl: 'https://www.philips.com.br',
    displayOrder: 10,
  },
  {
    id: 'gift-011',
    name: 'Conjunto de Facas Wüsthof',
    description: 'Bloco com 7 facas forjadas em aço inox alemão — precisão e equilíbrio profissional.',
    price: 1890.0,
    externalUrl: 'https://www.wusthof.com',
    displayOrder: 11,
  },
  {
    id: 'gift-012',
    name: 'Cristaleira Bohemia 12 taças',
    description: 'Taças de cristal para vinho tinto, branco e champanhe — para brindar aos momentos especiais.',
    price: 420.0,
    externalUrl: 'https://www.bohemia.com.br',
    displayOrder: 12,
  },
]

async function main() {
  console.log('Seeding gift list...')
  for (const gift of gifts) {
    await prisma.gift.upsert({
      where: { id: gift.id },
      update: {},
      create: gift,
    })
  }
  console.log(`Seeded ${gifts.length} gifts.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

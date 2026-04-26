import { db } from '@/lib/db'
import { GiftCard } from '@/components/ui/GiftCard'

async function getAvailableGifts() {
  try {
    const gifts = await db.gift.findMany({
      where: { isTaken: false },
      orderBy: { displayOrder: 'asc' },
    })
    return gifts.map((g) => ({
      id: g.id,
      name: g.name,
      description: g.description,
      price: g.price.toString(),
      externalUrl: g.externalUrl,
      isTaken: g.isTaken,
    }))
  } catch {
    return null
  }
}

export async function GiftListSection() {
  const gifts = await getAvailableGifts()

  return (
    <section id="presentes" className="py-32 px-6 bg-[--color-ivory]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="font-sans text-xs uppercase tracking-[0.3em] text-[--color-gold] mb-4">
            Lista de presentes
          </p>
          <h2 className="font-serif text-5xl md:text-6xl text-[--color-green-deep] mb-4">
            Presentes
          </h2>
          <p className="font-sans text-[--color-charcoal]/70 max-w-md mx-auto leading-relaxed">
            Se desejar nos presentear, escolha um item da lista abaixo e acesse
            a loja para adquiri-lo. Quando um presente for escolhido, ele sairá
            automaticamente da lista.
          </p>
        </div>

        {gifts === null ? (
          <p className="text-center font-sans text-[--color-charcoal]/60">
            Não foi possível carregar a lista de presentes. Tente novamente mais tarde.
          </p>
        ) : gifts.length === 0 ? (
          <div className="text-center py-12">
            <p className="font-serif text-3xl text-[--color-green-deep] mb-3">
              Todos os presentes já foram escolhidos! 🎉
            </p>
            <p className="font-sans text-[--color-charcoal]/60">
              Que alegria! Obrigado pelo carinho de todos.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gifts.map((gift) => (
              <GiftCard key={gift.id} gift={gift} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

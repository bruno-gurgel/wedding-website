import { Navigation } from '@/components/ui/Navigation'
import { HeroSection } from '@/components/sections/HeroSection'
import { OurStorySection } from '@/components/sections/OurStorySection'
import { CeremonySection } from '@/components/sections/CeremonySection'
import { RSVPSection } from '@/components/sections/RSVPSection'
import { GiftListSection } from '@/components/sections/GiftListSection'
import { DressCodeSection } from '@/components/sections/DressCodeSection'

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <HeroSection />
        <OurStorySection />
        <CeremonySection />
        <RSVPSection />
        <GiftListSection />
        <DressCodeSection />
      </main>
    </>
  )
}

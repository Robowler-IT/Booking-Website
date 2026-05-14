import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/landing/HeroSection'
import AboutSection from '@/components/landing/AboutSection'
import GameModesSection from '@/components/landing/GameModesSection'
import RobowlerSection from '@/components/landing/RobowlerSection'
import GamificationSection from '@/components/landing/GamificationSection'
import FranchiseSection from '@/components/landing/FranchiseSection'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <GameModesSection />
        <RobowlerSection />
        <GamificationSection />
        <FranchiseSection />
      </main>
      <Footer />
    </>
  )
}

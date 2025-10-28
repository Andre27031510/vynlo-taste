'use client';

import TasteHero from '@/components/landing/TasteHero'
import TasteFeatures from '@/components/landing/TasteFeatures'
import TasteBenefits from '@/components/landing/TasteBenefits'
import TasteFAQ from '@/components/landing/TasteFAQ'
import TasteCTABanner from '@/components/landing/TasteCTABanner'
import Header from '@/app/landingpages/Header'
import Footer from '@/app/landingpages/Footer'

export default function LandTaste() {
  return (
    <main className="min-h-screen page-white">
      <Header />
      
      {/* Hero Section - Azul/Preto Gradiente */}
      <TasteHero />
      
      {/* Features Section - Branco */}
      <TasteFeatures />
      
      {/* Benefits Section - Azul/Preto Gradiente */}
      <TasteBenefits />
      
      {/* FAQ Section - Branco */}
      <TasteFAQ />
      
      {/* CTA Banner - Azul/Preto Gradiente */}
      <TasteCTABanner />
      
      <Footer />
    </main>
  )
}

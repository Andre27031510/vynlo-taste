'use client';

import TasteHero from '@/components/landing/TasteHero'
import TasteFeatures from '@/components/landing/TasteFeatures'
import TasteBenefits from '@/components/landing/TasteBenefits'
import TasteContact from '@/components/landing/TasteContact'
import Header from '@/app/landingpages/Header'
import Footer from '@/app/landingpages/Footer'

export default function LandTaste() {
  return (
    <main className="min-h-screen">
      <Header />
      
      {/* Hero Section - Azul/Preto Gradiente */}
      <TasteHero />
      
      {/* Features Section - Branco */}
      <TasteFeatures />
      
      {/* Benefits Section - Azul/Preto Gradiente */}
      <TasteBenefits />
      
      {/* Contact Section - Branco */}
      <TasteContact />
      
      <Footer />
    </main>
  )
}

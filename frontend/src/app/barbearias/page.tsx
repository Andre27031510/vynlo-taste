'use client'

import BarbeariasHero from '@/components/landing/BarbeariasHero'
import BarbeariasFeatures from '@/components/landing/BarbeariasFeatures'
import BarbeariasBenefits from '@/components/landing/BarbeariasBenefits'
import BarbeariasFAQ from '@/components/landing/BarbeariasFAQ'
import BarbeariasCTABanner from '@/components/landing/BarbeariasCTABanner'
import Header from '@/app/landingpages/Header'
import Footer from '@/app/landingpages/Footer'

export default function BarbeariasPage() {
  return (
    <main className="min-h-screen">
      <Header />
      
      {/* Hero Section - Azul/Preto Gradiente */}
      <BarbeariasHero />
      
      {/* Features Section - Branco */}
      <BarbeariasFeatures />
      
      {/* Benefits Section - Azul/Preto Gradiente */}
      <BarbeariasBenefits />
      
      {/* FAQ Section - Branco */}
      <BarbeariasFAQ />
      
      {/* CTA Banner - Azul/Preto Gradiente */}
      <BarbeariasCTABanner />
      
      <Footer />
    </main>
  )
}
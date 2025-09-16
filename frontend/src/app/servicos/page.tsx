'use client'

import ServicosHero from '@/components/landing/ServicosHero'
import ServicosFeatures from '@/components/landing/ServicosFeatures'
import ServicosBenefits from '@/components/landing/ServicosBenefits'
import ServicosFAQ from '@/components/landing/ServicosFAQ'
import ServicosCTABanner from '@/components/landing/ServicosCTABanner'
import Header from '@/app/landingpages/Header'
import Footer from '@/app/landingpages/Footer'

export default function ServicosPage() {
  return (
    <main className="min-h-screen">
      <Header />
      
      {/* Hero Section - Azul/Preto Gradiente */}
      <ServicosHero />
      
      {/* Features Section - Branco */}
      <ServicosFeatures />
      
      {/* Benefits Section - Azul/Preto Gradiente */}
      <ServicosBenefits />
      
      {/* FAQ Section - Branco */}
      <ServicosFAQ />
      
      {/* CTA Banner - Azul/Preto Gradiente */}
      <ServicosCTABanner />
      
      <Footer />
    </main>
  )
}
'use client'

import SaudeHero from '@/components/landing/SaudeHero'
import SaudeFeatures from '@/components/landing/SaudeFeatures'
import SaudeBenefits from '@/components/landing/SaudeBenefits'
import SaudeFAQ from '@/components/landing/SaudeFAQ'
import SaudeCTABanner from '@/components/landing/SaudeCTABanner'
import Header from '@/app/landingpages/Header'
import Footer from '@/app/landingpages/Footer'

export default function SaudePage() {
  return (
    <main className="min-h-screen">
      <Header />
      
      {/* Hero Section - Azul/Preto Gradiente */}
      <SaudeHero />
      
      {/* Features Section - Branco */}
      <SaudeFeatures />
      
      {/* Benefits Section - Azul/Preto Gradiente */}
      <SaudeBenefits />
      
      {/* FAQ Section - Branco */}
      <SaudeFAQ />
      
      {/* CTA Banner - Azul/Preto Gradiente */}
      <SaudeCTABanner />
      
      <Footer />
    </main>
  )
}
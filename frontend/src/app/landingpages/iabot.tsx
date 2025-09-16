'use client'

import IABotHero from '@/components/landing/IABotHero'
import IABotFeatures from '@/components/landing/IABotFeatures'
import IABotBenefits from '@/components/landing/IABotBenefits'
import IABotFAQ from '@/components/landing/IABotFAQ'
import IABotCTABanner from '@/components/landing/IABotCTABanner'
import Header from '@/app/landingpages/Header'
import Footer from '@/app/landingpages/Footer'

export default function IABotPage() {
  return (
    <main className="min-h-screen">
      <Header />
      
      {/* IA Bot Hero Section - Azul/Preto Gradiente */}
      <IABotHero />
      
      {/* IA Bot Features Section - Branco */}
      <IABotFeatures />
      
      {/* IA Bot Benefits Section - Azul/Preto Gradiente */}
      <IABotBenefits />
      
      {/* IA Bot FAQ Section - Branco */}
      <IABotFAQ />
      
      {/* IA Bot CTA Banner - Azul/Preto Gradiente */}
      <IABotCTABanner />
      
      <Footer />
    </main>
  )
}
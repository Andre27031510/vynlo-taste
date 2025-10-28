'use client'

import { useEffect } from 'react'
import SaudeHero from '@/components/landing/SaudeHero'
import SaudeFeatures from '@/components/landing/SaudeFeatures'
import SaudeBenefits from '@/components/landing/SaudeBenefits'
import SaudeFAQ from '@/components/landing/SaudeFAQ'
import SaudeCTABanner from '@/components/landing/SaudeCTABanner'
import Header from '@/app/landingpages/Header'
import Footer from '@/app/landingpages/Footer'

export default function SaudePage() {
  useEffect(() => {
    document.body.classList.add('page-white')
    return () => document.body.classList.remove('page-white')
  }, [])

  return (
    <main className="min-h-screen page-white">
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
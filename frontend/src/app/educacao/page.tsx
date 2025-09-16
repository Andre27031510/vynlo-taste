'use client'

import EducacaoHero from '@/components/landing/EducacaoHero'
import EducacaoFeatures from '@/components/landing/EducacaoFeatures'
import EducacaoBenefits from '@/components/landing/EducacaoBenefits'
import EducacaoFAQ from '@/components/landing/EducacaoFAQ'
import EducacaoCTABanner from '@/components/landing/EducacaoCTABanner'
import Header from '@/app/landingpages/Header'
import Footer from '@/app/landingpages/Footer'

export default function EducacaoPage() {
  return (
    <main className="min-h-screen">
      <Header />
      
      {/* Hero Section - Azul/Preto Gradiente */}
      <EducacaoHero />
      
      {/* Features Section - Branco */}
      <EducacaoFeatures />
      
      {/* Benefits Section - Azul/Preto Gradiente */}
      <EducacaoBenefits />
      
      {/* FAQ Section - Branco */}
      <EducacaoFAQ />
      
      {/* CTA Banner - Azul/Preto Gradiente */}
      <EducacaoCTABanner />
      
      <Footer />
    </main>
  )
}
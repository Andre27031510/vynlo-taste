'use client'

import { useEffect } from 'react'
import PetshopsHero from '@/components/landing/PetshopsHero'
import PetshopsFeatures from '@/components/landing/PetshopsFeatures'
import PetshopsBenefits from '@/components/landing/PetshopsBenefits'
import PetshopsFAQ from '@/components/landing/PetshopsFAQ'
import PetshopsCTABanner from '@/components/landing/PetshopsCTABanner'
import Header from '@/app/landingpages/Header'
import Footer from '@/app/landingpages/Footer'

export default function PetshopsPage() {
  useEffect(() => {
    document.body.classList.add('page-white')
    return () => document.body.classList.remove('page-white')
  }, [])

  return (
    <main className="min-h-screen page-white">
      <Header />
      
      {/* Hero Section - Azul/Preto Gradiente */}
      <PetshopsHero />
      
      {/* Features Section - Branco */}
      <PetshopsFeatures />
      
      {/* Benefits Section - Azul/Preto Gradiente */}
      <PetshopsBenefits />
      
      {/* FAQ Section - Branco */}
      <PetshopsFAQ />
      
      {/* CTA Banner - Azul/Preto Gradiente */}
      <PetshopsCTABanner />
      
      <Footer />
    </main>
  )
}
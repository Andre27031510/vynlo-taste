'use client'

import { useEffect } from 'react'
import IgrejasHero from '@/components/landing/IgrejasHero'
import IgrejasFeatures from '@/components/landing/IgrejasFeatures'
import IgrejasBenefits from '@/components/landing/IgrejasBenefits'
import IgrejasFAQ from '@/components/landing/IgrejasFAQ'
import IgrejasCTABanner from '@/components/landing/IgrejasCTABanner'
import Header from '@/app/landingpages/Header'
import Footer from '@/app/landingpages/Footer'

export default function IgrejasPage() {
  useEffect(() => {
    document.body.classList.add('page-white')
    return () => document.body.classList.remove('page-white')
  }, [])

  return (
    <main className="min-h-screen page-white">
      <Header />
      <IgrejasHero />
      <IgrejasFeatures />
      <IgrejasBenefits />
      <IgrejasFAQ />
      <IgrejasCTABanner />
      <Footer />
    </main>
  )
}
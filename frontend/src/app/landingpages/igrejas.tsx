'use client'

import React from 'react'
import IgrejasHero from '@/components/landing/IgrejasHero'
import IgrejasFeatures from '@/components/landing/IgrejasFeatures'
import IgrejasBenefits from '@/components/landing/IgrejasBenefits'
import IgrejasFAQ from '@/components/landing/IgrejasFAQ'
import IgrejasCTABanner from '@/components/landing/IgrejasCTABanner'

export default function IgrejasPage() {
  return (
    <main className="min-h-screen">
      <IgrejasHero />
      <IgrejasFeatures />
      <IgrejasBenefits />
      <IgrejasFAQ />
      <IgrejasCTABanner />
    </main>
  )
}
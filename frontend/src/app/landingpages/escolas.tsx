'use client'

import React from 'react'
import EscolasHero from '@/components/landing/EscolasHero'
import EscolasFeatures from '@/components/landing/EscolasFeatures'
import EscolasBenefits from '@/components/landing/EscolasBenefits'
import EscolasFAQ from '@/components/landing/EscolasFAQ'
import EscolasCTABanner from '@/components/landing/EscolasCTABanner'

export default function EscolasPage() {
  return (
    <main className="min-h-screen">
      <EscolasHero />
      <EscolasFeatures />
      <EscolasBenefits />
      <EscolasFAQ />
      <EscolasCTABanner />
    </main>
  )
}
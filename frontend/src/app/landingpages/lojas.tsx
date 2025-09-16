'use client'

import React from 'react'
import LojasHero from '@/components/landing/LojasHero'
import LojasFeatures from '@/components/landing/LojasFeatures'
import LojasBenefits from '@/components/landing/LojasBenefits'
import LojasFAQ from '@/components/landing/LojasFAQ'
import LojasCTABanner from '@/components/landing/LojasCTABanner'

export default function LojasPage() {
  return (
    <main className="min-h-screen">
      <LojasHero />
      <LojasFeatures />
      <LojasBenefits />
      <LojasFAQ />
      <LojasCTABanner />
    </main>
  )
}
'use client'

import React from 'react'
import SaloesHero from '@/components/landing/SaloesHero'
import SaloesFeatures from '@/components/landing/SaloesFeatures'
import SaloesBenefits from '@/components/landing/SaloesBenefits'
import SaloesFAQ from '@/components/landing/SaloesFAQ'
import SaloesCTABanner from '@/components/landing/SaloesCTABanner'

export default function SaloesPage() {
  return (
    <main className="min-h-screen">
      <SaloesHero />
      <SaloesFeatures />
      <SaloesBenefits />
      <SaloesFAQ />
      <SaloesCTABanner />
    </main>
  )
}
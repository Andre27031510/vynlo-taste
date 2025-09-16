'use client'

import React from 'react'
import ClinicasHero from '@/components/landing/ClinicasHero'
import ClinicasFeatures from '@/components/landing/ClinicasFeatures'
import ClinicasBenefits from '@/components/landing/ClinicasBenefits'
import ClinicasFAQ from '@/components/landing/ClinicasFAQ'
import ClinicasCTABanner from '@/components/landing/ClinicasCTABanner'

export default function ClinicasPage() {
  return (
    <main className="min-h-screen">
      <ClinicasHero />
      <ClinicasFeatures />
      <ClinicasBenefits />
      <ClinicasFAQ />
      <ClinicasCTABanner />
    </main>
  )
}
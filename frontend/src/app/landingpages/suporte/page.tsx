'use client'

import React, { Suspense } from 'react'
import { useSupport } from '../../../hooks/useSupport'
import ErrorBoundary from '../../../components/ErrorBoundary'
import { logger } from '../../../utils/logger'
import Header from '../Header'
import Footer from '../Footer'

// Lazy loading dos componentes de suporte
const SupportHero = React.lazy(() => import('../../../components/support/SupportHero'))
const HelpCenter = React.lazy(() => import('../../../components/support/HelpCenter'))
const TechnicalDocumentation = React.lazy(() => import('../../../components/support/TechnicalDocumentation'))
const TechnicalFAQ = React.lazy(() => import('../../../components/support/TechnicalFAQ'))
const TechnicalContact = React.lazy(() => import('../../../components/support/TechnicalContact'))
const SystemStatus = React.lazy(() => import('../../../components/support/SystemStatus'))
const SupportCTA = React.lazy(() => import('../../../components/support/SupportCTA'))

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-12">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
)

const SuportePage: React.FC = () => {
  const {
    activeSection,
    scrollProgress,
    selectedCategory,
    searchQuery,
    isLoading,
    error,
    clearError
  } = useSupport()

  React.useEffect(() => {
    try {
      logger.componentMount('SuportePage')
    } catch (error) {
      logger.error('Erro ao montar SuportePage', error as Error)
    }
  }, [])

  return (
    <ErrorBoundary>
      <div className="support-page">
        <Header />
        
        {/* 1. Hero Section - Fundo escuro */}
        <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-black">
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <SupportHero />
            </Suspense>
          </ErrorBoundary>
        </section>

        {/* 2. Help Center - Fundo branco */}
        <section className="bg-white">
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <HelpCenter 
                selectedCategory={selectedCategory}
                searchQuery={searchQuery}
              />
            </Suspense>
          </ErrorBoundary>
        </section>

        {/* 3. Technical Documentation - Fundo escuro */}
        <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-black">
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <TechnicalDocumentation />
            </Suspense>
          </ErrorBoundary>
        </section>

        {/* 4. Technical FAQ - Fundo branco */}
        <section className="bg-white">
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <TechnicalFAQ />
            </Suspense>
          </ErrorBoundary>
        </section>

        {/* 5. Technical Contact - Fundo escuro */}
        <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-black">
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <TechnicalContact />
            </Suspense>
          </ErrorBoundary>
        </section>

        {/* 6. System Status - Fundo branco */}
        <section className="bg-white">
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <SystemStatus />
            </Suspense>
          </ErrorBoundary>
        </section>

        {/* 7. Support CTA - Fundo escuro */}
        <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-black">
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <SupportCTA />
            </Suspense>
          </ErrorBoundary>
        </section>

        <Footer />
      </div>
    </ErrorBoundary>
  )
}

export default SuportePage
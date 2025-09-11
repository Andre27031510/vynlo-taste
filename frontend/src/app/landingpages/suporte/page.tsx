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
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <SupportHero />
          </Suspense>
        </ErrorBoundary>
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <HelpCenter 
              selectedCategory={selectedCategory}
              searchQuery={searchQuery}
            />
          </Suspense>
        </ErrorBoundary>
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <TechnicalDocumentation />
          </Suspense>
        </ErrorBoundary>
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <TechnicalFAQ />
          </Suspense>
        </ErrorBoundary>
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <TechnicalContact />
          </Suspense>
        </ErrorBoundary>
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <SystemStatus />
          </Suspense>
        </ErrorBoundary>
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <SupportCTA />
          </Suspense>
        </ErrorBoundary>
        <Footer />
      </div>
    </ErrorBoundary>
  )
}

export default SuportePage
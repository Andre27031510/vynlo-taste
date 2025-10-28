'use client'

import React, { Suspense } from 'react'
import { useInstitutional } from '../../../hooks/useInstitutional'
import ErrorBoundary from '../../../components/ErrorBoundary'
import { logger } from '../../../utils/logger'
import Header from '../Header'
import Footer from '../Footer'

// Lazy loading dos componentes institucionais
const InstitutionalHero = React.lazy(() => import('../../../components/institutional/InstitutionalHero'))
const OurHistory = React.lazy(() => import('../../../components/institutional/OurHistory'))
const MissionVisionValues = React.lazy(() => import('../../../components/institutional/MissionVisionValues'))
const InstitutionalTechStack = React.lazy(() => import('../../../components/institutional/InstitutionalTechStack'))
const SuccessCases = React.lazy(() => import('../../../components/institutional/SuccessCases'))
const Testimonials = React.lazy(() => import('../../../components/institutional/Testimonials'))
const InstitutionalCTA = React.lazy(() => import('../../../components/institutional/InstitutionalCTA'))

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-12">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
)

const SobrePage: React.FC = () => {
  const {
    activeSection,
    scrollProgress,
    isLoading,
    error,
    clearError
  } = useInstitutional()

  React.useEffect(() => {
    document.body.classList.add('page-white')
    try {
      logger.componentMount('SobrePage')
    } catch (error) {
      logger.error('Erro ao montar SobrePage', error as Error)
    }
    return () => document.body.classList.remove('page-white')
  }, [])

  return (
    <ErrorBoundary>
      <div className="institutional-page">
        <Header />
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <InstitutionalHero />
          </Suspense>
        </ErrorBoundary>
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <OurHistory />
          </Suspense>
        </ErrorBoundary>
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <MissionVisionValues />
          </Suspense>
        </ErrorBoundary>
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <InstitutionalTechStack />
          </Suspense>
        </ErrorBoundary>
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <SuccessCases />
          </Suspense>
        </ErrorBoundary>
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <Testimonials />
          </Suspense>
        </ErrorBoundary>
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <InstitutionalCTA />
          </Suspense>
        </ErrorBoundary>
        <Footer />
      </div>
    </ErrorBoundary>
  )
}

export default SobrePage
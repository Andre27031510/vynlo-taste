'use client'

import React, { Suspense } from 'react'
import { useResources } from '../../hooks/useResources'
import ErrorBoundary from '../../components/ErrorBoundary'
import { logger } from '../../utils/logger'
import Header from './Header'
import Footer from './Footer'

// Lazy loading dos componentes de recursos
const ResourcesHero = React.lazy(() => import('../../components/resources/ResourcesHero'))
const TechStackSection = React.lazy(() => import('../../components/resources/TechStackSection'))
const APIsIntegrations = React.lazy(() => import('../../components/resources/APIsIntegrations'))
const SecurityProtection = React.lazy(() => import('../../components/resources/SecurityProtection'))
const PerformanceScalability = React.lazy(() => import('../../components/resources/PerformanceScalability'))
const TechnicalDocumentation = React.lazy(() => import('../../components/resources/TechnicalDocumentation'))
const TechnicalSupport = React.lazy(() => import('../../components/resources/TechnicalSupport'))
const DemonstrationCTA = React.lazy(() => import('../../components/resources/DemonstrationCTA'))

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-12">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
)

const RecursosPage: React.FC = () => {
  const {
    activeSection,
    scrollProgress,
    isLoading,
    error,
    clearError
  } = useResources()

  React.useEffect(() => {
    try {
      logger.componentMount('RecursosPage')
    } catch (error) {
      logger.error('Erro ao montar RecursosPage', error as Error)
    }
  }, [])

  return (
    <ErrorBoundary>
      <div className="resources-page">
        {/* Header */}
        <Header />

        {/* Hero - Fundo azul/preto com gradiente */}
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <ResourcesHero />
          </Suspense>
        </ErrorBoundary>

        {/* Stack Tecnológico - Fundo branco */}
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <TechStackSection />
          </Suspense>
        </ErrorBoundary>

        {/* APIs e Integrações - Fundo azul/preto com gradiente */}
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <APIsIntegrations />
          </Suspense>
        </ErrorBoundary>

        {/* Segurança e Proteção - Fundo branco */}
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <SecurityProtection />
          </Suspense>
        </ErrorBoundary>

        {/* Performance e Escalabilidade - Fundo azul/preto com gradiente */}
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <PerformanceScalability />
          </Suspense>
        </ErrorBoundary>

        {/* Documentação Técnica - Fundo branco */}
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <TechnicalDocumentation />
          </Suspense>
        </ErrorBoundary>

        {/* Suporte Técnico - Fundo azul/preto com gradiente */}
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <TechnicalSupport />
          </Suspense>
        </ErrorBoundary>

        {/* CTA para demonstração - Fundo branco */}
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <DemonstrationCTA />
          </Suspense>
        </ErrorBoundary>

        {/* Footer */}
        <Footer />
      </div>
    </ErrorBoundary>
  )
}

export default RecursosPage
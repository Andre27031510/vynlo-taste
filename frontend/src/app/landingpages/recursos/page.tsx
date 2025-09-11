'use client'

import React, { Suspense } from 'react'
import { useResources } from '../../../hooks/useResources'
import ErrorBoundary from '../../../components/ErrorBoundary'
import { logger } from '../../../utils/logger'
import Header from '../Header'
import Footer from '../Footer'

// Lazy loading dos componentes de recursos
const ResourcesHero = React.lazy(() => import('../../../components/resources/ResourcesHero'))
const SmartManagement = React.lazy(() => import('../../../components/resources/SmartManagement'))
const BusinessSecurity = React.lazy(() => import('../../../components/resources/BusinessSecurity'))
const AdvancedReports = React.lazy(() => import('../../../components/resources/AdvancedReports'))
const SpecializedSupport = React.lazy(() => import('../../../components/resources/SpecializedSupport'))
const DemonstrationCTA = React.lazy(() => import('../../../components/resources/DemonstrationCTA'))

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
        <Header />
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <ResourcesHero />
          </Suspense>
        </ErrorBoundary>
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <SmartManagement />
          </Suspense>
        </ErrorBoundary>
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <BusinessSecurity />
          </Suspense>
        </ErrorBoundary>
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <AdvancedReports />
          </Suspense>
        </ErrorBoundary>
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <SpecializedSupport />
          </Suspense>
        </ErrorBoundary>
        {/* Banner antes do Footer */}
        <div className="mb-20">
          <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 overflow-hidden max-w-7xl mx-auto">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl font-manrope font-bold text-white mb-6">
                  Pronto para revolucionar seu negócio?
                </h3>
                <p className="text-xl text-white/90 font-manrope leading-relaxed mb-8">
                  Junte-se a mais de 5.000 empresários que já transformaram seus negócios com nossos recursos avançados. Teste grátis por 30 dias, sem compromisso.
                </p>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-black text-white font-manrope">30 dias</div>
                    <div className="text-white/80 font-manrope text-sm">Teste Grátis</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-black text-white font-manrope">5.000+</div>
                    <div className="text-white/80 font-manrope text-sm">Clientes Ativos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-black text-white font-manrope">24/7</div>
                    <div className="text-white/80 font-manrope text-sm">Suporte Total</div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Empresário usando Vynlo" 
                  className="rounded-2xl shadow-2xl w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>

        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <DemonstrationCTA />
          </Suspense>
        </ErrorBoundary>
        <Footer />
      </div>
    </ErrorBoundary>
  )
}

export default RecursosPage
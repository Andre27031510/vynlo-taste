
'use client'

import React, { Suspense } from 'react'
import { useResources } from '../../../hooks/useResources'
import ErrorBoundary from '../../../components/ErrorBoundary'
import { logger } from '../../../utils/logger'
import { ArrowRight } from 'lucide-react'
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
    document.body.classList.add('page-white')
    try {
      logger.componentMount('RecursosPage')
    } catch (error) {
      logger.error('Erro ao montar RecursosPage', error as Error)
    }
    return () => document.body.classList.remove('page-white')
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
        <section className="py-32 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 overflow-hidden">
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
        </section>



        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <DemonstrationCTA />
          </Suspense>
        </ErrorBoundary>
        
        {/* Banner Final grudado no Footer */}
        <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-black relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative py-32">
            <div className="text-center">
              <h3 className="text-4xl lg:text-5xl font-manrope font-black text-white mb-6">
                Transforme seu negócio
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400">
                  com nossos recursos
                </span>
              </h3>
              <p className="text-xl text-gray-300 font-manrope leading-relaxed mb-12 max-w-4xl mx-auto">
                Mais de 5.000 empresários já revolucionaram seus negócios com nossos recursos avançados. 
                Seja o próximo a transformar sua empresa.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="text-center">
                  <div className="text-4xl font-black text-white font-manrope mb-2">200+</div>
                  <div className="text-gray-400 font-manrope">Funcionalidades Disponíveis</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-black text-white font-manrope mb-2">98%</div>
                  <div className="text-gray-400 font-manrope">Satisfação dos Clientes</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-black text-white font-manrope mb-2">24/7</div>
                  <div className="text-gray-400 font-manrope">Suporte Especializado</div>
                </div>
              </div>
              
              <a 
                href="/contato" 
                className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-manrope font-bold px-12 py-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-2xl"
              >
                <span className="text-lg">Entre em Contato</span>
                <ArrowRight className="w-6 h-6" />
              </a>
            </div>
          </div>
        </section>
        
        <Footer />
      </div>
    </ErrorBoundary>
  )
}

export default RecursosPage
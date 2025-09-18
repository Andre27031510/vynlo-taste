'use client'

import React, { Suspense } from 'react'
import { useSupport } from '../../../hooks/useSupport'
import ErrorBoundary from '../../../components/ErrorBoundary'
import { logger } from '../../../utils/logger'
import { ArrowRight, MessageCircle } from 'lucide-react'
import Header from '../Header'
import Footer from '../Footer'

// Lazy loading dos novos componentes de suporte B2B
const SupportHero = React.lazy(() => import('../../../components/support/SupportHero'))
const SupportDifferentials = React.lazy(() => import('../../../components/support/SupportDifferentials'))
const ClientJourney = React.lazy(() => import('../../../components/support/ClientJourney'))
const SuccessCases = React.lazy(() => import('../../../components/support/SuccessCases'))

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

        {/* 2. Support Differentials - Fundo branco */}
        <section className="bg-white">
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <SupportDifferentials />
            </Suspense>
          </ErrorBoundary>
        </section>

        {/* 3. Client Journey - Fundo escuro */}
        <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-black">
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <ClientJourney />
            </Suspense>
          </ErrorBoundary>
        </section>

        {/* 4. Success Cases - Fundo branco */}
        <section className="bg-white">
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <SuccessCases />
            </Suspense>
          </ErrorBoundary>
        </section>

        {/* 5. Support Plans - Fundo escuro */}
        <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-black py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-manrope font-black text-white mb-6">
                Planos de
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400">
                  Suporte
                </span>
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { name: 'Básico', response: '8h', channels: 'Email', price: 'Incluído' },
                { name: 'Profissional', response: '4h', channels: 'Chat + Email', price: 'R$ 299/mês' },
                { name: 'Enterprise', response: '2h', channels: 'Telefone + Chat + Email', price: 'R$ 599/mês' }
              ].map((plan, index) => (
                <div key={index} className={`bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 ${index === 1 ? 'ring-2 ring-blue-400' : ''}`}>
                  <h3 className="text-2xl font-manrope font-bold text-white mb-4">{plan.name}</h3>
                  <div className="text-3xl font-bold text-white mb-6">{plan.price}</div>
                  <ul className="space-y-3 text-gray-300">
                    <li>Resposta em {plan.response}</li>
                    <li>{plan.channels}</li>
                    <li>SLA garantido</li>
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Technical Team - Fundo branco */}
        <section className="bg-white py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-manrope font-black text-gray-900 mb-6">
                Nossa
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600">
                  Equipe
                </span>
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { name: 'João Silva', role: 'Tech Lead', experience: '8 anos', specialty: 'Sistemas Enterprise' },
                { name: 'Maria Santos', role: 'DevOps Engineer', experience: '6 anos', specialty: 'Cloud & Infrastructure' },
                { name: 'Pedro Costa', role: 'Support Manager', experience: '10 anos', specialty: 'Customer Success' }
              ].map((member, index) => (
                <div key={index} className="bg-white rounded-3xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-500">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                    <span className="text-white font-bold text-xl">{member.name.split(' ').map(n => n[0]).join('')}</span>
                  </div>
                  <h3 className="text-xl font-manrope font-bold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-blue-600 font-medium mb-2">{member.role}</p>
                  <p className="text-gray-600 text-sm mb-4">{member.experience} • {member.specialty}</p>
                  <button className="text-blue-600 font-medium text-sm hover:text-blue-700">
                    Falar com {member.name.split(' ')[0]}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. CTA Final - Fundo escuro */}
        <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-black py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-4xl lg:text-5xl font-manrope font-black text-white mb-6">
                Pronto para ter o melhor
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400">
                  suporte do mercado?
                </span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-12">
                Fale com nossos especialistas e descubra como podemos acelerar o sucesso do seu negócio
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-manrope font-bold px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  <span>Falar com Especialista Agora</span>
                </button>
                
                <button className="bg-white/10 backdrop-blur-sm border border-white/20 text-white font-manrope font-bold px-8 py-4 rounded-xl hover:bg-white/20 transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
                  <ArrowRight className="w-5 h-5" />
                  <span>Agendar Demonstração Gratuita</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </ErrorBoundary>
  )
}

export default SuportePage
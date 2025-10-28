'use client'

import React, { Suspense } from 'react'
import { useSupport } from '../../../hooks/useSupport'
import ErrorBoundary from '../../../components/ErrorBoundary'
import { logger } from '../../../utils/logger'
import { ArrowRight, MessageCircle, BarChart3, BookOpen, Ticket, Smartphone, Wrench } from 'lucide-react'
import Header from '../Header'
import Footer from '../Footer'
import AppointmentModal from '../../../components/modals/AppointmentModal'

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
  
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  
  const handleOpenModal = () => setIsModalOpen(true)
  const handleCloseModal = () => setIsModalOpen(false)
  const handleWhatsApp = () => {
    window.open('https://wa.me/5511999999999?text=Olá! Gostaria de falar com um especialista em suporte.', '_blank')
  }

  React.useEffect(() => {
    document.body.classList.add('page-white')
    try {
      logger.componentMount('SuportePage')
    } catch (error) {
      logger.error('Erro ao montar SuportePage', error as Error)
    }
    return () => document.body.classList.remove('page-white')
  }, [])

  return (
    <ErrorBoundary>
      <div className="support-page">
        <Header />
        
        <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-black">
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <SupportHero />
            </Suspense>
          </ErrorBoundary>
        </section>

        <section className="bg-white">
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <SupportDifferentials />
            </Suspense>
          </ErrorBoundary>
        </section>

        <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-black">
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <ClientJourney />
            </Suspense>
          </ErrorBoundary>
        </section>

        <section className="bg-white">
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <SuccessCases />
            </Suspense>
          </ErrorBoundary>
        </section>

        <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-black py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-manrope font-black text-white mb-6">
                Níveis de
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400">
                  Suporte
                </span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Soluções personalizadas para cada necessidade empresarial
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { name: 'Essencial', response: '8h', channels: 'Email + Portal', features: ['Documentação completa', 'Base de conhecimento', 'Tickets por email'] },
                { name: 'Profissional', response: '4h', channels: 'Chat + Email + Portal', features: ['Suporte prioritário', 'Chat ao vivo', 'Treinamento básico'] },
                { name: 'Enterprise', response: '2h', channels: 'Telefone + Chat + Email', features: ['Gerente dedicado', 'Suporte 24/7', 'Implementação assistida'] }
              ].map((plan, index) => (
                <div key={index} className={`bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 ${index === 1 ? 'ring-2 ring-blue-400' : ''}`}>
                  <h3 className="text-2xl font-manrope font-bold text-white mb-4">{plan.name}</h3>
                  <div className="text-lg font-medium text-blue-400 mb-6">Resposta em {plan.response}</div>
                  <div className="text-gray-300 mb-6">{plan.channels}</div>
                  <ul className="space-y-3 text-gray-300">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-manrope font-black text-gray-900 mb-6">
                Ferramentas de
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600">
                  Suporte
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Recursos e ferramentas disponíveis para otimizar sua experiência
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { 
                  icon: BarChart3, 
                  title: 'Dashboard de Status', 
                  description: 'Monitore o status de todos os serviços em tempo real',
                  features: ['Status em tempo real', 'Histórico de incidentes', 'Métricas de uptime']
                },
                { 
                  icon: BookOpen, 
                  title: 'Base de Conhecimento', 
                  description: 'Documentação completa e tutoriais passo a passo',
                  features: ['Guias detalhados', 'Vídeos tutoriais', 'FAQ atualizado']
                },
                { 
                  icon: Ticket, 
                  title: 'Sistema de Tickets', 
                  description: 'Abra e acompanhe tickets de suporte facilmente',
                  features: ['Priorização automática', 'Histórico completo', 'Notificações em tempo real']
                },
                { 
                  icon: MessageCircle, 
                  title: 'Chat ao Vivo', 
                  description: 'Suporte instantâneo com nossa equipe técnica',
                  features: ['Resposta imediata', 'Compartilhamento de tela', 'Histórico de conversas']
                },
                { 
                  icon: Smartphone, 
                  title: 'App Mobile', 
                  description: 'Acesse o suporte direto do seu smartphone',
                  features: ['Notificações push', 'Acesso offline', 'Interface otimizada']
                },
                { 
                  icon: Wrench, 
                  title: 'Ferramentas de Diagnóstico', 
                  description: 'Identifique e resolva problemas automaticamente',
                  features: ['Diagnóstico automático', 'Relatórios detalhados', 'Soluções sugeridas']
                }
              ].map((tool, index) => {
                const IconComponent = tool.icon
                return (
                  <div key={index} className="bg-white rounded-3xl p-8 border border-gray-100 hover:border-blue-200 hover:shadow-2xl transition-all duration-500">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-manrope font-bold text-gray-900 mb-4">{tool.title}</h3>
                    <p className="text-gray-600 leading-relaxed mb-6">{tool.description}</p>
                    <ul className="space-y-2">
                      {tool.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-gray-600 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

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
                <button 
                  onClick={handleWhatsApp}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-manrope font-bold px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Falar com Especialista Agora</span>
                </button>
                
                <button 
                  onClick={handleOpenModal}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 text-white font-manrope font-bold px-8 py-4 rounded-xl hover:bg-white/20 transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                >
                  <ArrowRight className="w-5 h-5" />
                  <span>Agendar Demonstração Gratuita</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        <Footer />
        
        <AppointmentModal 
          isOpen={isModalOpen} 
          onClose={handleCloseModal}
        />
      </div>
    </ErrorBoundary>
  )
}

export default SuportePage
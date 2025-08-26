'use client'

import { useState, useEffect } from 'react'
import { 
  ChefHat, 
  Utensils, 
  Coffee, 
  Pizza,
  ArrowRight,
  CheckCircle,
  Star,
  TrendingUp,
  Users,
  Clock,
  X,
  Play,
  ExternalLink,
  Download
} from 'lucide-react'

export default function Solutions() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [selectedSolution, setSelectedSolution] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [scrollPosition, setScrollPosition] = useState(0)

  // Bloquear scroll da página quando modal estiver aberto
  useEffect(() => {
    const preventScroll = (e: Event) => {
      // Permitir scroll dentro do modal
      const target = e.target as Element
      if (target && target.closest('.modal-content')) {
        return true // Permitir scroll interno
      }
      
      e.preventDefault()
      e.stopPropagation()
      return false
    }

    if (isModalOpen) {
      // Salvar posição atual do scroll
      const currentScrollY = window.scrollY
      setScrollPosition(currentScrollY)
      
      // Adicionar classe para bloquear scroll
      document.body.classList.add('modal-open')
      
      // Prevenir scroll com event listeners (apenas na página principal)
      document.addEventListener('wheel', preventScroll, { passive: false })
      document.addEventListener('touchmove', preventScroll, { passive: false })
      document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'PageUp' || e.key === 'PageDown' || e.key === 'Home' || e.key === 'End' || e.key === ' ') {
          e.preventDefault()
        }
      })
    } else {
      // Remover classe e restaurar scroll
      document.body.classList.remove('modal-open')
      
      // Remover event listeners
      document.removeEventListener('wheel', preventScroll)
      document.removeEventListener('touchmove', preventScroll)
      
      // Restaurar posição do scroll após um pequeno delay
      setTimeout(() => {
        window.scrollTo(0, scrollPosition)
      }, 10)
    }

    // Cleanup function para restaurar o scroll quando componente for desmontado
    return () => {
      document.body.classList.remove('modal-open')
      document.removeEventListener('wheel', preventScroll)
      document.removeEventListener('touchmove', preventScroll)
    }
  }, [isModalOpen, scrollPosition])

  // Fechar modal com tecla ESC
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isModalOpen) {
        closeModal()
      }
    }

    if (isModalOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isModalOpen])

  const solutions = [
    {
      icon: ChefHat,
      title: "Restaurantes Gourmet",
      description: "Gestão completa para restaurantes sofisticados com controle de ingredientes premium e análise de custos detalhada.",
      features: ["Controle de Ingredientes Premium", "Análise de Margem por Prato", "Gestão de Sommelier"],
      color: "from-amber-500 to-orange-600",
      stats: { restaurants: "150+", growth: "+45%" },
      detailedDescription: "Nossa solução para Restaurantes Gourmet foi desenvolvida especificamente para estabelecimentos de alta gastronomia que exigem precisão absoluta na gestão de ingredientes premium, controle rigoroso de custos e uma experiência de cliente excepcional. Com funcionalidades avançadas de análise de margem por prato e gestão especializada de sommelier, você mantém a excelência culinária enquanto otimiza a rentabilidade.",
      benefits: [
        'Controle preciso de ingredientes premium e sazonalidade',
        'Análise detalhada de margem por prato com custos variáveis',
        'Gestão especializada de carta de vinhos e sommelier',
        'Sistema de reservas sofisticado com preferências do cliente',
        'Integração com fornecedores premium e certificações',
        'Dashboard de qualidade e satisfação do cliente'
      ],
      useCases: ['Restaurantes Michelin', 'Casas de jantar sofisticadas', 'Hotéis de luxo', 'Eventos gastronômicos'],
      videoUrl: '/videos/restaurantes-gourmet.mp4',
      screenshot: '/images/restaurantes-gourmet.jpg',
      integrations: ['Sistemas de reserva premium', 'Fornecedores certificados', 'Certificações de qualidade', 'Plataformas de crítica gastronômica']
    },
    {
      icon: Pizza,
      title: "Pizzarias & Fast Food",
      description: "Otimizado para alta rotatividade com sistema de pedidos rápidos e integração completa com delivery.",
      features: ["Pedidos Ultra-Rápidos", "Integração Total Delivery", "Controle de Tempo de Preparo"],
      color: "from-red-500 to-pink-600",
      stats: { restaurants: "200+", growth: "+60%" },
      detailedDescription: "A solução para Pizzarias & Fast Food foi projetada para máxima eficiência em ambientes de alta rotatividade. Com sistema de pedidos ultra-rápidos, integração total com plataformas de delivery e controle preciso de tempo de preparo, você atende mais clientes em menos tempo, mantendo a qualidade e aumentando significativamente suas vendas.",
      benefits: [
        'Sistema de pedidos otimizado para alta velocidade',
        'Integração nativa com iFood, Uber Eats, Rappi e outros',
        'Controle preciso de tempo de preparo e entrega',
        'Gestão de múltiplas filas e priorização inteligente',
        'Automação de pedidos repetitivos e combos',
        'Relatórios de performance em tempo real'
      ],
      useCases: ['Pizzarias tradicionais', 'Fast-foods de alta rotatividade', 'Food trucks', 'Delivery especializado'],
      videoUrl: '/videos/pizzarias-fastfood.mp4',
      screenshot: '/images/pizzarias-fastfood.jpg',
      integrations: ['iFood', 'Uber Eats', 'Rappi', 'WhatsApp Business', 'Sistemas de pagamento']
    },
    {
      icon: Coffee,
      title: "Cafeterias & Bistrôs",
      description: "Perfeito para ambientes aconchegantes com foco na experiência do cliente e produtos artesanais.",
      features: ["Programa de Fidelidade", "Controle de Produtos Artesanais", "Ambiente Personalizado"],
      color: "from-emerald-500 to-teal-600",
      stats: { restaurants: "120+", growth: "+35%" },
      detailedDescription: "Nossa solução para Cafeterias & Bistrôs é ideal para estabelecimentos que valorizam a experiência do cliente e a qualidade artesanal. Com programa de fidelidade inteligente, controle detalhado de produtos artesanais e personalização do ambiente, você cria conexões duradouras com seus clientes e diferencia sua marca no mercado competitivo.",
      benefits: [
        'Programa de fidelidade com recompensas personalizadas',
        'Controle detalhado de produtos artesanais e sazonalidade',
        'Personalização do ambiente e experiência do cliente',
        'Gestão de eventos especiais e workshops',
        'Integração com redes sociais e marketing digital',
        'Análise de preferências e comportamento do cliente'
      ],
      useCases: ['Cafeterias especializadas', 'Bistrôs aconchegantes', 'Padarias artesanais', 'Salões de chá'],
      videoUrl: '/videos/cafeterias-bistros.mp4',
      screenshot: '/images/cafeterias-bistros.jpg',
      integrations: ['Redes sociais', 'Marketing digital', 'Plataformas de eventos', 'Sistemas de pagamento']
    },
    {
      icon: Utensils,
      title: "Redes & Franquias",
      description: "Solução enterprise para múltiplas unidades com dashboard centralizado e relatórios consolidados.",
      features: ["Dashboard Multi-Unidades", "Relatórios Consolidados", "Gestão Centralizada"],
      color: "from-blue-500 to-purple-600",
      stats: { restaurants: "80+", growth: "+75%" },
      detailedDescription: "A solução para Redes & Franquias é nossa plataforma enterprise que permite gerenciar múltiplas unidades de forma centralizada e eficiente. Com dashboard multi-unidades, relatórios consolidados e gestão centralizada, você mantém o controle total sobre sua operação, padroniza processos e escala seu negócio com confiança.",
      benefits: [
        'Dashboard centralizado para todas as unidades',
        'Relatórios consolidados com comparações entre filiais',
        'Gestão centralizada de cardápios e preços',
        'Controle de qualidade e padrões em todas as unidades',
        'Análise de performance comparativa entre filiais',
        'Sistema de auditoria e compliance'
      ],
      useCases: ['Redes de restaurantes', 'Franquias gastronômicas', 'Cadeias de fast-food', 'Grupos hoteleiros'],
      videoUrl: '/videos/redes-franquias.mp4',
      screenshot: '/images/redes-franquias.jpg',
      integrations: ['Sistemas ERP', 'CRM empresarial', 'Plataformas de BI', 'Sistemas de compliance']
    }
  ]

  const openSolutionModal = (index: number) => {
    setSelectedSolution(index)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedSolution(null)
  }

  return (
    <section id="solutions" className="py-24 bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl -translate-x-48 -translate-y-48"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl translate-x-48 translate-y-48"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-manrope font-medium text-sm mb-6">
            <Star className="w-4 h-4" />
            <span>Soluções Especializadas</span>
          </div>
          
          <h2 className="text-5xl lg:text-6xl font-manrope font-bold text-gray-900 mb-6">
            Para cada tipo de
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              estabelecimento
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 font-manrope max-w-3xl mx-auto leading-relaxed">
            Desenvolvemos funcionalidades específicas para atender as necessidades únicas 
            de cada segmento gastronômico com precisão e eficiência.
          </p>
        </div>

        {/* Solutions Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-20">
          {solutions.map((solution, index) => {
            const IconComponent = solution.icon
            const isHovered = hoveredCard === index
            
            return (
              <div
                key={index}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`group relative bg-white rounded-3xl p-8 transition-all duration-500 transform hover:scale-105 hover:-translate-y-4 cursor-pointer solution-card ${
                  isHovered ? 'shadow-2xl shadow-blue-500/20' : 'shadow-lg hover:shadow-xl'
                }`}
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
                {/* Gradient Border - Removido para evitar fundo preto */}
                
                {/* Background Pattern - Removido para evitar fundo preto */}
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Icon & Stats */}
                  <div className="flex items-start justify-between mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-r ${solution.color} rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-manrope font-bold text-gray-900 group-hover:text-gray-800 transition-colors duration-300">
                        {solution.stats.restaurants}
                      </div>
                      <div className="text-sm text-gray-500 group-hover:text-gray-600 font-manrope transition-colors duration-300">clientes</div>
                      <div className={`text-sm font-manrope font-bold text-white px-2 py-1 rounded-lg bg-gradient-to-r ${solution.color} shadow-sm`}>
                        {solution.stats.growth}
                      </div>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-2xl font-manrope font-bold text-gray-900 group-hover:text-gray-800 mb-4 transition-all duration-300">
                    {solution.title}
                  </h3>
                  
                  <p className="text-gray-900 font-manrope leading-relaxed mb-6 transition-all duration-300">
                    {solution.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-3 mb-6">
                    {solution.features.map((feature, featureIndex) => (
                      <div 
                        key={featureIndex} 
                        className="flex items-center space-x-3 transform translate-x-0 group-hover:translate-x-2 transition-transform duration-300"
                        style={{ transitionDelay: `${featureIndex * 0.1}s` }}
                      >
                        <div className={`w-5 h-5 bg-gradient-to-r ${solution.color} rounded-full flex items-center justify-center`}>
                          <CheckCircle className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-gray-900 font-manrope transition-colors duration-300">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="flex items-center justify-between">
                    <button 
                      className={`inline-flex items-center space-x-2 bg-gradient-to-r ${solution.color} text-white font-manrope font-semibold px-6 py-3 rounded-xl opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300`}
                      onClick={() => openSolutionModal(index)}
                    >
                      <span>Saber Mais</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    
                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Floating Elements - Removidos para evitar fundo preto */}
              </div>
            )
          })}
        </div>

        {/* Bottom Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: Users, value: "550+", label: "Restaurantes Ativos", color: "text-blue-600" },
            { icon: TrendingUp, value: "R$ 2.5M", label: "Processado Mensalmente", color: "text-green-600" },
            { icon: Clock, value: "99.9%", label: "Uptime Garantido", color: "text-purple-600" },
            { icon: Star, value: "4.9/5", label: "Satisfação do Cliente", color: "text-yellow-600" }
          ].map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <div 
                key={index}
                className="text-center group cursor-pointer transform hover:scale-110 transition-all duration-300"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 ${stat.color} bg-opacity-10 rounded-2xl mb-4 group-hover:bg-opacity-20 transition-all duration-300`}>
                  <IconComponent className={`w-8 h-8 ${stat.color}`} />
                </div>
                <div className="text-3xl font-manrope font-bold text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-manrope text-sm">
                  {stat.label}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Solution Detail Modal */}
      {isModalOpen && selectedSolution !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            {/* Modal Header */}
            <div className="bg-white rounded-t-3xl p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-16 h-16 bg-gradient-to-r ${solutions[selectedSolution].color} rounded-2xl flex items-center justify-center`}>
                    {(() => {
                      const IconComponent = solutions[selectedSolution].icon
                      return <IconComponent className="w-8 h-8 text-white" />
                    })()}
                  </div>
                  <div>
                    <div className="inline-flex items-center space-x-2 bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-manrope font-medium mb-2">
                      <span>Solução Especializada</span>
                    </div>
                    <h2 id="modal-title" className="text-2xl font-manrope font-bold text-gray-900">
                      {solutions[selectedSolution].title}
                    </h2>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200"
                  aria-label="Fechar modal"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Modal Content with Custom Scroll */}
            <div className="modal-content p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)] scrollbar-hide">
              {/* Description */}
              <div>
                <h3 className="text-lg font-manrope font-semibold text-gray-900 mb-3">Descrição Detalhada</h3>
                <p className="text-gray-600 font-manrope leading-relaxed">
                  {solutions[selectedSolution].detailedDescription}
                </p>
              </div>

              {/* Benefits */}
              <div>
                <h3 className="text-lg font-manrope font-semibold text-gray-900 mb-3">Principais Benefícios</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {solutions[selectedSolution].benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 font-manrope text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Use Cases */}
              <div>
                <h3 className="text-lg font-manrope font-semibold text-gray-900 mb-3">Casos de Uso</h3>
                <div className="flex flex-wrap gap-2">
                  {solutions[selectedSolution].useCases.map((useCase, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-manrope"
                    >
                      {useCase}
                    </span>
                  ))}
                </div>
              </div>

              {/* Integrations */}
              <div>
                <h3 className="text-lg font-manrope font-semibold text-gray-900 mb-3">Integrações Disponíveis</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {solutions[selectedSolution].integrations.map((integration, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700 font-manrope text-sm">{integration}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Media Section */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Video Preview */}
                <div className="bg-gray-100 rounded-2xl p-4">
                  <div className="aspect-video bg-gray-200 rounded-xl flex items-center justify-center mb-3">
                    <button className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200">
                      <Play className="w-8 h-8 text-blue-600 ml-1" />
                    </button>
                  </div>
                  <p className="text-center text-gray-600 font-manrope text-sm">
                    Demonstração em Vídeo
                  </p>
                </div>

                {/* Screenshot Preview */}
                <div className="bg-gray-100 rounded-2xl p-4">
                  <div className="aspect-video bg-gray-200 rounded-xl flex items-center justify-center mb-3">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                        <ExternalLink className="w-6 h-6 text-blue-600" />
                      </div>
                      <p className="text-gray-600 font-manrope text-sm">Screenshot</p>
                    </div>
                  </div>
                  <p className="text-center text-gray-600 font-manrope text-sm">
                    Interface da Solução
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-manrope font-semibold px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2">
                  <Play className="w-4 h-4" />
                  <span>Ver Demo Completa</span>
                </button>
                <button className="flex-1 border-2 border-blue-600 text-blue-600 font-manrope font-semibold px-6 py-3 rounded-xl hover:bg-blue-600 hover:text-white transition-all duration-300 flex items-center justify-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>Baixar PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
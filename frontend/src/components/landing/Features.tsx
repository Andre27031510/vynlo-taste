'use client'

import { useState, useEffect } from 'react'
import { 
  ShoppingCart, 
  BarChart3, 
  Users, 
  CreditCard, 
  Smartphone, 
  Shield,
  Clock,
  TrendingUp,
  Zap,
  Database,
  Bell,
  Settings,
  Star,
  ArrowRight,
  CheckCircle,
  X,
  Play,
  ExternalLink,
  Download
} from 'lucide-react'

export default function Features() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [selectedFeature, setSelectedFeature] = useState<number | null>(null)
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

  const features = [
    {
      icon: Smartphone,
      title: 'Pedidos Multi-Canal',
      description: 'Receba pedidos do balcão, delivery, WhatsApp e apps em uma única tela unificada',
      category: 'Gestão de Pedidos',
      color: 'from-blue-500 to-cyan-600',
      gradient: 'from-blue-500/10 to-cyan-600/10',
      features: ['Integração WhatsApp', 'Apps de Delivery', 'Balcão Digital'],
      detailedDescription: 'O sistema de Pedidos Multi-Canal do Vynlo Taste centraliza todas as fontes de pedidos em uma interface única e intuitiva. Receba pedidos do WhatsApp Business, aplicativos de delivery (iFood, Uber Eats, Rappi), balcão físico e até mesmo pedidos por telefone, tudo organizado em tempo real.',
      benefits: [
        'Redução de 70% no tempo de processamento',
        'Integração nativa com WhatsApp Business',
        'Sincronização automática entre canais',
        'Interface unificada para toda a equipe'
      ],
      videoUrl: '/videos/pedidos-multicanal.mp4',
      screenshot: '/images/pedidos-multicanal.jpg',
      useCases: ['Restaurantes com delivery', 'Cafeterias com WhatsApp', 'Fast-foods multi-canal']
    },
    {
      icon: Clock,
      title: 'Tempo Real',
      description: 'Acompanhe o status de cada pedido em tempo real com notificações automáticas',
      category: 'Gestão de Pedidos',
      color: 'from-green-500 to-emerald-600',
      gradient: 'from-green-500/10 to-emerald-600/10',
      features: ['Status em Tempo Real', 'Notificações Push', 'Sincronização Instantânea'],
      detailedDescription: 'O sistema de Tempo Real garante que todos os membros da equipe tenham acesso instantâneo ao status dos pedidos. Desde o momento do recebimento até a entrega, cada atualização é sincronizada em tempo real com notificações push para todos os dispositivos.',
      benefits: [
        'Atualizações instantâneas em todos os dispositivos',
        'Notificações push personalizáveis',
        'Histórico completo de status',
        'Integração com sistema de cozinha'
      ],
      videoUrl: '/videos/tempo-real.mp4',
      screenshot: '/images/tempo-real.jpg',
      useCases: ['Restaurantes com múltiplas áreas', 'Cozinhas industriais', 'Serviços de catering']
    },
    {
      icon: Zap,
      title: 'Processamento Rápido',
      description: 'Interface otimizada para agilizar o atendimento e reduzir filas',
      category: 'Gestão de Pedidos',
      color: 'from-yellow-500 to-orange-600',
      gradient: 'from-yellow-500/10 to-orange-600/10',
      features: ['Interface Touch', 'Atalhos Rápidos', 'Automação Inteligente'],
      detailedDescription: 'A interface de Processamento Rápido foi desenvolvida especificamente para ambientes de restaurante, com botões grandes, navegação por gestos e atalhos inteligentes que reduzem o tempo de processamento de cada pedido.',
      benefits: [
        'Interface otimizada para tablets e touchscreens',
        'Atalhos personalizáveis por usuário',
        'Automação de tarefas repetitivas',
        'Redução de 60% no tempo de atendimento'
      ],
      videoUrl: '/videos/processamento-rapido.mp4',
      screenshot: '/images/processamento-rapido.jpg',
      useCases: ['Fast-foods de alta rotatividade', 'Food trucks', 'Restaurantes self-service']
    },
    {
      icon: TrendingUp,
      title: 'Dashboard Inteligente',
      description: 'Visualize métricas importantes com gráficos interativos e insights automáticos',
      category: 'Análises & Relatórios',
      color: 'from-purple-500 to-pink-600',
      gradient: 'from-purple-500/10 to-pink-600/10',
      features: ['Gráficos Interativos', 'Insights Automáticos', 'Métricas em Tempo Real'],
      detailedDescription: 'O Dashboard Inteligente transforma dados brutos em insights acionáveis. Com gráficos interativos, métricas em tempo real e análises preditivas, você toma decisões baseadas em dados para otimizar seu negócio.',
      benefits: [
        'Métricas atualizadas em tempo real',
        'Insights automáticos com IA',
        'Gráficos interativos responsivos',
        'Alertas inteligentes para oportunidades'
      ],
      videoUrl: '/videos/dashboard-inteligente.mp4',
      screenshot: '/images/dashboard-inteligente.jpg',
      useCases: ['Restaurantes com múltiplas unidades', 'Franquias', 'Restaurantes corporativos']
    },
    {
      icon: Database,
      title: 'Big Data Analytics',
      description: 'Análise avançada de dados para identificar padrões e oportunidades',
      category: 'Análises & Relatórios',
      color: 'from-indigo-500 to-purple-600',
      gradient: 'from-indigo-500/10 to-purple-600/10',
      features: ['Análise Preditiva', 'Machine Learning', 'Relatórios Avançados'],
      detailedDescription: 'Nossa plataforma de Big Data Analytics utiliza machine learning para analisar padrões de vendas, comportamento do cliente e tendências sazonais, fornecendo insights que ajudam a otimizar cardápios, preços e estratégias de marketing.',
      benefits: [
        'Análise preditiva de demanda',
        'Identificação automática de padrões',
        'Otimização de cardápio baseada em dados',
        'Previsões de vendas com 95% de precisão'
      ],
      videoUrl: '/videos/big-data-analytics.mp4',
      screenshot: '/images/big-data-analytics.jpg',
      useCases: ['Restaurantes de alta escala', 'Redes de fast-food', 'Restaurantes corporativos']
    },
    {
      icon: BarChart3,
      title: 'Relatórios Personalizados',
      description: 'Crie relatórios sob medida para suas necessidades específicas',
      category: 'Análises & Relatórios',
      color: 'from-red-500 to-pink-600',
      gradient: 'from-red-500/10 to-pink-600/10',
      features: ['Customização Total', 'Exportação Múltipla', 'Agendamento Automático'],
      detailedDescription: 'Crie relatórios personalizados que se adaptam às suas necessidades específicas. Com ferramentas de arrastar e soltar, você pode criar dashboards únicos e agendar envios automáticos para sua equipe.',
      benefits: [
        'Interface drag-and-drop para personalização',
        'Exportação em múltiplos formatos (PDF, Excel, CSV)',
        'Agendamento automático de relatórios',
        'Templates pré-configurados para diferentes segmentos'
      ],
      videoUrl: '/videos/relatorios-personalizados.mp4',
      screenshot: '/images/relatorios-personalizados.jpg',
      useCases: ['Restaurantes com equipe administrativa', 'Consultores gastronômicos', 'Auditores']
    },
    {
      icon: CreditCard,
      title: 'Gestão de Pagamentos',
      description: 'Controle todas as formas de pagamento com conciliação automática',
      category: 'Controle Financeiro',
      color: 'from-emerald-500 to-teal-600',
      gradient: 'from-emerald-500/10 to-teal-600/10',
      features: ['Múltiplas Formas', 'Conciliação Automática', 'Segurança PCI DSS'],
      detailedDescription: 'Gerencie todas as formas de pagamento em uma plataforma unificada. Desde cartões de crédito e débito até PIX, boleto e dinheiro, com conciliação automática e relatórios detalhados de transações.',
      benefits: [
        'Suporte a mais de 20 formas de pagamento',
        'Conciliação automática com extratos bancários',
        'Certificação PCI DSS para segurança',
        'Relatórios detalhados de transações'
      ],
      videoUrl: '/videos/gestao-pagamentos.mp4',
      screenshot: '/images/gestao-pagamentos.jpg',
      useCases: ['Restaurantes com múltiplas formas de pagamento', 'Food trucks', 'Restaurantes corporativos']
    },
    {
      icon: TrendingUp,
      title: 'Fluxo de Caixa',
      description: 'Monitore entradas e saídas com projeções e alertas inteligentes',
      category: 'Controle Financeiro',
      color: 'from-blue-600 to-indigo-600',
      gradient: 'from-blue-600/10 to-indigo-600/10',
      features: ['Projeções Inteligentes', 'Alertas Automáticos', 'Controle de Custos'],
      detailedDescription: 'Monitore seu fluxo de caixa em tempo real com projeções inteligentes baseadas em histórico e tendências sazonais. Receba alertas automáticos para oportunidades de otimização e controle de custos.',
      benefits: [
        'Projeções de caixa com 90% de precisão',
        'Alertas automáticos para oportunidades',
        'Controle de custos em tempo real',
        'Análise de sazonalidade e tendências'
      ],
      videoUrl: '/videos/fluxo-caixa.mp4',
      screenshot: '/images/fluxo-caixa.jpg',
      useCases: ['Restaurantes sazonais', 'Cadeias de restaurantes', 'Restaurantes com alta rotatividade']
    },
    {
      icon: Shield,
      title: 'Segurança Financeira',
      description: 'Criptografia bancária e auditoria completa de todas as transações',
      category: 'Controle Financeiro',
      color: 'from-amber-500 to-orange-600',
      gradient: 'from-amber-500/10 to-orange-600/10',
      features: ['Criptografia 256-bit', 'Auditoria Completa', 'Compliance Bancário'],
      detailedDescription: 'Sua segurança financeira é nossa prioridade. Utilizamos criptografia SSL 256-bits, somos certificados PCI DSS e mantemos auditoria completa de todas as transações para garantir total transparência e segurança.',
      benefits: [
        'Criptografia SSL 256-bits',
        'Certificação PCI DSS',
        'Auditoria completa de transações',
        'Backup automático em nuvem segura'
      ],
      videoUrl: '/videos/seguranca-financeira.mp4',
      screenshot: '/images/seguranca-financeira.jpg',
      useCases: ['Restaurantes com alto volume de transações', 'Cadeias internacionais', 'Restaurantes corporativos']
    },
    {
      icon: Users,
      title: 'Controle de Acesso',
      description: 'Defina permissões específicas para cada função e colaborador',
      category: 'Gestão de Equipe',
      color: 'from-violet-500 to-purple-600',
      gradient: 'from-violet-500/10 to-purple-600/10',
      features: ['Permissões Granulares', 'Hierarquia de Usuários', 'Controle de Acesso'],
      detailedDescription: 'Controle quem acessa o quê no sistema com permissões granulares baseadas em função. Crie hierarquias de usuários, defina níveis de acesso e monitore todas as atividades para garantir segurança e eficiência.',
      benefits: [
        'Permissões baseadas em função',
        'Hierarquia de usuários flexível',
        'Monitoramento de atividades em tempo real',
        'Integração com sistemas de RH'
      ],
      videoUrl: '/videos/controle-acesso.mp4',
      screenshot: '/images/controle-acesso.jpg',
      useCases: ['Restaurantes com múltiplas equipes', 'Cadeias de restaurantes', 'Restaurantes corporativos']
    },
    {
      icon: Bell,
      title: 'Comunicação Interna',
      description: 'Sistema de notificações e mensagens para toda a equipe',
      category: 'Gestão de Equipe',
      color: 'from-rose-500 to-pink-600',
      gradient: 'from-rose-500/10 to-pink-600/10',
      features: ['Chat Interno', 'Notificações Push', 'Histórico de Mensagens'],
      detailedDescription: 'Mantenha sua equipe conectada com um sistema de comunicação interno completo. Chat em tempo real, notificações push personalizáveis e histórico completo de mensagens para facilitar a colaboração.',
      benefits: [
        'Chat interno em tempo real',
        'Notificações push personalizáveis',
        'Histórico completo de mensagens',
        'Integração com sistema de pedidos'
      ],
      videoUrl: '/videos/comunicacao-interna.mp4',
      screenshot: '/images/comunicacao-interna.jpg',
      useCases: ['Restaurantes com múltiplas áreas', 'Cadeias de restaurantes', 'Restaurantes com equipe remota']
    },
    {
      icon: Settings,
      title: 'Gestão de Turnos',
      description: 'Organize escalas, controle de ponto e produtividade da equipe',
      category: 'Gestão de Equipe',
      color: 'from-cyan-500 to-blue-600',
      gradient: 'from-cyan-500/10 to-blue-600/10',
      features: ['Escalas Inteligentes', 'Controle de Ponto', 'Métricas de Produtividade'],
      detailedDescription: 'Organize escalas de trabalho de forma inteligente, controle ponto eletrônico e monitore a produtividade da equipe. O sistema sugere escalas otimizadas baseadas em histórico e demanda.',
      benefits: [
        'Escalas inteligentes baseadas em IA',
        'Controle de ponto integrado',
        'Métricas de produtividade em tempo real',
        'Integração com sistemas de RH'
      ],
      videoUrl: '/videos/gestao-turnos.mp4',
      screenshot: '/images/gestao-turnos.jpg',
      useCases: ['Restaurantes com múltiplos turnos', 'Cadeias de restaurantes', 'Restaurantes 24h']
    }
  ]

  const openFeatureModal = (index: number) => {
    setSelectedFeature(index)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedFeature(null)
  }

  return (
    <>

      {/* Feature Detail Modal */}
      {isModalOpen && selectedFeature !== null && (
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
                  <div className={`w-16 h-16 bg-gradient-to-r ${features[selectedFeature].color} rounded-2xl flex items-center justify-center`}>
                    {(() => {
                      const IconComponent = features[selectedFeature].icon
                      return <IconComponent className="w-8 h-8 text-white" />
                    })()}
                  </div>
                  <div>
                    <div className="inline-flex items-center space-x-2 bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-manrope font-medium mb-2">
                      <span>{features[selectedFeature].category}</span>
                    </div>
                    <h2 id="modal-title" className="text-2xl font-manrope font-bold text-gray-900">
                      {features[selectedFeature].title}
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
            <div 
              className="modal-content p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]"
              style={{ 
                overscrollBehavior: 'contain',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              {/* Description */}
              <div>
                <h3 className="text-lg font-manrope font-semibold text-gray-900 mb-3">Descrição Detalhada</h3>
                <p className="text-gray-600 font-manrope leading-relaxed">
                  {features[selectedFeature].detailedDescription}
                </p>
              </div>

              {/* Benefits */}
              <div>
                <h3 className="text-lg font-manrope font-semibold text-gray-900 mb-3">Principais Benefícios</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {features[selectedFeature].benefits.map((benefit, index) => (
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
                  {features[selectedFeature].useCases.map((useCase, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-manrope"
                    >
                      {useCase}
                    </span>
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
                    Interface da Funcionalidade
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-manrope font-semibold px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2">
                  <Play className="w-4 h-4" />
                </button>
                <button className="flex-1 border-2 border-blue-600 text-blue-600 font-manrope font-semibold px-6 py-3 rounded-xl hover:bg-blue-600 hover:text-white transition-all duration-300 flex items-center justify-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>Baixar PDF</span>
                </button>
              </div>

              {/* Additional Content to Ensure Scroll */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h4 className="text-lg font-manrope font-semibold text-gray-900 mb-3">
                  Informações Técnicas
                </h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <p><strong>Integração:</strong> API REST, Webhooks, SDKs</p>
                    <p><strong>Segurança:</strong> SSL/TLS, OAuth 2.0, JWT</p>
                    <p><strong>Performance:</strong> 99.9% uptime garantido</p>
                  </div>
                  <div>
                    <p><strong>Suporte:</strong> 24/7 via chat e telefone</p>
                    <p><strong>Documentação:</strong> Guias completos e vídeos</p>
                    <p><strong>Atualizações:</strong> Automáticas e gratuitas</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
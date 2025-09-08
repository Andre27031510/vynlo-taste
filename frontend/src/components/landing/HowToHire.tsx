'use client'

import { useState, useEffect } from 'react'
import { 
  MessageCircle,
  Calendar,
  FileText,
  CreditCard,
  Rocket,
  CheckCircle2,
  ArrowRight,
  Clock,
  Users,
  Zap
} from 'lucide-react'
import { logger } from '../../utils/logger'

export default function HowToHire() {
  const [activeStep, setActiveStep] = useState<number | null>(null)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  useEffect(() => {
    try {
      logger.componentMount('HowToHire')
    } catch (error) {
      logger.error('Erro ao inicializar HowToHire', error as Error)
    }
  }, [])

  const handleStepHover = (index: number) => {
    try {
      setActiveStep(index)
      logger.userInteraction('how_to_hire_step_hover', `step_${index}`)
    } catch (error) {
      logger.error('Erro ao registrar hover no step', error as Error)
    }
  }

  const handleCardHover = (index: number) => {
    try {
      setHoveredCard(index)
      logger.userInteraction('how_to_hire_card_hover', `card_${index}`)
    } catch (error) {
      logger.error('Erro ao registrar hover no card', error as Error)
    }
  }

  const steps = [
    {
      icon: MessageCircle,
      number: "01",
      title: "Primeiro Contato",
      subtitle: "Vamos nos conhecer",
      description: "Entre em contato conosco através do WhatsApp, formulário ou telefone. Nossa equipe comercial especializada irá entender suas necessidades específicas e apresentar as melhores soluções para o seu negócio.",
      duration: "15 minutos",
      color: "from-emerald-500 to-green-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      textColor: "text-emerald-600"
    },
    {
      icon: Calendar,
      number: "02", 
      title: "Reunião Estratégica",
      subtitle: "Planejamento personalizado",
      description: "Agendamos uma reunião técnica para mapear seus processos atuais, identificar oportunidades de melhoria e desenhar uma solução sob medida que maximize seus resultados e otimize sua operação.",
      duration: "45 minutos",
      color: "from-blue-500 to-cyan-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-600"
    },
    {
      icon: FileText,
      number: "03",
      title: "Proposta Técnica",
      subtitle: "Solução detalhada",
      description: "Elaboramos uma proposta técnica completa com escopo detalhado, cronograma de implementação, investimento transparente e demonstração prática da solução funcionando para o seu segmento.",
      duration: "2-3 dias",
      color: "from-purple-500 to-violet-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      textColor: "text-purple-600"
    },
    {
      icon: CreditCard,
      number: "04",
      title: "Contratação Simples",
      subtitle: "Processo ágil e seguro",
      description: "Assinatura digital do contrato, configuração inicial da plataforma e definição da equipe dedicada ao seu projeto. Processo 100% digital com máxima segurança jurídica e transparência total.",
      duration: "1 dia",
      color: "from-orange-500 to-red-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      textColor: "text-orange-600"
    },
    {
      icon: Rocket,
      number: "05",
      title: "Implementação",
      subtitle: "Seu sistema no ar",
      description: "Implementação completa com migração de dados, treinamento da equipe, testes de qualidade e go-live assistido. Acompanhamento 24/7 durante os primeiros 30 dias para garantir o sucesso total.",
      duration: "7-15 dias",
      color: "from-indigo-500 to-blue-600",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200",
      textColor: "text-indigo-600"
    }
  ]

  const benefits = [
    {
      icon: Clock,
      title: "Implementação Rápida",
      description: "Sistema funcionando em até 15 dias",
      color: "text-emerald-600"
    },
    {
      icon: Users,
      title: "Equipe Dedicada",
      description: "Time especializado para o seu projeto",
      color: "text-blue-600"
    },
    {
      icon: Zap,
      title: "Suporte Imediato",
      description: "Atendimento 24/7 nos primeiros 30 dias",
      color: "text-purple-600"
    }
  ]

  return (
    <section className="py-32 bg-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-100/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-emerald-100/20 to-blue-100/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 bg-blue-100 border border-blue-200 rounded-full px-6 py-3 mb-8">
            <Rocket className="w-5 h-5 text-blue-600" />
            <span className="text-blue-700 font-manrope font-semibold text-sm">
              Como Contratar a Vynlo Tech
            </span>
          </div>
          
          <h2 className="text-6xl lg:text-7xl font-manrope font-black text-gray-900 mb-8 leading-tight">
            Processo simples e
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600">
              totalmente transparente
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 font-manrope max-w-4xl mx-auto leading-relaxed">
            Em apenas 5 passos você terá a solução mais avançada do mercado funcionando no seu negócio. Processo ágil, seguro e com acompanhamento especializado
          </p>
        </div>

        {/* Steps Timeline */}
        <div className="relative mb-20">
          {/* Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-emerald-500 via-blue-500 via-purple-500 via-orange-500 to-indigo-500 rounded-full opacity-20"></div>
          
          <div className="space-y-16">
            {steps.map((step, index) => {
              const IconComponent = step.icon
              const isActive = activeStep === index
              const isLeft = index % 2 === 0
              
              return (
                <div
                  key={index}
                  onMouseEnter={() => handleStepHover(index)}
                  onMouseLeave={() => setActiveStep(null)}
                  className={`flex items-center ${isLeft ? 'flex-row' : 'flex-row-reverse'} group relative`}
                  style={{
                    animationDelay: `${index * 0.2}s`
                  }}
                >
                  {/* Step Content */}
                  <div className={`flex-1 ${isLeft ? 'pr-16' : 'pl-16'}`}>
                    <div className={`${step.bgColor} ${step.borderColor} border-2 rounded-3xl p-8 transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 cursor-pointer ${
                      isActive ? 'shadow-2xl border-opacity-100' : 'hover:shadow-xl border-opacity-50'
                    }`}>
                      {/* Step Header */}
                      <div className={`flex items-center gap-4 mb-6 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>
                        <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                          <IconComponent className="w-8 h-8 text-white" />
                        </div>
                        
                        <div className={`${isLeft ? 'text-left' : 'text-right'}`}>
                          <div className={`text-4xl font-black ${step.textColor} font-manrope mb-1`}>
                            {step.number}
                          </div>
                          <div className="text-gray-500 font-manrope text-sm font-medium">
                            {step.duration}
                          </div>
                        </div>
                      </div>

                      {/* Step Content */}
                      <div className={`${isLeft ? 'text-left' : 'text-right'}`}>
                        <h3 className="text-3xl font-manrope font-bold text-gray-900 mb-2">
                          {step.title}
                        </h3>
                        <p className={`${step.textColor} font-manrope font-semibold mb-4`}>
                          {step.subtitle}
                        </p>
                        <p className="text-gray-600 font-manrope leading-relaxed">
                          {step.description}
                        </p>
                      </div>

                      {/* Progress Indicator */}
                      <div className={`mt-6 flex items-center gap-2 ${isLeft ? 'justify-start' : 'justify-end'}`}>
                        <CheckCircle2 className={`w-5 h-5 ${step.textColor}`} />
                        <span className="text-gray-500 font-manrope text-sm">
                          Etapa {index + 1} de {steps.length}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Timeline Node */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 z-10">
                    <div className={`w-6 h-6 bg-gradient-to-br ${step.color} rounded-full border-4 border-white shadow-lg transform transition-all duration-300 ${
                      isActive ? 'scale-150' : 'group-hover:scale-125'
                    }`}></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Benefits Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon
            const isHovered = hoveredCard === index
            
            return (
              <div
                key={index}
                onMouseEnter={() => handleCardHover(index)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`bg-white border-2 border-gray-100 rounded-3xl p-8 text-center transform transition-all duration-500 hover:scale-105 hover:-translate-y-3 cursor-pointer ${
                  isHovered ? 'shadow-2xl border-gray-200' : 'hover:shadow-xl'
                }`}
              >
                <div className={`w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-6 mx-auto transform transition-all duration-300 ${
                  isHovered ? 'scale-110 rotate-6' : ''
                }`}>
                  <IconComponent className={`w-8 h-8 ${benefit.color}`} />
                </div>
                
                <h3 className="text-xl font-manrope font-bold text-gray-900 mb-3">
                  {benefit.title}
                </h3>
                
                <p className="text-gray-600 font-manrope">
                  {benefit.description}
                </p>
              </div>
            )
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 left-4 w-8 h-8 border-2 border-white rounded-lg"></div>
              <div className="absolute top-8 right-8 w-6 h-6 border-2 border-white rounded-full"></div>
              <div className="absolute bottom-8 left-8 w-4 h-4 bg-white rounded-full"></div>
              <div className="absolute bottom-4 right-4 w-10 h-10 border-2 border-white rounded-xl"></div>
            </div>
            
            <div className="relative z-10">
              <h3 className="text-4xl font-manrope font-bold mb-4">
                Pronto para começar sua transformação digital?
              </h3>
              <p className="text-xl font-manrope mb-8 opacity-90">
                Fale conosco agora e receba uma proposta personalizada em até 24 horas
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button className="bg-white text-blue-600 font-manrope font-bold px-8 py-4 rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Falar no WhatsApp
                </button>
                
                <button className="bg-transparent border-2 border-white text-white font-manrope font-bold px-8 py-4 rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Agendar Reunião
                </button>
              </div>
              
              <div className="mt-8 flex items-center justify-center gap-8 text-sm opacity-80">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Sem compromisso</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Resposta em 24h</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Consultoria gratuita</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
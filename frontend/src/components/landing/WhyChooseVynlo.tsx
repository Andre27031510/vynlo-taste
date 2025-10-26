'use client'

import { useState, useEffect } from 'react'
import { 
  Award,
  TrendingUp,
  Users,
  Headphones,
  Rocket
} from 'lucide-react'
import { logger } from '../../utils/logger'

export default function WhyChooseVynlo() {
  const [activeCard, setActiveCard] = useState<number | null>(null)

  useEffect(() => {
    try {
      logger.componentMount('WhyChooseVynlo')
    } catch (error) {
      logger.error('Erro ao inicializar WhyChooseVynlo', error as Error)
    }
  }, [])

  const handleCardHover = (index: number) => {
    try {
      setActiveCard(index)
      logger.userInteraction('why_choose_card_hover', `card_${index}`)
    } catch (error) {
      logger.error('Erro ao registrar hover no card', error as Error)
    }
  }

  const reasons = [
    {
      icon: Award,
      title: "Excelência Comprovada",
      description: "Mais de 5 anos de experiência no mercado com soluções que transformaram milhares de negócios. Nossa expertise é reconhecida por clientes em todo o Brasil, com resultados mensuráveis e impacto real no crescimento empresarial.",
      stats: "98% de satisfação dos clientes"
    },
    {
      icon: TrendingUp,
      title: "Crescimento Garantido",
      description: "Nossos clientes experimentam em média 200% de aumento na produtividade e 60% de redução nos custos operacionais. Tecnologia que realmente impacta o resultado final do seu negócio com ROI comprovado.",
      stats: "+200% de produtividade média"
    },
    {
      icon: Users,
      title: "Equipe Especializada",
      description: "Time de desenvolvedores sênior, arquitetos de software e especialistas em UX/UI dedicados ao seu sucesso. Metodologia ágil, entregas rápidas e acompanhamento personalizado em cada etapa do projeto.",
      stats: "50+ especialistas dedicados"
    },
    {
      icon: Headphones,
      title: "Suporte Premium 24/7",
      description: "Atendimento especializado disponível 24 horas por dia, 7 dias por semana. Tempo médio de resposta inferior a 2 horas, com resolução prioritária para questões críticas e suporte técnico avançado.",
      stats: "< 2h tempo de resposta"
    },
    {
      icon: Rocket,
      title: "Inovação Constante",
      description: "Investimos continuamente em pesquisa e desenvolvimento, mantendo nossa plataforma sempre na vanguarda tecnológica. Atualizações regulares, novas funcionalidades e integração com as mais recentes tendências do mercado.",
      stats: "Atualizações mensais garantidas"
    }
  ]

  return (
    <section className="py-32 bg-gradient-to-br from-slate-900 via-blue-900 to-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 bg-blue-500/20 border border-blue-400/30 rounded-full px-6 py-3 mb-8">
            <Award className="w-5 h-5 text-blue-400" />
            <span className="text-blue-300 font-manrope font-semibold text-sm">
              Por que escolher a Vynlo?
            </span>
          </div>
          
          <h2 className="text-6xl lg:text-7xl font-manrope font-black text-white mb-8 leading-tight">
            A escolha certa para
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400">
              o seu sucesso
            </span>
          </h2>
          
          <p className="text-xl text-gray-300 font-manrope max-w-4xl mx-auto leading-relaxed">
            Descubra por que milhares de empresas confiam na Vynlo para transformar seus negócios e alcançar resultados extraordinários
          </p>
        </div>

        {/* Reasons Cards */}
        <div className="space-y-12 md:space-y-20">
          {reasons.map((reason, index) => {
            const IconComponent = reason.icon
            const isLeft = index % 2 === 0
            
            return (
              <div
                key={index}
                onMouseEnter={() => handleCardHover(index)}
                onMouseLeave={() => setActiveCard(null)}
                className={`flex flex-col md:flex-row items-center gap-8 md:gap-16 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} group`}
                style={{
                  animationDelay: `${index * 0.2}s`
                }}
              >
                {/* Card */}
                <div className="flex-shrink-0 w-full md:w-80">
                  <div className={`relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:border-blue-400/50 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 cursor-pointer ${
                    activeCard === index ? 'shadow-2xl shadow-blue-500/25 border-blue-400/50' : 'hover:shadow-xl'
                  }`}>
                    {/* Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
                    
                    {/* Content */}
                    <div className="relative z-10 text-center">
                      {/* Icon */}
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 mx-auto transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                        <IconComponent className="w-10 h-10 text-white" />
                      </div>

                      {/* Stats */}
                      <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mb-6 border border-white/10">
                        <div className="text-2xl font-black text-white font-manrope mb-1">
                          {reason.stats}
                        </div>
                        <div className="text-blue-300 font-manrope text-sm font-medium">
                          Resultado comprovado
                        </div>
                      </div>

                      {/* Floating Elements */}
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 animate-bounce shadow-lg"></div>
                      <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-gradient-to-r from-purple-400 to-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse shadow-lg"></div>
                    </div>
                  </div>
                </div>

                {/* Explanation */}
                <div className="flex-1">
                  <h3 className="text-2xl md:text-4xl font-manrope font-black text-white mb-6 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 transition-all duration-300">
                    {reason.title}
                  </h3>
                  
                  <p className="text-base md:text-lg text-gray-300 font-manrope leading-relaxed mb-8">
                    {reason.description}
                  </p>


                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-20">
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-lg rounded-3xl p-12 border border-white/20">
            <h3 className="text-4xl font-manrope font-bold text-white mb-4">
              Pronto para transformar seu negócio?
            </h3>
            <p className="text-xl text-gray-300 font-manrope mb-8 opacity-90">
              Junte-se a milhares de empresas que já escolheram a excelência
            </p>
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-manrope font-bold px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
              Começar Agora
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
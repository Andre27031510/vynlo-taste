'use client'

import { useState, useEffect } from 'react'
import { 
  Target,
  Eye,
  Heart,
  Lightbulb,
  Shield,
  Users,
  Zap,
  Award
} from 'lucide-react'
import { logger } from '../../utils/logger'

export default function MissionVisionValues() {
  const [activeCard, setActiveCard] = useState<number | null>(null)

  useEffect(() => {
    try {
      logger.componentMount('MissionVisionValues')
    } catch (error) {
      logger.error('Erro ao inicializar MissionVisionValues', error as Error)
    }
  }, [])

  const handleCardHover = (index: number | null) => {
    try {
      setActiveCard(index)
      if (index !== null) {
        logger.userInteraction('mvv_card_hover', `card_${index}`)
      }
    } catch (error) {
      logger.error('Erro ao registrar hover no card MVV', error as Error)
    }
  }

  const mvv = [
    {
      icon: Target,
      title: 'Missão',
      subtitle: 'Nosso propósito',
      description: 'Democratizar a tecnologia empresarial, oferecendo soluções inovadoras e acessíveis que transformem negócios de todos os tamanhos em empresas digitalmente inteligentes e competitivas.',
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      icon: Eye,
      title: 'Visão',
      subtitle: 'Onde queremos chegar',
      description: 'Ser a principal plataforma de gestão empresarial da América Latina até 2030, reconhecida pela excelência em inovação, qualidade de serviço e impacto positivo na transformação digital.',
      color: 'from-purple-500 to-violet-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      icon: Heart,
      title: 'Valores',
      subtitle: 'O que nos move',
      description: 'Inovação constante, transparência total, foco no cliente, excelência técnica, responsabilidade social e crescimento sustentável. Acreditamos que a tecnologia deve servir às pessoas.',
      color: 'from-emerald-500 to-green-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200'
    }
  ]

  const principles = [
    {
      icon: Lightbulb,
      title: 'Inovação',
      description: 'Sempre na vanguarda tecnológica'
    },
    {
      icon: Shield,
      title: 'Confiança',
      description: 'Segurança e transparência em tudo'
    },
    {
      icon: Users,
      title: 'Colaboração',
      description: 'Sucesso construído em parceria'
    },
    {
      icon: Zap,
      title: 'Agilidade',
      description: 'Respostas rápidas e eficientes'
    }
  ]

  return (
    <section 
      data-section="mvv" 
      className="py-32 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 relative overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 bg-blue-100 border border-blue-200 rounded-full px-6 py-3 mb-8">
            <Award className="w-5 h-5 text-blue-600" />
            <span className="text-blue-700 font-manrope font-semibold text-sm">
              Nossos Pilares
            </span>
          </div>
          
          <h2 className="text-6xl lg:text-7xl font-manrope font-black text-gray-900 mb-8 leading-tight">
            Missão, Visão e
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600">
              Valores
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 font-manrope max-w-4xl mx-auto leading-relaxed">
            Os princípios fundamentais que guiam cada decisão e definem nossa identidade como empresa de tecnologia
          </p>
        </div>

        {/* MVV Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {mvv.map((item, index) => {
            const IconComponent = item.icon
            const isActive = activeCard === index
            
            return (
              <div
                key={index}
                onMouseEnter={() => handleCardHover(index)}
                onMouseLeave={() => handleCardHover(null)}
                className={`${item.bgColor} ${item.borderColor} border-2 rounded-3xl p-8 transform transition-all duration-500 hover:scale-105 hover:-translate-y-3 cursor-pointer ${
                  isActive ? 'shadow-2xl border-opacity-100' : 'hover:shadow-xl border-opacity-50'
                }`}
                style={{
                  animationDelay: `${index * 0.2}s`
                }}
              >
                {/* Icon */}
                <div className={`w-20 h-20 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mb-6 transform transition-all duration-300 ${
                  isActive ? 'scale-110 rotate-6' : 'group-hover:scale-110 group-hover:rotate-6'
                } shadow-lg`}>
                  <IconComponent className="w-10 h-10 text-white" />
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-3xl font-manrope font-black text-gray-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-blue-600 font-manrope font-semibold text-sm">
                      {item.subtitle}
                    </p>
                  </div>
                  
                  <p className="text-gray-700 font-manrope leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Floating Elements */}
                <div className={`absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r ${item.color} rounded-full opacity-0 transition-all duration-300 animate-bounce shadow-lg ${
                  isActive ? 'opacity-100' : ''
                }`}></div>
                <div className={`absolute -bottom-2 -left-2 w-4 h-4 bg-gradient-to-r ${item.color} rounded-full opacity-0 transition-all duration-500 animate-pulse shadow-lg ${
                  isActive ? 'opacity-100' : ''
                }`}></div>
              </div>
            )
          })}
        </div>

        {/* Principles */}
        <div className="bg-white rounded-3xl p-12 shadow-xl border border-gray-100">
          <h3 className="text-4xl font-manrope font-bold text-gray-900 text-center mb-12">
            Nossos Princípios Fundamentais
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {principles.map((principle, index) => {
              const IconComponent = principle.icon
              return (
                <div 
                  key={index}
                  className="text-center group cursor-pointer transform hover:scale-110 transition-all duration-300"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4 group-hover:bg-blue-200 transition-all duration-300 transform group-hover:rotate-6">
                    <IconComponent className="w-8 h-8 text-blue-600" />
                  </div>
                  <h4 className="text-xl font-manrope font-bold text-gray-900 mb-2">
                    {principle.title}
                  </h4>
                  <p className="text-gray-600 font-manrope text-sm">
                    {principle.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
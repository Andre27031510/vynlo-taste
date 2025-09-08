'use client'

import { useState, useEffect } from 'react'
import { 
  Calendar,
  Users,
  Rocket,
  Award,
  Building2,
  TrendingUp,
  Globe,
  Zap
} from 'lucide-react'
import { logger } from '../../utils/logger'

export default function OurHistory() {
  const [activeYear, setActiveYear] = useState<number | null>(null)

  useEffect(() => {
    try {
      logger.componentMount('OurHistory')
    } catch (error) {
      logger.error('Erro ao inicializar OurHistory', error as Error)
    }
  }, [])

  const handleYearHover = (index: number | null) => {
    try {
      setActiveYear(index)
      if (index !== null) {
        logger.userInteraction('timeline_hover', `year_${index}`)
      }
    } catch (error) {
      logger.error('Erro ao registrar hover na timeline', error as Error)
    }
  }

  const timeline = [
    {
      year: '2019',
      title: 'Fundação da Vynlo',
      description: 'Nascemos com o sonho de democratizar a tecnologia para pequenos e médios negócios. Primeiros clientes no setor gastronômico.',
      icon: Rocket,
      color: 'from-blue-500 to-cyan-600',
      stats: '5 clientes iniciais'
    },
    {
      year: '2020',
      title: 'Expansão Digital',
      description: 'Pandemia acelerou nossa missão. Desenvolvemos soluções para delivery e gestão remota, ajudando negócios a se adaptarem.',
      icon: Globe,
      color: 'from-emerald-500 to-green-600',
      stats: '200+ restaurantes'
    },
    {
      year: '2021',
      title: 'Crescimento Exponencial',
      description: 'Lançamento da plataforma multi-segmento. Expandimos para barbearias, petshops e outros setores de serviços.',
      icon: TrendingUp,
      color: 'from-purple-500 to-violet-600',
      stats: '1.000+ clientes'
    },
    {
      year: '2022',
      title: 'Inovação com IA',
      description: 'Integração de inteligência artificial e machine learning. Lançamento do Vynlo Bot para automação de atendimento.',
      icon: Zap,
      color: 'from-orange-500 to-red-600',
      stats: '2.500+ empresas'
    },
    {
      year: '2023',
      title: 'Reconhecimento Nacional',
      description: 'Prêmios de inovação tecnológica. Expansão para 50+ cidades brasileiras com equipe de 50+ especialistas.',
      icon: Award,
      color: 'from-indigo-500 to-blue-600',
      stats: '5.000+ clientes ativos'
    },
    {
      year: '2024',
      title: 'Futuro em Construção',
      description: 'Expansão internacional planejada. Novas soluções em desenvolvimento para revolucionar ainda mais o mercado.',
      icon: Building2,
      color: 'from-pink-500 to-rose-600',
      stats: 'Crescimento contínuo'
    }
  ]

  return (
    <section 
      data-section="history" 
      className="py-32 bg-white relative overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-100/30 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 bg-blue-100 border border-blue-200 rounded-full px-6 py-3 mb-8">
            <Calendar className="w-5 h-5 text-blue-600" />
            <span className="text-blue-700 font-manrope font-semibold text-sm">
              Nossa Jornada
            </span>
          </div>
          
          <h2 className="text-6xl lg:text-7xl font-manrope font-black text-gray-900 mb-8 leading-tight">
            Uma história de
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600">
              inovação e crescimento
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 font-manrope max-w-4xl mx-auto leading-relaxed">
            Desde 2019, construímos uma trajetória sólida de transformação digital, sempre focados em entregar valor real para nossos clientes
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-500 via-purple-500 via-emerald-500 via-orange-500 via-indigo-500 to-pink-500 rounded-full opacity-20"></div>
          
          <div className="space-y-16">
            {timeline.map((item, index) => {
              const IconComponent = item.icon
              const isActive = activeYear === index
              const isLeft = index % 2 === 0
              
              return (
                <div
                  key={index}
                  onMouseEnter={() => handleYearHover(index)}
                  onMouseLeave={() => handleYearHover(null)}
                  className={`flex items-center ${isLeft ? 'flex-row' : 'flex-row-reverse'} group relative`}
                  style={{
                    animationDelay: `${index * 0.2}s`
                  }}
                >
                  {/* Content */}
                  <div className={`flex-1 ${isLeft ? 'pr-16' : 'pl-16'}`}>
                    <div className={`bg-white border-2 border-gray-100 rounded-3xl p-8 transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 cursor-pointer ${
                      isActive ? 'shadow-2xl border-blue-200' : 'hover:shadow-xl'
                    }`}>
                      {/* Year Badge */}
                      <div className={`inline-flex items-center gap-3 mb-6 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>
                        <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                          <IconComponent className="w-8 h-8 text-white" />
                        </div>
                        
                        <div className={`${isLeft ? 'text-left' : 'text-right'}`}>
                          <div className="text-4xl font-black text-gray-900 font-manrope mb-1">
                            {item.year}
                          </div>
                          <div className="text-blue-600 font-manrope text-sm font-medium">
                            {item.stats}
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className={`${isLeft ? 'text-left' : 'text-right'}`}>
                        <h3 className="text-3xl font-manrope font-bold text-gray-900 mb-4">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 font-manrope leading-relaxed text-lg">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Timeline Node */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 z-10">
                    <div className={`w-6 h-6 bg-gradient-to-br ${item.color} rounded-full border-4 border-white shadow-lg transform transition-all duration-300 ${
                      isActive ? 'scale-150' : 'group-hover:scale-125'
                    }`}></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20">
          {[
            { value: '5+', label: 'Anos de Mercado', icon: Calendar },
            { value: '5.000+', label: 'Clientes Ativos', icon: Users },
            { value: '50+', label: 'Cidades Atendidas', icon: Globe },
            { value: '98%', label: 'Satisfação', icon: Award }
          ].map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <div 
                key={index}
                className="text-center group cursor-pointer transform hover:scale-110 transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4 group-hover:bg-blue-200 transition-all duration-300">
                  <IconComponent className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-4xl font-manrope font-black text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-manrope font-medium">
                  {stat.label}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
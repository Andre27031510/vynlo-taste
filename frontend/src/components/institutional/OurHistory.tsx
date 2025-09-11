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
          
          <h2 className="text-4xl lg:text-5xl font-manrope font-black text-gray-900 mb-8 leading-tight">
            Uma história de
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600">
              inovação e crescimento
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 font-manrope max-w-4xl mx-auto leading-relaxed">
            Desde 2019, construímos uma trajetória sólida de transformação digital, sempre focados em entregar valor real para nossos clientes
          </p>
        </div>

        {/* Team Banner */}
        <div className="mb-20">
          <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 overflow-hidden">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl font-manrope font-bold text-white mb-6">
                  Nossa Equipe Especializada
                </h3>
                <p className="text-xl text-white/90 font-manrope leading-relaxed mb-8">
                  Mais de 50 profissionais dedicados, incluindo desenvolvedores sênior, arquitetos de software, designers UX/UI e especialistas em negócios, trabalhando juntos para criar soluções inovadoras.
                </p>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-black text-white font-manrope">50+</div>
                    <div className="text-white/80 font-manrope text-sm">Especialistas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-black text-white font-manrope">5+</div>
                    <div className="text-white/80 font-manrope text-sm">Anos Experiência</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-black text-white font-manrope">24/7</div>
                    <div className="text-white/80 font-manrope text-sm">Suporte</div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Equipe Vynlo Tech" 
                  className="rounded-2xl shadow-2xl w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Journey Text */}
        <div className="space-y-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h3 className="text-3xl font-manrope font-bold text-gray-900">
                2019-2021: Fundação e Crescimento
              </h3>
              <p className="text-lg text-gray-600 font-manrope leading-relaxed">
                Nascemos em 2019 com o sonho de democratizar a tecnologia para pequenos e médios negócios. A pandemia acelerou nossa missão, desenvolvendo soluções para delivery e gestão remota. Em 2021, lançamos nossa plataforma multi-segmento, expandindo para barbearias, petshops e outros setores.
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-black text-blue-600 font-manrope mb-2">1.000+</div>
                  <div className="text-gray-600 font-manrope">Clientes em 2021</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-black text-purple-600 font-manrope mb-2">5</div>
                  <div className="text-gray-600 font-manrope">Segmentos Atendidos</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-2xl p-8 lg:order-1">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-black text-emerald-600 font-manrope mb-2">5.000+</div>
                  <div className="text-gray-600 font-manrope">Clientes Ativos</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-black text-blue-600 font-manrope mb-2">50+</div>
                  <div className="text-gray-600 font-manrope">Cidades</div>
                </div>
              </div>
            </div>
            <div className="space-y-6 lg:order-2">
              <h3 className="text-3xl font-manrope font-bold text-gray-900">
                2022-2024: Inovação e Reconhecimento
              </h3>
              <p className="text-lg text-gray-600 font-manrope leading-relaxed">
                Integramos inteligência artificial com o lançamento do Vynlo Bot. Recebemos prêmios de inovação tecnológica e expandimos para 50+ cidades brasileiras. Hoje, atendemos mais de 5.000 clientes ativos com uma equipe de 50+ especialistas.
              </p>
            </div>
          </div>
        </div>


      </div>
    </section>
  )
}
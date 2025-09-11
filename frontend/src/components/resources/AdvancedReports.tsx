'use client'

import { useState, useEffect } from 'react'
import { 
  BarChart3,
  TrendingUp,
  PieChart,
  Calendar,
  Download,
  Filter,
  Eye,
  Target
} from 'lucide-react'
import { logger } from '../../utils/logger'

export default function AdvancedReports() {
  const [activeReport, setActiveReport] = useState<number | null>(null)

  useEffect(() => {
    logger.componentMount('AdvancedReports')
  }, [])

  const reports = [
    {
      icon: TrendingUp,
      title: 'Relatórios de Vendas Inteligentes',
      description: 'Análise completa das suas vendas com previsões, tendências e oportunidades de crescimento identificadas automaticamente.',
      features: ['Previsão de vendas', 'Análise de tendências', 'Produtos mais vendidos', 'Horários de pico']
    },
    {
      icon: PieChart,
      title: 'Dashboard Financeiro Executivo',
      description: 'Visão completa da saúde financeira do seu negócio: receitas, custos, margem de lucro e fluxo de caixa em tempo real.',
      features: ['Fluxo de caixa', 'Margem de lucro', 'Custos detalhados', 'Projeções financeiras']
    },
    {
      icon: BarChart3,
      title: 'Análise de Performance da Equipe',
      description: 'Acompanhe a produtividade da sua equipe, identifique top performers e otimize escalas para máxima eficiência.',
      features: ['Produtividade individual', 'Ranking de vendedores', 'Horas trabalhadas', 'Metas vs Resultados']
    }
  ]

  return (
    <section 
      data-section="advanced-reports" 
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
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <span className="text-blue-700 font-manrope font-semibold text-sm">
              Relatórios Avançados
            </span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-manrope font-black text-gray-900 mb-8 leading-tight">
            Decisões baseadas em
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600">
              dados inteligentes
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 font-manrope max-w-4xl mx-auto leading-relaxed">
            Transforme dados em insights poderosos. Relatórios automáticos que mostram exatamente onde seu negócio está ganhando ou perdendo dinheiro.
          </p>
        </div>

        {/* Reports Grid */}
        <div className="space-y-12 mb-20">
          {reports.map((report, index) => {
            const IconComponent = report.icon
            const isLeft = index % 2 === 0
            
            return (
              <div
                key={index}
                className={`grid lg:grid-cols-2 gap-12 items-center ${!isLeft ? 'lg:grid-flow-col-dense' : ''}`}
              >
                <div className={`space-y-6 ${!isLeft ? 'lg:col-start-2' : ''}`}>
                  <div className={`w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg`}>
                    <IconComponent className="w-10 h-10 text-white" />
                  </div>
                  
                  <h3 className="text-3xl font-manrope font-bold text-gray-900">
                    {report.title}
                  </h3>
                  
                  <p className="text-lg text-gray-600 font-manrope leading-relaxed">
                    {report.description}
                  </p>

                  <div className="space-y-3">
                    {report.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
                        <span className="text-gray-700 font-manrope">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`relative ${!isLeft ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 shadow-xl">
                    {/* Mock Chart */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-manrope font-bold text-gray-900">Exemplo de Relatório</h4>
                        <div className="flex items-center gap-2">
                          <Filter className="w-4 h-4 text-gray-500" />
                          <Download className="w-4 h-4 text-gray-500" />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white rounded-xl p-4 text-center">
                          <div className="text-2xl font-black text-blue-600 font-manrope">+25%</div>
                          <div className="text-gray-600 font-manrope text-sm">Vendas</div>
                        </div>
                        <div className="bg-white rounded-xl p-4 text-center">
                          <div className="text-2xl font-black text-emerald-600 font-manrope">R$ 45k</div>
                          <div className="text-gray-600 font-manrope text-sm">Receita</div>
                        </div>
                        <div className="bg-white rounded-xl p-4 text-center">
                          <div className="text-2xl font-black text-purple-600 font-manrope">18%</div>
                          <div className="text-gray-600 font-manrope text-sm">Margem</div>
                        </div>
                      </div>
                      
                      {/* Mock Chart Bars */}
                      <div className="space-y-3 mt-6">
                        {[85, 92, 78, 95, 88].map((value, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <span className="text-sm text-gray-600 font-manrope w-12">Sem {i+1}</span>
                            <div className="flex-1 bg-gray-200 rounded-full h-3">
                              <div 
                                className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-1000"
                                style={{ width: `${value}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600 font-manrope w-8">{value}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: Eye, title: 'Tempo Real', desc: 'Dados atualizados instantaneamente' },
            { icon: Download, title: 'Exportação', desc: 'PDF, Excel, CSV disponíveis' },
            { icon: Calendar, title: 'Agendamento', desc: 'Relatórios automáticos por email' },
            { icon: Target, title: 'Personalização', desc: 'Relatórios sob medida' }
          ].map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <div 
                key={index}
                className="text-center group cursor-pointer transform hover:scale-110 transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4 group-hover:bg-blue-200 transition-all duration-300">
                  <IconComponent className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="text-lg font-manrope font-bold text-gray-900 mb-2">
                  {feature.title}
                </h4>
                <p className="text-gray-600 font-manrope text-sm">
                  {feature.desc}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
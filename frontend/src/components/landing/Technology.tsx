'use client'

import { useState, useEffect } from 'react'
import { 
  Shield, 
  Zap, 
  Cloud, 
  Smartphone, 
  Database,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Cpu,
  Lock,
  Globe,
  Rocket
} from 'lucide-react'
import { logger } from '../../utils/logger'

export default function Technology() {
  const [activeCard, setActiveCard] = useState<number | null>(null)

  useEffect(() => {
    try {
      logger.componentMount('Technology')
    } catch (error) {
      logger.error('Erro ao inicializar Technology', error as Error)
    }
  }, [])

  const handleCardHover = (index: number) => {
    try {
      setActiveCard(index)
      logger.userInteraction('technology_card_hover', `card_${index}`)
    } catch (error) {
      logger.error('Erro ao registrar hover no card de tecnologia', error as Error)
    }
  }

  const technologies = [
    {
      icon: Shield,
      title: "Segurança Bancária",
      description: "Criptografia SSL 256-bits e conformidade PCI DSS para máxima proteção dos seus dados financeiros e informações sensíveis.",
      color: "from-emerald-500 to-green-600",
      bgColor: "bg-emerald-50",
      iconBg: "bg-emerald-100",
      textColor: "text-emerald-600",
      features: ["SSL 256-bits", "PCI DSS Certificado", "Backup Automático", "Auditoria Completa"],
      metrics: { security: "100%", compliance: "PCI DSS", encryption: "256-bit" }
    },
    {
      icon: Zap,
      title: "Performance Ultra-Rápida",
      description: "Infraestrutura otimizada com CDN global e cache inteligente para velocidade máxima em qualquer lugar do mundo.",
      color: "from-amber-500 to-orange-600",
      bgColor: "bg-amber-50",
      iconBg: "bg-amber-100",
      textColor: "text-amber-600",
      features: ["CDN Global", "Cache Inteligente", "99.9% Uptime", "Load Balancing"],
      metrics: { uptime: "99.9%", latency: "<50ms", speed: "10x" }
    },
    {
      icon: Cloud,
      title: "Cloud AWS",
      description: "Hospedado na Amazon Web Services com escalabilidade automática, alta disponibilidade e disaster recovery.",
      color: "from-blue-500 to-cyan-600",
      bgColor: "bg-blue-50",
      iconBg: "bg-blue-100",
      textColor: "text-blue-600",
      features: ["Escalonamento automático", "Múltiplas regiões", "Recuperação de desastres", "Monitoramento 24/7"],
      metrics: { regions: "12+", scaling: "Auto", availability: "99.99%" }
    },
    {
      icon: Smartphone,
      title: "Mobile First",
      description: "Interface responsiva e aplicativo nativo para iOS e Android, permitindo gestão completa de qualquer lugar.",
      color: "from-purple-500 to-pink-600",
      bgColor: "bg-purple-50",
      iconBg: "bg-purple-100",
      textColor: "text-purple-600",
      features: ["App iOS/Android", "PWA Avançado", "Modo offline", "Sincronização automática"],
      metrics: { platforms: "3+", offline: "100%", sync: "Real Time" }
    },
    {
      icon: Database,
      title: "Big Data Analytics",
      description: "Inteligência artificial avançada com machine learning para análises preditivas e insights automáticos do negócio.",
      color: "from-indigo-500 to-purple-600",
      bgColor: "bg-indigo-50",
      iconBg: "bg-indigo-100",
      textColor: "text-indigo-600",
      features: ["IA Preditiva", "Machine Learning", "Insights Automáticos", "Análise Comportamental"],
      metrics: { accuracy: "95%", predictions: "Real Time", models: "50+" }
    },
    {
      icon: BarChart3,
      title: "Relatórios Inteligentes",
      description: "Dashboards interativos com métricas em tempo real, exportação automática e visualizações avançadas.",
      color: "from-rose-500 to-pink-600",
      bgColor: "bg-rose-50",
      iconBg: "bg-rose-100",
      textColor: "text-rose-600",
      features: ["Tempo real", "Exportação automática", "Painéis personalizados", "Alertas inteligentes"],
      metrics: { reports: "100+", realtime: "24/7", formats: "10+" }
    }
  ]

  return (
    <section className="py-32 bg-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-100/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-100/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-emerald-100/20 to-blue-100/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 bg-blue-100 border border-blue-200 rounded-full px-6 py-3 mb-8">
            <Cpu className="w-5 h-5 text-blue-600" />
            <span className="text-blue-700 font-manrope font-semibold text-sm">
              Tecnologia de Ponta
            </span>
          </div>
          
          <h2 className="text-6xl lg:text-7xl font-manrope font-black text-gray-900 mb-8 leading-tight">
            Construído com as
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600">
              melhores tecnologias
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 font-manrope max-w-4xl mx-auto leading-relaxed">
            Stack moderna e robusta para garantir performance excepcional, segurança bancária e escalabilidade ilimitada para o seu negócio
          </p>
        </div>

        {/* Technology Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {technologies.map((tech, index) => {
            const IconComponent = tech.icon
            const isActive = activeCard === index
            
            return (
              <div
                key={index}
                onMouseEnter={() => handleCardHover(index)}
                onMouseLeave={() => setActiveCard(null)}
                className={`group relative ${tech.bgColor} rounded-3xl p-8 border-2 border-gray-100 hover:border-gray-200 transition-all duration-500 transform hover:scale-105 hover:-translate-y-3 cursor-pointer ${
                  isActive ? 'shadow-2xl shadow-gray-200 z-10' : 'hover:shadow-xl'
                }`}
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${tech.color} rounded-3xl opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`w-20 h-20 ${tech.iconBg} rounded-2xl flex items-center justify-center mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                    <IconComponent className={`w-10 h-10 ${tech.textColor}`} />
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-manrope font-bold text-gray-900 mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-gray-900 group-hover:to-gray-700 transition-all duration-300">
                    {tech.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 font-manrope leading-relaxed mb-6">
                    {tech.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-3 mb-6">
                    {tech.features.map((feature, featureIndex) => (
                      <div 
                        key={featureIndex}
                        className="flex items-center space-x-3 transform translate-x-0 group-hover:translate-x-2 transition-transform duration-300"
                        style={{ transitionDelay: `${featureIndex * 0.1}s` }}
                      >
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                        <span className="text-gray-700 font-manrope text-sm font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-3 mb-6 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-100">
                    {Object.entries(tech.metrics).map(([key, value], metricIndex) => (
                      <div key={metricIndex} className="text-center">
                        <div className={`text-lg font-bold ${tech.textColor} font-manrope`}>{value}</div>
                        <div className="text-xs text-gray-500 font-manrope capitalize">{key}</div>
                      </div>
                    ))}
                  </div>

                  {/* Learn More */}
                  <div className={`flex items-center space-x-2 ${tech.textColor} font-manrope font-semibold opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300`}>
                    <span>Saiba mais</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>

                {/* Floating Elements */}
                <div className={`absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r ${tech.color} rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 animate-bounce shadow-lg`}></div>
                <div className={`absolute -bottom-2 -left-2 w-4 h-4 bg-gradient-to-r ${tech.color} rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse shadow-lg`}></div>
              </div>
            )
          })}
        </div>

        {/* Bottom Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: "99.9%", label: "Disponibilidade", icon: Zap, color: "text-emerald-600", bg: "bg-emerald-100" },
            { value: "<50ms", label: "Latência", icon: Rocket, color: "text-blue-600", bg: "bg-blue-100" },
            { value: "256-bit", label: "Criptografia", icon: Lock, color: "text-purple-600", bg: "bg-purple-100" },
            { value: "12+", label: "Regiões AWS", icon: Globe, color: "text-orange-600", bg: "bg-orange-100" }
          ].map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <div 
                key={index}
                className="text-center group cursor-pointer transform hover:scale-110 transition-all duration-300"
              >
                <div className={`inline-flex items-center justify-center w-20 h-20 ${stat.bg} rounded-2xl mb-4 group-hover:shadow-lg transition-all duration-300 transform group-hover:rotate-6`}>
                  <IconComponent className={`w-8 h-8 ${stat.color}`} />
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
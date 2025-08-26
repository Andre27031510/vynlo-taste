'use client'

import { useState } from 'react'
import { 
  Shield, 
  Zap, 
  Cloud, 
  Smartphone, 
  Database,
  Lock,
  BarChart3,
  Wifi,
  CheckCircle2,
  ArrowRight,
  Clock,
  Eye,
  MessageCircle,
  Camera,
  Share2
} from 'lucide-react'

export default function TechStack() {
  const [activeCard, setActiveCard] = useState<number | null>(null)

  const technologies = [
    {
      icon: Shield,
      title: "Segurança Bancária",
      description: "Criptografia SSL 256-bits e conformidade PCI DSS para máxima proteção dos seus dados",
      color: "from-green-500 to-emerald-600",
      features: ["SSL 256-bits", "PCI DSS", "Backup Automático"]
    },
    {
      icon: Zap,
      title: "Performance Ultra-Rápida",
      description: "Infraestrutura otimizada com CDN global para velocidade máxima em qualquer lugar",
      color: "from-yellow-500 to-orange-600",
      features: ["CDN Global", "Cache Inteligente", "99.9% Uptime"]
    },
    {
      icon: Cloud,
      title: "Cloud AWS",
      description: "Hospedado na Amazon Web Services com escalabilidade automática e alta disponibilidade",
      color: "from-blue-500 to-cyan-600",
      features: ["Auto-scaling", "Multi-região", "Disaster Recovery"]
    },
    {
      icon: Smartphone,
      title: "Mobile First",
      description: "Interface responsiva e app nativo para gerenciar seu restaurante de qualquer lugar",
      color: "from-purple-500 to-pink-600",
      features: ["App iOS/Android", "PWA", "Offline Mode"]
    },
    {
      icon: Database,
      title: "Big Data Analytics",
      description: "Inteligência artificial para análises preditivas e insights automáticos do seu negócio",
      color: "from-indigo-500 to-purple-600",
      features: ["IA Preditiva", "Machine Learning", "Insights Automáticos"]
    },
    {
      icon: BarChart3,
      title: "Relatórios Inteligentes",
      description: "Dashboards interativos com métricas em tempo real e exportação automática",
      color: "from-red-500 to-pink-600",
      features: ["Tempo Real", "Export Automático", "Dashboards Personalizados"]
    }
  ]

  return (
    <section className="py-24 bg-gradient-to-br from-vynlo-dark via-gray-900 to-black relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-purple-400 rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-green-400 rounded-full animate-bounce"></div>
        <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-6">
            <Wifi className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 font-manrope font-medium text-sm">
              Tecnologia de Ponta
            </span>
          </div>
          
          <h2 className="text-5xl lg:text-6xl font-manrope font-bold text-white mb-6">
            Construído com as
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              melhores tecnologias
            </span>
          </h2>
          
          <p className="text-xl text-gray-300 font-manrope max-w-3xl mx-auto">
            Stack moderna e robusta para garantir performance, segurança e escalabilidade
          </p>
        </div>

        {/* Tech Cards - Clean Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {technologies.map((tech, index) => {
            const IconComponent = tech.icon
            const isActive = activeCard === index
            
            return (
              <div
                key={index}
                onMouseEnter={() => setActiveCard(index)}
                onMouseLeave={() => setActiveCard(null)}
                className={`group relative bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-gray-700 hover:border-blue-500/50 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 cursor-pointer ${
                  isActive ? 'shadow-2xl shadow-blue-500/25 z-10' : 'hover:shadow-xl'
                }`}
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
                {/* Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${tech.color} rounded-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl`}></div>
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`w-16 h-16 bg-gradient-to-r ${tech.color} rounded-2xl flex items-center justify-center mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-manrope font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-500 transition-all duration-300">
                    {tech.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-300 font-manrope leading-relaxed mb-6">
                    {tech.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-2 mb-6">
                    {tech.features.map((feature, featureIndex) => (
                      <div 
                        key={featureIndex}
                        className="flex items-center space-x-2 transform translate-x-0 group-hover:translate-x-2 transition-transform duration-300"
                        style={{ transitionDelay: `${featureIndex * 0.1}s` }}
                      >
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                        <span className="text-gray-400 font-manrope text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Learn More */}
                  <div className="flex items-center space-x-2 text-blue-400 font-manrope font-medium opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    <span>Saiba mais</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>

                {/* Floating Particles */}
                <div className={`absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r ${tech.color} rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 animate-bounce`}></div>
                <div className={`absolute -bottom-2 -left-2 w-3 h-3 bg-gradient-to-r ${tech.color} rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse`}></div>
                <div className={`absolute top-1/2 -right-1 w-2 h-2 bg-gradient-to-r ${tech.color} rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 animate-ping`}></div>
              </div>
            )
          })}
        </div>

        {/* Bottom Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20">
          {[
            { value: "99.9%", label: "Uptime", icon: Zap },
            { value: "<100ms", label: "Latência", icon: Clock },
            { value: "256-bit", label: "Criptografia", icon: Shield },
            { value: "24/7", label: "Monitoramento", icon: Eye }
          ].map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <div 
                key={index}
                className="text-center group cursor-pointer transform hover:scale-110 transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/10 rounded-2xl mb-4 group-hover:bg-blue-500/20 transition-all duration-300">
                  <IconComponent className="w-8 h-8 text-blue-400" />
                </div>
                <div className="text-3xl font-manrope font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-gray-400 font-manrope text-sm">
                  {stat.label}
                </div>
              </div>
            )
          })}
        </div>

        {/* Integration Preview */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 backdrop-blur-sm border border-blue-500/20 rounded-3xl p-12">
            <h3 className="text-3xl font-manrope font-bold text-white mb-4">
              Integrações Nativas
            </h3>
            <p className="text-xl font-manrope text-gray-300 mb-8">
              Conecte-se com as principais plataformas do mercado
            </p>
            
            {/* Integration Logos */}
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60 hover:opacity-100 transition-opacity duration-300">
              {[
                { name: 'iFood', icon: Smartphone, color: 'from-orange-500 to-red-600' },
                { name: 'Uber Eats', icon: Zap, color: 'from-green-500 to-emerald-600' },
                { name: 'Rappi', icon: Cloud, color: 'from-blue-500 to-purple-600' },
                { name: 'WhatsApp', icon: MessageCircle, color: 'from-green-400 to-green-600' },
                { name: 'Instagram', icon: Camera, color: 'from-pink-500 to-purple-600' },
                { name: 'Facebook', icon: Share2, color: 'from-blue-600 to-blue-800' }
              ].map((platform, index) => (
                <div 
                  key={index}
                  className="flex flex-col items-center space-y-2 group cursor-pointer transform hover:scale-110 transition-all duration-300"
                >
                  <div className={`w-12 h-12 bg-gradient-to-r ${platform.color} rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                    <platform.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-white font-manrope font-medium text-sm opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                    {platform.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { 
  Code,
  Database,
  Cloud,
  Shield,
  Zap,
  Cpu,
  Globe,
  Lock
} from 'lucide-react'
import { logger } from '../../utils/logger'

export default function InstitutionalTechStack() {
  const [activeStack, setActiveStack] = useState<number | null>(null)

  useEffect(() => {
    try {
      logger.componentMount('InstitutionalTechStack')
    } catch (error) {
      logger.error('Erro ao inicializar InstitutionalTechStack', error as Error)
    }
  }, [])

  const handleStackHover = (index: number | null) => {
    try {
      setActiveStack(index)
      if (index !== null) {
        logger.userInteraction('tech_stack_hover', `stack_${index}`)
      }
    } catch (error) {
      logger.error('Erro ao registrar hover no tech stack', error as Error)
    }
  }

  const techStacks = [
    {
      icon: Code,
      title: 'Frontend Moderno',
      description: 'React 18, Next.js 15, TypeScript e Tailwind CSS para interfaces responsivas e performáticas',
      technologies: ['React 18', 'Next.js 15', 'TypeScript', 'Tailwind CSS'],
      color: 'from-blue-500 to-cyan-600'
    },
    {
      icon: Database,
      title: 'Backend Robusto',
      description: 'Spring Boot, Java 17, PostgreSQL e Redis para APIs escaláveis e confiáveis',
      technologies: ['Spring Boot', 'Java 17', 'PostgreSQL', 'Redis'],
      color: 'from-emerald-500 to-green-600'
    },
    {
      icon: Cloud,
      title: 'Cloud Native',
      description: 'AWS, Docker, Kubernetes para infraestrutura moderna e escalável',
      technologies: ['AWS', 'Docker', 'Kubernetes', 'Terraform'],
      color: 'from-purple-500 to-violet-600'
    },
    {
      icon: Shield,
      title: 'Segurança Avançada',
      description: 'SSL 256-bit, OAuth 2.0, JWT e conformidade com padrões internacionais',
      technologies: ['SSL 256-bit', 'OAuth 2.0', 'JWT', 'PCI DSS'],
      color: 'from-orange-500 to-red-600'
    }
  ]

  return (
    <section 
      data-section="tech" 
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
            <Cpu className="w-5 h-5 text-blue-600" />
            <span className="text-blue-700 font-manrope font-semibold text-sm">
              Stack Tecnológico
            </span>
          </div>
          
          <h2 className="text-6xl lg:text-7xl font-manrope font-black text-gray-900 mb-8 leading-tight">
            Tecnologia de
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600">
              classe mundial
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 font-manrope max-w-4xl mx-auto leading-relaxed">
            Utilizamos as tecnologias mais avançadas do mercado para garantir performance, segurança e escalabilidade
          </p>
        </div>

        {/* Tech Stack Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {techStacks.map((stack, index) => {
            const IconComponent = stack.icon
            const isActive = activeStack === index
            
            return (
              <div
                key={index}
                onMouseEnter={() => handleStackHover(index)}
                onMouseLeave={() => handleStackHover(null)}
                className={`bg-white border-2 border-gray-100 rounded-3xl p-8 transform transition-all duration-500 hover:scale-105 hover:-translate-y-3 cursor-pointer ${
                  isActive ? 'shadow-2xl border-blue-200' : 'hover:shadow-xl'
                }`}
              >
                {/* Icon */}
                <div className={`w-20 h-20 bg-gradient-to-br ${stack.color} rounded-2xl flex items-center justify-center mb-6 transform transition-all duration-300 ${
                  isActive ? 'scale-110 rotate-6' : ''
                } shadow-lg`}>
                  <IconComponent className="w-10 h-10 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-3xl font-manrope font-bold text-gray-900 mb-4">
                  {stack.title}
                </h3>
                
                <p className="text-gray-600 font-manrope leading-relaxed mb-6">
                  {stack.description}
                </p>

                {/* Technologies */}
                <div className="flex flex-wrap gap-2">
                  {stack.technologies.map((tech, techIndex) => (
                    <span 
                      key={techIndex}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-manrope font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: '99.9%', label: 'Disponibilidade', icon: Zap },
            { value: '<50ms', label: 'Latência', icon: Globe },
            { value: '256-bit', label: 'Criptografia', icon: Lock },
            { value: '24/7', label: 'Monitoramento', icon: Shield }
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
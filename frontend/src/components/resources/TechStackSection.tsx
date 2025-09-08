'use client'

import { useState, useEffect } from 'react'
import { Code, Database, Cloud, Shield, Cpu, Globe } from 'lucide-react'
import { logger } from '../../utils/logger'

export default function TechStackSection() {
  const [activeStack, setActiveStack] = useState<number | null>(null)

  useEffect(() => {
    logger.componentMount('TechStackSection')
  }, [])

  const stacks = [
    {
      icon: Code,
      title: 'Frontend',
      description: 'React 18, Next.js 15, TypeScript para interfaces modernas',
      technologies: ['React 18', 'Next.js 15', 'TypeScript', 'Tailwind CSS'],
      color: 'from-blue-500 to-cyan-600'
    },
    {
      icon: Database,
      title: 'Backend',
      description: 'Spring Boot, Java 17, PostgreSQL para APIs robustas',
      technologies: ['Spring Boot', 'Java 17', 'PostgreSQL', 'Redis'],
      color: 'from-emerald-500 to-green-600'
    },
    {
      icon: Cloud,
      title: 'Cloud',
      description: 'AWS, Docker, Kubernetes para escalabilidade',
      technologies: ['AWS', 'Docker', 'Kubernetes', 'Terraform'],
      color: 'from-purple-500 to-violet-600'
    },
    {
      icon: Shield,
      title: 'Segurança',
      description: 'SSL 256-bit, OAuth 2.0, JWT para proteção total',
      technologies: ['SSL 256-bit', 'OAuth 2.0', 'JWT', 'PCI DSS'],
      color: 'from-orange-500 to-red-600'
    }
  ]

  return (
    <section data-section="stack" className="py-32 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 bg-blue-100 border border-blue-200 rounded-full px-6 py-3 mb-8">
            <Cpu className="w-5 h-5 text-blue-600" />
            <span className="text-blue-700 font-manrope font-semibold text-sm">Stack Tecnológico</span>
          </div>
          
          <h2 className="text-6xl lg:text-7xl font-manrope font-black text-gray-900 mb-8 leading-tight">
            Tecnologias de
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600">
              classe mundial
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {stacks.map((stack, index) => {
            const IconComponent = stack.icon
            
            return (
              <div
                key={index}
                onMouseEnter={() => setActiveStack(index)}
                onMouseLeave={() => setActiveStack(null)}
                className="bg-white border-2 border-gray-100 rounded-3xl p-8 transform transition-all duration-500 hover:scale-105 hover:-translate-y-3 cursor-pointer hover:shadow-xl"
              >
                <div className={`w-20 h-20 bg-gradient-to-br ${stack.color} rounded-2xl flex items-center justify-center mb-6 transform transition-all duration-300 shadow-lg`}>
                  <IconComponent className="w-10 h-10 text-white" />
                </div>

                <h3 className="text-3xl font-manrope font-bold text-gray-900 mb-4">{stack.title}</h3>
                <p className="text-gray-600 font-manrope leading-relaxed mb-6">{stack.description}</p>

                <div className="flex flex-wrap gap-2">
                  {stack.technologies.map((tech, techIndex) => (
                    <span key={techIndex} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-manrope font-medium">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
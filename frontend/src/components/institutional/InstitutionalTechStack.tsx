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
      title: 'Interface Empresarial',
      description: 'Arquitetura moderna com React 18, Next.js 15 Roteador de Aplicativo, TypeScript modo estrito, Tailwind CSS 3.4, Framer Motion para animações fluidas, Aplicativo Web Progressivo otimizado e renderização do lado do servidor para otimização máxima',
      technologies: ['React 18.3', 'Next.js 15.2', 'TypeScript 5.6', 'Tailwind 3.4', 'Aplicativo Web Progressivo', 'Renderização Servidor'],
      color: 'from-blue-500 to-cyan-600',
      metrics: { desempenho: '98/100', otimizacao: '100/100', acessibilidade: '95/100' }
    },
    {
      icon: Database,
      title: 'Servidor Escalável',
      description: 'Microserviços com Spring Boot 3.2, Java 17 Suporte de Longo Prazo, PostgreSQL 15 com particionamento, Redis 7 para cache distribuído, RabbitMQ para mensageria assíncrona e Elasticsearch para busca avançada',
      technologies: ['Spring Boot 3.2', 'Java 17 Suporte Longo Prazo', 'PostgreSQL 15', 'Redis 7', 'RabbitMQ', 'Elasticsearch'],
      color: 'from-emerald-500 to-green-600',
      metrics: { disponibilidade: '99.98%', latencia: '<50ms', capacidade: '10k req/s' }
    },
    {
      icon: Cloud,
      title: 'Nuvem Nativa Amazon',
      description: 'Infraestrutura como código com Terraform, containers Docker otimizados, orquestração Kubernetes, escalonamento automático inteligente, rede de distribuição de conteúdo global e monitoramento 24/7',
      technologies: ['Amazon Kubernetes', 'Docker', 'Terraform', 'Rede Distribuição', 'Rastreamento X-Ray', 'Escalonamento Automático'],
      color: 'from-purple-500 to-violet-600',
      metrics: { disponibilidade: '99.99%', escalonamento: 'Automático', regioes: '15+' }
    },
    {
      icon: Shield,
      title: 'Segurança Avançada',
      description: 'Criptografia de nível bancário, autenticação multi-fator, protocolo de autorização seguro, tokens de atualização, conformidade com padrões internacionais de segurança e testes de penetração mensais',
      technologies: ['Criptografia 256-bit', 'Autenticação Dupla', 'Tokens Seguros', 'Conformidade Internacional', 'Proteção Dados', 'Auditoria Mensal'],
      color: 'from-orange-500 to-red-600',
      metrics: { criptografia: '256-bit', conformidade: '100%', incidentes: '0' }
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
          
          <h2 className="text-4xl lg:text-5xl font-manrope font-black text-gray-900 mb-8 leading-tight">
            Tecnologia de
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600">
              classe mundial
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 font-manrope max-w-4xl mx-auto leading-relaxed">
            Stack tecnológico enterprise com arquitetura moderna, microserviços escaláveis, segurança avançada e performance otimizada para atender desde startups até grandes corporações
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
                <h3 className="text-2xl font-manrope font-bold text-gray-900 mb-4">
                  {stack.title}
                </h3>
                
                <p className="text-gray-600 font-manrope leading-relaxed mb-6 text-sm">
                  {stack.description}
                </p>

                {/* Metrics */}
                {stack.metrics && (
                  <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
                    {Object.entries(stack.metrics).map(([key, value], metricIndex) => (
                      <div key={metricIndex} className="text-center">
                        <div className="text-lg font-black text-gray-900 font-manrope">{value}</div>
                        <div className="text-xs text-gray-500 font-manrope capitalize">{key}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Technologies */}
                <div className="flex flex-wrap gap-2">
                  {stack.technologies.map((tech, techIndex) => (
                    <span 
                      key={techIndex}
                      className={`bg-gradient-to-r ${stack.color} text-white px-3 py-1 rounded-full text-xs font-manrope font-medium shadow-sm`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Métricas Profissionais */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white">
          <h3 className="text-3xl font-manrope font-bold text-center mb-12">Métricas de Desempenho Empresarial</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '99.98%', label: 'Disponibilidade Garantida', icon: Zap, description: 'Garantia contratual' },
              { value: '<50ms', label: 'Latência da Interface', icon: Globe, description: 'Tempo de resposta' },
              { value: '10k+', label: 'Requisições/Segundo', icon: Cpu, description: 'Capacidade máxima' },
              { value: '24/7', label: 'Monitoramento', icon: Shield, description: 'Observabilidade total' }
            ].map((stat, index) => {
              const IconComponent = stat.icon
              return (
                <div 
                  key={index}
                  className="text-center group cursor-pointer transform hover:scale-110 transition-all duration-300"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-4 group-hover:bg-white/30 transition-all duration-300">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-manrope font-black text-white mb-2">
                    {stat.value}
                  </div>
                  <div className="text-white/90 font-manrope font-medium mb-1">
                    {stat.label}
                  </div>
                  <div className="text-white/70 font-manrope text-xs">
                    {stat.description}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
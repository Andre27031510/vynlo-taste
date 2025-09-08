'use client'

import { useEffect } from 'react'
import { Cpu, Zap, Brain, Rocket, Code, Database, Cloud, Shield } from 'lucide-react'
import { logger } from '../../utils/logger'

export default function QuemSomos() {
  useEffect(() => {
    try {
      logger.componentMount('QuemSomos')
    } catch (error) {
      logger.error('Erro ao inicializar QuemSomos', error as Error)
    }
  }, [])

  const handleCardHover = (cardName: string) => {
    try {
      logger.userInteraction('quem_somos_card_hover', cardName)
    } catch (error) {
      logger.error('Erro ao registrar hover no card', error as Error)
    }
  }

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/30"></div>
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-gradient-to-r from-blue-200/20 to-purple-200/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-gradient-to-r from-purple-200/20 to-blue-200/20 rounded-full blur-3xl"></div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-24 items-center">
          
          {/* Ilustração à Esquerda */}
          <div className="relative group cursor-pointer">
            <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 rounded-3xl p-12 relative overflow-hidden transform transition-all duration-700 hover:scale-110 hover:shadow-2xl hover:shadow-blue-500/25">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-500">
                <div className="absolute top-4 left-4 w-6 h-6 border-2 border-white rounded-lg animate-pulse"></div>
                <div className="absolute top-16 right-8 w-4 h-4 border-2 border-white rounded-full animate-bounce"></div>
                <div className="absolute bottom-8 left-8 w-3 h-3 bg-white rounded-full animate-ping"></div>
              </div>
              
              {/* Central Tech Illustration */}
              <div className="relative z-10 text-center">
                <div className="inline-flex items-center justify-center w-32 h-32 bg-white/20 backdrop-blur-lg rounded-full mb-8 transform transition-all duration-500 group-hover:scale-125 group-hover:rotate-12">
                  <Brain className="w-16 h-16 text-white transform transition-transform duration-500 group-hover:rotate-12" />
                </div>
                
                {/* Floating Tech Icons */}
                <div className="absolute top-8 left-8 transform transition-all duration-500 group-hover:scale-125 group-hover:-translate-y-2">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center animate-bounce">
                    <Cpu className="w-6 h-6 text-white" />
                  </div>
                </div>
                
                <div className="absolute top-16 right-4 transform transition-all duration-500 group-hover:scale-125 group-hover:-translate-y-2">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center animate-pulse">
                    <Code className="w-5 h-5 text-white" />
                  </div>
                </div>
                
                <div className="absolute bottom-12 left-4 transform transition-all duration-500 group-hover:scale-125 group-hover:-translate-y-2">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center animate-bounce" style={{animationDelay: '1s'}}>
                    <Database className="w-7 h-7 text-white" />
                  </div>
                </div>
                
                <div className="absolute bottom-8 right-8 transform transition-all duration-500 group-hover:scale-125 group-hover:-translate-y-2">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center animate-pulse" style={{animationDelay: '0.5s'}}>
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                </div>
                
                <div className="absolute top-1/2 right-2 transform transition-all duration-500 group-hover:scale-125 group-hover:-translate-y-2">
                  <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center animate-bounce">
                    <Cloud className="w-4 h-4 text-white" />
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-2 font-manrope transform transition-all duration-500 group-hover:scale-110">Tecnologia Avançada</h3>
                <p className="text-blue-100 font-medium transform transition-all duration-500 group-hover:text-white">Inovação que transforma negócios</p>
              </div>
            </div>
          </div>

          {/* Conteúdo à Direita */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 font-manrope leading-tight">
                Quem é a <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800">Vynlo?</span>
              </h2>
              
              <div className="space-y-6 text-lg text-gray-700 leading-relaxed font-medium">
                <p>
                  Somos uma empresa de <strong className="text-blue-600">tecnologia</strong> especializada em desenvolver soluções digitais inovadoras que transformam a forma como os negócios operam no mundo moderno.
                </p>
                
                <p>
                  Nossa expertise está em criar plataformas robustas e escaláveis que combinam <strong className="text-purple-600">inteligência artificial</strong>, cloud computing e desenvolvimento ágil para atender às necessidades específicas de cada segmento de mercado.
                </p>
                
                <p>
                  Com foco em <strong className="text-emerald-600">inovação</strong> e excelência técnica, desenvolvemos sistemas que automatizam processos, otimizam operações e impulsionam o crescimento dos nossos clientes através de tecnologia de ponta.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
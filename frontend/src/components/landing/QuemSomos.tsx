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
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Ilustração à Esquerda */}
          <div className="relative group">
            <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 rounded-3xl p-12 relative overflow-hidden transform transition-all duration-500 hover:scale-105">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-4 left-4 w-6 h-6 border-2 border-white rounded-lg"></div>
                <div className="absolute top-16 right-8 w-4 h-4 border-2 border-white rounded-full"></div>
                <div className="absolute bottom-8 left-8 w-3 h-3 bg-white rounded-full"></div>
              </div>
              
              {/* Central Tech Illustration */}
              <div className="relative z-10 text-center">
                <div className="inline-flex items-center justify-center w-32 h-32 bg-white/20 backdrop-blur-lg rounded-full mb-8">
                  <Brain className="w-16 h-16 text-white" />
                </div>
                
                {/* Floating Tech Icons */}
                <div className="absolute top-8 left-8">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Cpu className="w-6 h-6 text-white" />
                  </div>
                </div>
                
                <div className="absolute top-16 right-4">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <Code className="w-5 h-5 text-white" />
                  </div>
                </div>
                
                <div className="absolute bottom-12 left-4">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <Database className="w-7 h-7 text-white" />
                  </div>
                </div>
                
                <div className="absolute bottom-8 right-8">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-2 font-manrope">Tecnologia Avançada</h3>
                <p className="text-blue-100 font-medium">Inovação que transforma negócios</p>
              </div>
            </div>
          </div>

          {/* Conteúdo à Direita */}
          <div className="space-y-8">
            <div>
              <h2 className="text-5xl lg:text-6xl font-black text-gray-900 mb-6 font-manrope leading-tight">
                Quem é a
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800">
                  Vynlo?
                </span>
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

            {/* Tech Highlights */}
            <div className="grid grid-cols-3 gap-4 pt-6">
              <div className="text-center p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-gray-100">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div className="text-2xl font-black text-blue-600 mb-1 font-manrope">IA</div>
                <div className="text-xs text-gray-600 font-medium">Inteligência Artificial</div>
              </div>
              
              <div className="text-center p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-gray-100">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Cloud className="w-5 h-5 text-white" />
                </div>
                <div className="text-2xl font-black text-purple-600 mb-1 font-manrope">Cloud</div>
                <div className="text-xs text-gray-600 font-medium">AWS</div>
              </div>
              
              <div className="text-center p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-gray-100">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div className="text-2xl font-black text-green-600 mb-1 font-manrope">24/7</div>
                <div className="text-xs text-gray-600 font-medium">Disponibilidade</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
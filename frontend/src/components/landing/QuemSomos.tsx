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
    <section className="py-32 bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-200/20 to-purple-200/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-200/20 to-blue-200/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          
          {/* Enhanced Ilustração/Banner à Esquerda */}
          <div className="relative group">
            <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 rounded-3xl p-16 relative overflow-hidden transform transition-all duration-700 hover:scale-105 hover:shadow-2xl">
              {/* Enhanced Background Pattern */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-6 left-6 w-8 h-8 border-2 border-white rounded-lg animate-pulse"></div>
                <div className="absolute top-20 right-10 w-6 h-6 border-2 border-white rounded-full animate-bounce"></div>
                <div className="absolute bottom-10 left-10 w-4 h-4 bg-white rounded-full animate-ping"></div>
                <div className="absolute top-1/2 right-6 w-3 h-3 bg-white/60 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
              </div>
              
              {/* Enhanced Central Tech Illustration */}
              <div className="relative z-10 text-center">
                <div className="inline-flex items-center justify-center w-40 h-40 bg-white/20 backdrop-blur-lg rounded-full mb-10 transform transition-all duration-500 hover:scale-110 hover:bg-white/30">
                  <Brain className="w-20 h-20 text-white transform transition-transform duration-500 hover:rotate-12" />
                </div>
                
                {/* Enhanced Floating Tech Icons */}
                <div className="absolute top-10 left-10 transform transition-all duration-500 hover:scale-125 hover:-translate-y-2">
                  <div className="w-14 h-14 bg-white/25 backdrop-blur-sm rounded-xl flex items-center justify-center animate-bounce cursor-pointer">
                    <Cpu className="w-7 h-7 text-white" />
                  </div>
                </div>
                
                <div className="absolute top-20 right-6 transform transition-all duration-500 hover:scale-125 hover:-translate-y-2">
                  <div className="w-12 h-12 bg-white/25 backdrop-blur-sm rounded-lg flex items-center justify-center animate-pulse cursor-pointer">
                    <Code className="w-6 h-6 text-white" />
                  </div>
                </div>
                
                <div className="absolute bottom-16 left-6 transform transition-all duration-500 hover:scale-125 hover:-translate-y-2" style={{animationDelay: '1s'}}>
                  <div className="w-16 h-16 bg-white/25 backdrop-blur-sm rounded-2xl flex items-center justify-center animate-bounce cursor-pointer">
                    <Database className="w-8 h-8 text-white" />
                  </div>
                </div>
                
                <div className="absolute bottom-10 right-10 transform transition-all duration-500 hover:scale-125 hover:-translate-y-2" style={{animationDelay: '0.5s'}}>
                  <div className="w-14 h-14 bg-white/25 backdrop-blur-sm rounded-xl flex items-center justify-center animate-pulse cursor-pointer">
                    <Zap className="w-7 h-7 text-white" />
                  </div>
                </div>
                
                <div className="absolute top-1/2 right-2 transform transition-all duration-500 hover:scale-125 hover:-translate-y-2">
                  <div className="w-10 h-10 bg-white/25 backdrop-blur-sm rounded-lg flex items-center justify-center animate-bounce cursor-pointer">
                    <Cloud className="w-5 h-5 text-white" />
                  </div>
                </div>
                
                <h3 className="text-3xl font-bold text-white mb-3 font-manrope">Tecnologia Avançada</h3>
                <p className="text-blue-100 text-lg font-medium">Inovação que transforma negócios</p>
              </div>
            </div>
          </div>

          {/* Enhanced Conteúdo à Direita */}
          <div className="space-y-10">
            <div className="transform transition-all duration-700 hover:translate-x-2">
              <h2 className="text-6xl lg:text-7xl font-black text-gray-900 mb-8 font-manrope leading-tight">
                Quem é a
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 animate-gradient">
                  Vynlo?
                </span>
              </h2>
              
              <p className="text-xl text-gray-700 leading-relaxed mb-10 font-medium">
                Somos uma empresa de <strong className="text-blue-600">tecnologia</strong> especializada em desenvolver soluções digitais inovadoras que transformam a forma como os negócios operam no mundo moderno.
              </p>
            </div>

            {/* Enhanced Missão e Diferencial */}
            <div className="space-y-8">
              <div 
                className="flex items-start gap-6 p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-gray-100 transform transition-all duration-500 hover:scale-105 hover:shadow-xl hover:bg-white/80 cursor-pointer group"
                onMouseEnter={() => handleCardHover('missao')}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0 transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
                  <Rocket className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 font-manrope">Nossa Missão</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Desenvolver soluções tecnológicas inovadoras que automatizam processos, otimizam operações e impulsionam o crescimento dos nossos clientes através da inteligência artificial e tecnologia de ponta.
                  </p>
                </div>
              </div>

              <div 
                className="flex items-start gap-6 p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-gray-100 transform transition-all duration-500 hover:scale-105 hover:shadow-xl hover:bg-white/80 cursor-pointer group"
                onMouseEnter={() => handleCardHover('diferencial')}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0 transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 font-manrope">Nosso Diferencial</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Combinamos inteligência artificial, cloud computing e desenvolvimento ágil para criar plataformas robustas, escaláveis e intuitivas que se adaptam às necessidades específicas de cada segmento de mercado.
                  </p>
                </div>
              </div>
            </div>

            {/* Enhanced Tech Stack Highlights */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div 
                className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 transform transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:-translate-y-2 cursor-pointer group"
                onMouseEnter={() => handleCardHover('ia')}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 transform transition-all duration-500 group-hover:scale-125 group-hover:rotate-12">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-black text-blue-600 mb-2 font-manrope">IA</div>
                <div className="text-sm text-gray-600 font-medium">Inteligência Artificial</div>
              </div>
              
              <div 
                className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 transform transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:-translate-y-2 cursor-pointer group"
                onMouseEnter={() => handleCardHover('cloud')}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 transform transition-all duration-500 group-hover:scale-125 group-hover:rotate-12">
                  <Cloud className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-black text-purple-600 mb-2 font-manrope">Cloud</div>
                <div className="text-sm text-gray-600 font-medium">Infraestrutura AWS</div>
              </div>
              
              <div 
                className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 transform transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:-translate-y-2 cursor-pointer group"
                onMouseEnter={() => handleCardHover('disponibilidade')}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4 transform transition-all duration-500 group-hover:scale-125 group-hover:rotate-12">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-black text-green-600 mb-2 font-manrope">24/7</div>
                <div className="text-sm text-gray-600 font-medium">Disponibilidade</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
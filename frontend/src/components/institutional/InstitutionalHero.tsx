'use client'

import { useState, useEffect } from 'react'
import { 
  ArrowRight,
  Play,
  Users,
  Building2,
  Award,
  TrendingUp
} from 'lucide-react'
import { logger } from '../../utils/logger'

export default function InstitutionalHero() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

  useEffect(() => {
    try {
      logger.componentMount('InstitutionalHero')
    } catch (error) {
      logger.error('Erro ao inicializar InstitutionalHero', error as Error)
    }
  }, [])

  const handleVideoPlay = () => {
    try {
      setIsVideoPlaying(true)
      logger.userInteraction('video_play', 'institutional_hero')
    } catch (error) {
      logger.error('Erro ao reproduzir vídeo', error as Error)
    }
  }

  const stats = [
    { icon: Users, value: '5.000+', label: 'Clientes Ativos' },
    { icon: Building2, value: '50+', label: 'Cidades' },
    { icon: Award, value: '98%', label: 'Satisfação' },
    { icon: TrendingUp, value: '+200%', label: 'Crescimento Médio' }
  ]

  return (
    <section 
      data-section="hero" 
      className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-black overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Content */}
          <div data-animate className="space-y-8">
            <div className="inline-flex items-center space-x-2 bg-blue-500/20 border border-blue-400/30 rounded-full px-6 py-3">
              <Award className="w-5 h-5 text-blue-400" />
              <span className="text-blue-300 font-manrope font-semibold text-sm">
                Sobre a Vynlo Tech
              </span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-manrope font-black text-white leading-tight">
              Transformando negócios com
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400">
                tecnologia de ponta
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 font-manrope leading-relaxed max-w-2xl">
              Há mais de 5 anos desenvolvemos soluções tecnológicas que revolucionam a gestão empresarial. 
              Nossa missão é capacitar negócios de todos os tamanhos com ferramentas inteligentes e inovadoras.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-manrope font-bold px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2">
                <span>Nossa História</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              
              <button 
                onClick={handleVideoPlay}
                className="bg-white border-2 border-gray-200 text-gray-700 font-manrope font-bold px-8 py-4 rounded-xl hover:border-blue-300 hover:text-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
              >
                <Play className="w-5 h-5" />
                <span>Assistir Vídeo</span>
              </button>
            </div>


          </div>

          {/* Visual */}
          <div data-animate className="relative">
            <div className="relative bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 transform rotate-3 hover:rotate-0 transition-all duration-500">
              {/* Video Placeholder */}
              <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center relative overflow-hidden">
                {!isVideoPlaying ? (
                  <>
                    <button 
                      onClick={handleVideoPlay}
                      className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 transform hover:scale-110"
                    >
                      <Play className="w-8 h-8 text-white ml-1" />
                    </button>
                    
                    {/* Floating Elements */}
                    <div className="absolute top-4 left-4 w-3 h-3 bg-white/30 rounded-full animate-ping"></div>
                    <div className="absolute top-8 right-8 w-2 h-2 bg-white/40 rounded-full animate-pulse"></div>
                    <div className="absolute bottom-6 left-8 w-4 h-4 bg-white/20 rounded-full animate-bounce"></div>
                  </>
                ) : (
                  <div className="text-white text-center">
                    <div className="text-lg font-manrope font-semibold mb-2">Vídeo Institucional</div>
                    <div className="text-sm opacity-80">Conheça nossa trajetória</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
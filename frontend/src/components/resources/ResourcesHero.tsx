'use client'

import { useState, useEffect } from 'react'
import { 
  Code,
  Database,
  Shield,
  Zap,
  Cpu,
  Terminal,
  GitBranch
} from 'lucide-react'
import { logger } from '../../utils/logger'

export default function ResourcesHero() {
  const [activeFeature, setActiveFeature] = useState<number | null>(null)

  useEffect(() => {
    logger.componentMount('ResourcesHero')
  }, [])

  const features = [
    { icon: Code, label: 'Funcionalidades', value: '200+' },
    { icon: Database, label: 'Integrações', value: '50+' },
    { icon: Shield, label: 'Segurança Total', value: '100%' },
    { icon: Zap, label: 'Suporte 24/7', value: 'Sempre' }
  ]

  return (
    <section 
      data-section="hero" 
      className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-black overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Content */}
          <div data-animate className="space-y-8">
            <div className="inline-flex items-center space-x-2 bg-blue-500/20 border border-blue-400/30 rounded-full px-6 py-3">
              <Cpu className="w-5 h-5 text-blue-400" />
              <span className="text-blue-300 font-manrope font-semibold text-sm">
                Recursos Empresariais
              </span>
            </div>
            
            <h1 className="text-6xl lg:text-7xl font-manrope font-black text-white leading-tight">
              Recursos que
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400">
                transformam negócios
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 font-manrope leading-relaxed max-w-2xl">
              Gestão inteligente, segurança empresarial, relatórios avançados e suporte especializado. 
              Descubra os recursos que fazem da Vynlo a escolha de milhares de empresários.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-manrope font-bold px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2">
                <Terminal className="w-5 h-5" />
                <span>Ver Demonstração</span>
              </button>
              
              <button className="bg-white/10 backdrop-blur-sm border border-white/20 text-white font-manrope font-bold px-8 py-4 rounded-xl hover:bg-white/20 transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
                <GitBranch className="w-5 h-5" />
                <span>Solicitar Teste</span>
              </button>
            </div>


          </div>

          {/* Code Preview */}
          <div data-animate className="relative">
            <div className="bg-gray-900/90 backdrop-blur-lg rounded-3xl p-8 border border-gray-700 shadow-2xl">
              {/* Terminal Header */}
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-700">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-400 font-mono text-sm ml-4">vynlo-api.js</span>
              </div>
              
              {/* Code Content */}
              <div className="font-mono text-sm space-y-2">
                <div className="text-gray-500">// Vynlo API - Exemplo de Integração</div>
                <div>
                  <span className="text-blue-400">import</span>{' '}
                  <span className="text-white">{'{ VynloAPI }'}</span>{' '}
                  <span className="text-blue-400">from</span>{' '}
                  <span className="text-green-400">'@vynlo/sdk'</span>
                </div>
                <div className="mt-4"></div>
                <div>
                  <span className="text-blue-400">const</span>{' '}
                  <span className="text-white">api</span>{' '}
                  <span className="text-gray-400">=</span>{' '}
                  <span className="text-blue-400">new</span>{' '}
                  <span className="text-yellow-400">VynloAPI</span>
                  <span className="text-white">(</span>
                  <span className="text-white">{'{'}</span>
                </div>
                <div className="ml-4 text-white">
                  apiKey: <span className="text-green-400">'your-api-key'</span>,
                </div>
                <div className="ml-4 text-white">
                  environment: <span className="text-green-400">'production'</span>
                </div>
                <div className="text-white">
                  <span className="text-white">{'}'}</span>
                  <span className="text-white">)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
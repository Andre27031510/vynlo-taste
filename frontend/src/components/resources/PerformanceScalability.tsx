'use client'

import { Zap, Globe, BarChart3, Cpu } from 'lucide-react'

export default function PerformanceScalability() {
  const metrics = [
    { icon: Zap, value: '<50ms', label: 'Latência' },
    { icon: Globe, value: '99.9%', label: 'Uptime' },
    { icon: BarChart3, value: '10x', label: 'Escalabilidade' },
    { icon: Cpu, value: '24/7', label: 'Monitoramento' }
  ]

  return (
    <section data-section="performance" className="py-32 bg-gradient-to-br from-slate-900 via-blue-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-6xl lg:text-7xl font-manrope font-black text-white mb-8 leading-tight">
            Performance
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400">
              excepcional
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {metrics.map((metric, index) => {
            const IconComponent = metric.icon
            return (
              <div key={index} className="text-center group cursor-pointer transform hover:scale-110 transition-all duration-300">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl mb-4 group-hover:bg-white/20 transition-all duration-300">
                  <IconComponent className="w-10 h-10 text-blue-400" />
                </div>
                <div className="text-4xl font-manrope font-black text-white mb-2">{metric.value}</div>
                <div className="text-gray-400 font-manrope font-medium">{metric.label}</div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
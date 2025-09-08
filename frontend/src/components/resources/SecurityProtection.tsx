'use client'

import { Shield, Lock, Eye, FileCheck } from 'lucide-react'
import { logger } from '../../utils/logger'

export default function SecurityProtection() {
  const securities = [
    { icon: Shield, title: 'SSL 256-bit', description: 'Criptografia de nível bancário' },
    { icon: Lock, title: 'OAuth 2.0', description: 'Autenticação segura' },
    { icon: Eye, title: 'Monitoramento 24/7', description: 'Vigilância constante' },
    { icon: FileCheck, title: 'PCI DSS', description: 'Conformidade total' }
  ]

  return (
    <section data-section="security" className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-6xl lg:text-7xl font-manrope font-black text-gray-900 mb-8 leading-tight">
            Segurança
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600">
              bancária
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {securities.map((security, index) => {
            const IconComponent = security.icon
            return (
              <div key={index} className="text-center group cursor-pointer transform hover:scale-110 transition-all duration-300">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-2xl mb-4 group-hover:bg-blue-200 transition-all duration-300">
                  <IconComponent className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-manrope font-bold text-gray-900 mb-2">{security.title}</h3>
                <p className="text-gray-600 font-manrope">{security.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
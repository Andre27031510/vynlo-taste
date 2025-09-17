'use client'

import { CheckCircle2, Activity } from 'lucide-react'

export default function SystemStatus() {
  const services = [
    { name: 'API Principal', status: 'Operacional', color: 'text-emerald-500' },
    { name: 'Banco de Dados', status: 'Operacional', color: 'text-emerald-500' },
    { name: 'WhatsApp Integration', status: 'Operacional', color: 'text-emerald-500' },
    { name: 'Sistema de Pagamentos', status: 'Operacional', color: 'text-emerald-500' },
    { name: 'CDN Global', status: 'Operacional', color: 'text-emerald-500' },
    { name: 'Backup Services', status: 'Operacional', color: 'text-emerald-500' }
  ]

  return (
    <section data-section="status" className="py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 bg-emerald-100 border border-emerald-200 rounded-full px-6 py-3 mb-8">
            <Activity className="w-5 h-5 text-emerald-600" />
            <span className="text-emerald-700 font-manrope font-semibold text-sm">Status do Sistema</span>
          </div>
          
          <h2 className="text-6xl lg:text-7xl font-manrope font-black text-gray-900 mb-8 leading-tight">
            Todos os sistemas
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600">
              operacionais
            </span>
          </h2>
        </div>

        <div className="bg-white border-2 border-gray-100 rounded-3xl p-8 shadow-xl">
          <div className="space-y-6">
            {services.map((service, index) => (
              <div key={index} className="flex items-center space-x-4 p-6 bg-gray-50 rounded-2xl">
                <CheckCircle2 className={`w-6 h-6 ${service.color}`} />
                <div>
                  <h3 className="text-lg font-manrope font-semibold text-gray-900">{service.name}</h3>
                  <p className="text-gray-600 font-manrope text-sm">{service.status}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-gray-600 font-manrope">
              Última atualização: {new Date().toLocaleString('pt-BR')}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
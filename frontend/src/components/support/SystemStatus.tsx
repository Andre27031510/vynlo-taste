'use client'

import { CheckCircle2, AlertCircle, Activity } from 'lucide-react'

export default function SystemStatus() {
  const services = [
    { name: 'API Principal', status: 'Operacional', uptime: '99.98%', color: 'text-emerald-500' },
    { name: 'Banco de Dados', status: 'Operacional', uptime: '99.95%', color: 'text-emerald-500' },
    { name: 'WhatsApp Integration', status: 'Operacional', uptime: '99.92%', color: 'text-emerald-500' },
    { name: 'Sistema de Pagamentos', status: 'Operacional', uptime: '99.99%', color: 'text-emerald-500' },
    { name: 'CDN Global', status: 'Operacional', uptime: '99.97%', color: 'text-emerald-500' },
    { name: 'Backup Services', status: 'Operacional', uptime: '100%', color: 'text-emerald-500' }
  ]

  return (
    <section data-section="status" className="py-32 bg-white">
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
              <div key={index} className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all duration-300">
                <div className="flex items-center space-x-4">
                  <CheckCircle2 className={`w-6 h-6 ${service.color}`} />
                  <div>
                    <h3 className="text-lg font-manrope font-semibold text-gray-900">{service.name}</h3>
                    <p className="text-gray-600 font-manrope text-sm">{service.status}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-lg font-manrope font-bold text-gray-900">{service.uptime}</div>
                  <div className="text-gray-500 font-manrope text-sm">Uptime</div>
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
'use client'

import { Play, Settings, Plug, AlertTriangle, Shield, Zap, CreditCard } from 'lucide-react'

interface HelpCenterProps {
  selectedCategory: string
  searchQuery: string
}

export default function HelpCenter({ selectedCategory, searchQuery }: HelpCenterProps) {
  const categories = [
    { id: 'primeiros-passos', name: 'Primeiros Passos', icon: Play, color: 'from-emerald-500 to-green-600' },
    { id: 'configuracao', name: 'Configuração', icon: Settings, color: 'from-blue-500 to-cyan-600' },
    { id: 'integracoes', name: 'Integrações', icon: Plug, color: 'from-purple-500 to-violet-600' },
    { id: 'problemas-tecnicos', name: 'Problemas Técnicos', icon: AlertTriangle, color: 'from-orange-500 to-red-600' },
    { id: 'backup-seguranca', name: 'Backup e Segurança', icon: Shield, color: 'from-indigo-500 to-blue-600' },
    { id: 'performance', name: 'Performance', icon: Zap, color: 'from-yellow-500 to-orange-600' },
    { id: 'billing', name: 'Billing e Pagamentos', icon: CreditCard, color: 'from-pink-500 to-rose-600' }
  ]

  return (
    <section data-section="help-center" className="py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-6xl lg:text-7xl font-manrope font-black text-gray-900 mb-8 leading-tight">
            Central de
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600">
              Ajuda
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 font-manrope max-w-3xl mx-auto leading-relaxed">
            Encontre respostas rápidas organizadas por categoria ou busque por tópicos específicos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => {
            const IconComponent = category.icon
            
            return (
              <div
                key={category.id}
                className="bg-white border-2 border-gray-100 rounded-3xl p-8 text-center"
              >
                <div className={`w-20 h-20 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg`}>
                  <IconComponent className="w-10 h-10 text-white" />
                </div>

                <h3 className="text-2xl font-manrope font-bold text-gray-900 mb-4">
                  {category.name}
                </h3>
                
                <div className="text-blue-600 font-manrope font-semibold">
                  Ver artigos
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
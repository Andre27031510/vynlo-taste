'use client'

import { Book, Code, Download, ExternalLink } from 'lucide-react'

export default function TechnicalDocumentation() {
  const docs = [
    { icon: Book, title: 'API Reference', description: 'Documentação completa da API REST', link: '/docs/api' },
    { icon: Code, title: 'SDK & Libraries', description: 'Bibliotecas oficiais para integração', link: '/docs/sdk' },
    { icon: Download, title: 'Guias de Instalação', description: 'Passo a passo para implementação', link: '/docs/install' },
    { icon: ExternalLink, title: 'Webhooks', description: 'Configuração de eventos em tempo real', link: '/docs/webhooks' }
  ]

  return (
    <section data-section="docs" className="py-32 bg-gradient-to-br from-slate-900 via-blue-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-6xl lg:text-7xl font-manrope font-black text-white mb-8 leading-tight">
            Documentação
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400">
              Técnica
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {docs.map((doc, index) => {
            const IconComponent = doc.icon
            
            return (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 transform transition-all duration-500 hover:scale-105 hover:-translate-y-3 cursor-pointer hover:shadow-2xl hover:shadow-blue-500/25"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 transform transition-all duration-300 hover:scale-110 hover:rotate-6 shadow-lg">
                  <IconComponent className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-2xl font-manrope font-bold text-white mb-4">{doc.title}</h3>
                <p className="text-gray-300 font-manrope leading-relaxed mb-6">{doc.description}</p>
                
                <div className="text-blue-400 font-manrope font-semibold">
                  Acessar documentação →
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
'use client'

import { Book, Code, FileText, Download } from 'lucide-react'

export default function TechnicalDocumentation() {
  const docs = [
    { icon: Book, title: 'Guia de Início', description: 'Primeiros passos com a API' },
    { icon: Code, title: 'Referência API', description: 'Documentação completa' },
    { icon: FileText, title: 'Exemplos', description: 'Códigos prontos para usar' },
    { icon: Download, title: 'SDKs', description: 'Bibliotecas oficiais' }
  ]

  return (
    <section data-section="docs" className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-6xl lg:text-7xl font-manrope font-black text-gray-900 mb-8 leading-tight">
            Documentação
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600">
              completa
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {docs.map((doc, index) => {
            const IconComponent = doc.icon
            return (
              <div key={index} className="bg-white border-2 border-gray-100 rounded-3xl p-8 text-center transform hover:scale-105 hover:-translate-y-3 transition-all duration-300 cursor-pointer hover:shadow-xl">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
                  <IconComponent className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-manrope font-bold text-gray-900 mb-2">{doc.title}</h3>
                <p className="text-gray-600 font-manrope">{doc.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
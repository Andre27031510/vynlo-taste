'use client'

import { MessageCircle, Mail, Phone, Calendar } from 'lucide-react'

export default function TechnicalContact() {
  return (
    <section data-section="contact" className="py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-6xl lg:text-7xl font-manrope font-black text-white mb-8 leading-tight">
            Contato
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400">
              Técnico
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: MessageCircle, title: 'Chat ao Vivo', description: 'Suporte imediato' },
            { icon: Mail, title: 'Email Técnico', description: 'suporte@vynlo.com' },
            { icon: Phone, title: 'Telefone', description: '(11) 99999-9999' },
            { icon: Calendar, title: 'Agendar Call', description: 'Reunião técnica' }
          ].map((contact, index) => {
            const IconComponent = contact.icon
            
            return (
              <div key={index} className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg">
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-xl font-manrope font-bold text-white mb-2">{contact.title}</h3>
                <p className="text-gray-300 font-manrope">{contact.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
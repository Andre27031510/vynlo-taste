'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, HelpCircle, MessageCircle, Clock, Shield, Zap } from 'lucide-react'

export default function FAQ() {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(item => item !== index)
        : [...prev, index]
    )
  }

  const faqs = [
    {
      question: "Como funciona o período de teste gratuito?",
      answer: "Oferecemos 14 dias de teste gratuito com acesso completo a todas as funcionalidades. Não é necessário cartão de crédito e você pode cancelar a qualquer momento. Nossa equipe estará disponível para te ajudar durante todo o período de teste.",
      category: "Teste e Onboarding",
      icon: Clock
    },
    {
      question: "O sistema funciona offline?",
      answer: "Sim! O Vynlo Taste possui modo offline que permite continuar operando mesmo sem internet. Todos os dados são sincronizados automaticamente quando a conexão for restaurada, garantindo que nenhuma informação seja perdida.",
      category: "Funcionalidades",
      icon: Zap
    },
    {
      question: "Quanto tempo leva para migrar do sistema atual?",
      answer: "A migração completa leva em média 2-3 dias úteis. Nossa equipe especializada faz a transferência de todos os seus dados (cardápio, clientes, histórico) sem interrupção das operações. O processo é totalmente gratuito e acompanhado.",
      category: "Migração",
      icon: MessageCircle
    },
    {
      question: "O sistema é seguro para dados financeiros?",
      answer: "Absolutamente! Utilizamos criptografia SSL 256-bits e somos certificados PCI DSS para processamento de pagamentos. Todos os dados são armazenados em servidores AWS com backup automático e monitoramento 24/7.",
      category: "Segurança",
      icon: Shield
    },
    {
      question: "Posso integrar com meu sistema de delivery atual?",
      answer: "Sim! O Vynlo Taste possui integrações nativas com iFood, Uber Eats, Rappi e WhatsApp. Também oferecemos API para integrações personalizadas com outros sistemas que você já utiliza.",
      category: "Integrações",
      icon: MessageCircle
    },
    {
      question: "Como funciona o suporte técnico?",
      answer: "Oferecemos suporte 24/7 através de chat ao vivo, email e telefone. Planos Professional e Enterprise incluem suporte prioritário com resposta em até 2 horas. Também disponibilizamos tutoriais em vídeo e documentação completa.",
      category: "Suporte",
      icon: HelpCircle
    },
    {
      question: "Posso usar em múltiplas unidades?",
      answer: "Sim! O plano Enterprise permite gerenciar múltiplas unidades com dashboard consolidado, relatórios unificados e controle centralizado. Ideal para redes de restaurantes e franquias.",
      category: "Funcionalidades",
      icon: Zap
    },
    {
      question: "O sistema funciona em tablets e celulares?",
      answer: "Perfeitamente! O Vynlo Taste é 100% responsivo e funciona em qualquer dispositivo. Também oferecemos apps nativos para iOS e Android, otimizados para uso em restaurantes com interface touch-friendly.",
      category: "Funcionalidades",
      icon: Zap
    }
  ]

  const categories = [
    { name: "Teste e Onboarding", icon: Clock, count: 1 },
    { name: "Funcionalidades", icon: Zap, count: 3 },
    { name: "Migração", icon: MessageCircle, count: 1 },
    { name: "Segurança", icon: Shield, count: 1 },
    { name: "Integrações", icon: MessageCircle, count: 1 },
    { name: "Suporte", icon: HelpCircle, count: 1 }
  ]

  return (
    <section id="faq" className="py-24 bg-white relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-manrope font-medium text-sm mb-6">
            <HelpCircle className="w-4 h-4" />
            <span>Perguntas Frequentes</span>
          </div>
          
          <h2 className="text-5xl lg:text-6xl font-manrope font-bold text-gray-900 mb-6">
            Dúvidas
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              respondidas
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 font-manrope max-w-3xl mx-auto">
            Resolvemos as principais dúvidas sobre o Vynlo Taste para você tomar a melhor decisão
          </p>
        </div>

        {/* FAQ Categories */}
        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {categories.map((category, index) => {
            const IconComponent = category.icon
            return (
              <div 
                key={index}
                className="bg-white rounded-2xl p-4 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer border border-gray-200 hover:border-blue-300"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-3">
                  <IconComponent className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-sm font-manrope font-semibold text-gray-900">
                  {category.name}
                </div>
                <div className="text-xs text-gray-500 font-manrope">
                  {category.count} pergunta{category.count > 1 ? 's' : ''}
                </div>
              </div>
            )
          })}
        </div>

        {/* FAQ Items */}
        <div className="max-w-4xl mx-auto space-y-4 mb-16">
          {faqs.map((faq, index) => {
            const IconComponent = faq.icon
            const isOpen = openItems.includes(index)
            
            return (
              <div 
                key={index}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-xl faq-card"
              >
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-manrope font-semibold text-gray-900">
                        {faq.question}
                      </h3>
                      <div className="text-sm text-blue-600 font-manrope mt-1">
                        {faq.category}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0 ml-4">
                    {isOpen ? (
                      <ChevronUp className="w-6 h-6 text-blue-600" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                </button>
                
                {isOpen && (
                  <div className="px-8 pb-6 animate-slide-down">
                    <div className="border-t border-gray-200 pt-4">
                      <p className="text-gray-600 font-manrope leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white">
            <h3 className="text-3xl font-manrope font-bold mb-4">
              Ainda tem dúvidas?
            </h3>
            <p className="text-xl font-manrope mb-8 opacity-90">
              Nossa equipe especializada está pronta para te ajudar
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 font-manrope font-bold px-8 py-4 rounded-xl hover:bg-gray-100 transition-colors duration-300 transform hover:scale-105">
                Falar com Especialista
              </button>
              <button className="border-2 border-white text-white font-manrope font-bold px-8 py-4 rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105">
                Ver Documentação
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

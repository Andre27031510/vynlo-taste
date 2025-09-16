'use client'

import React, { useState } from 'react'
import { ChevronDown, MessageCircle, Calendar, TestTube, Settings, Shield, CreditCard, Smartphone, Headphones, Palette, FileText } from 'lucide-react'
import AppointmentModal from '../modals/AppointmentModal'

const faqData = [
  {
    id: 1,
    category: 'Teste',
    icon: TestTube,
    question: 'Posso testar o sistema antes de assinar?',
    answer: 'Sim! Oferecemos 14 dias de teste gratuito completo, sem limitações. Você pode testar todas as funcionalidades, integrar com seus sistemas atuais e ver os resultados reais no seu restaurante antes de tomar qualquer decisão.'
  },
  {
    id: 2,
    category: 'Funcionalidades',
    icon: Settings,
    question: 'Quais funcionalidades estão incluídas no sistema?',
    answer: 'O Vynlo Taste inclui: PDV completo, gestão de delivery (iFood, Rappi, Uber Eats), controle de estoque, relatórios financeiros, gestão de funcionários, cardápio digital, automação WhatsApp, e muito mais. Tudo integrado em uma única plataforma.'
  },
  {
    id: 3,
    category: 'Migração',
    icon: Settings,
    question: 'Como funciona a migração dos meus dados atuais?',
    answer: 'Nossa equipe técnica faz toda a migração gratuitamente. Transferimos seus produtos, clientes, histórico de vendas e configurações. O processo é rápido (1-2 dias) e você não perde nenhuma informação importante.'
  },
  {
    id: 4,
    category: 'Segurança',
    icon: Shield,
    question: 'Meus dados ficam seguros na nuvem?',
    answer: 'Absolutamente! Utilizamos criptografia de nível bancário, backup automático diário, servidores AWS com 99.9% de uptime e certificação ISO 27001. Seus dados estão mais seguros na nuvem do que em sistemas locais.'
  },
  {
    id: 5,
    category: 'Integrações',
    icon: Smartphone,
    question: 'O sistema integra com iFood, Rappi e outros apps?',
    answer: 'Sim! Temos integração nativa com todos os principais apps de delivery: iFood, Rappi, Uber Eats, 99Food. Os pedidos chegam automaticamente no seu sistema, sem digitação manual. Também integramos com WhatsApp Business.'
  },
  {
    id: 6,
    category: 'Preços',
    icon: CreditCard,
    question: 'Qual o valor mensal e há taxa de setup?',
    answer: 'Nossos planos começam em R$ 97/mês para restaurantes pequenos. O setup é GRATUITO e inclui instalação, treinamento e migração de dados. Sem taxas ocultas, sem fidelidade obrigatória.'
  },
  {
    id: 7,
    category: 'Equipamentos',
    icon: Smartphone,
    question: 'Preciso comprar equipamentos novos?',
    answer: 'Não necessariamente! O sistema funciona em qualquer computador, tablet ou smartphone. Se precisar de impressora térmica ou leitor de código de barras, oferecemos equipamentos com desconto especial.'
  },
  {
    id: 8,
    category: 'Suporte',
    icon: Headphones,
    question: 'Que tipo de suporte vocês oferecem?',
    answer: 'Suporte completo 7 dias por semana: WhatsApp, telefone, email e acesso remoto. Nossa equipe resolve 95% dos problemas em menos de 2 horas. Também oferecemos treinamento gratuito para sua equipe.'
  },
  {
    id: 9,
    category: 'Personalização',
    icon: Palette,
    question: 'Posso personalizar o sistema com minha marca?',
    answer: 'Sim! Você pode personalizar cores, logo, layout do cardápio, cupons fiscais e até mesmo criar seu próprio app de delivery com sua marca. Tudo incluído no plano, sem custo adicional.'
  },
  {
    id: 10,
    category: 'Contrato',
    icon: FileText,
    question: 'Há fidelidade ou posso cancelar quando quiser?',
    answer: 'Sem fidelidade! Você pode cancelar quando quiser, sem multas ou taxas. Acreditamos na qualidade do nosso serviço e queremos que você fique por escolha, não por obrigação.'
  }
]

export default function TasteFAQ() {
  const [openItems, setOpenItems] = useState<number[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  const toggleItem = (id: number) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  const handleWhatsAppContact = () => {
    const message = encodeURIComponent('Olá! Gostaria de falar com um especialista sobre o Vynlo Taste para meu restaurante.')
    window.open(`https://wa.me/5511999999999?text=${message}`, '_blank')
  }

  return (
    <section className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl lg:text-5xl font-manrope font-black text-gray-900 mb-8 leading-tight">
            Perguntas
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600">
              Frequentes
            </span>
          </h2>
          <p className="text-xl text-gray-600 font-manrope max-w-3xl mx-auto leading-relaxed">
            Tire suas dúvidas sobre o Vynlo Taste e descubra como podemos transformar seu restaurante
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {faqData.map((item) => {
              const IconComponent = item.icon
              const isOpen = openItems.includes(item.id)
              
              return (
                <div
                  key={item.id}
                  className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <button
                    onClick={() => toggleItem(item.id)}
                    className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 rounded-2xl transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                          <IconComponent className="w-5 h-5 text-blue-600" />
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-blue-600 font-medium mb-1">{item.category}</div>
                        <h3 className="text-lg font-semibold text-gray-900 font-manrope">
                          {item.question}
                        </h3>
                      </div>
                    </div>
                    <ChevronDown 
                      className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                        isOpen ? 'transform rotate-180' : ''
                      }`} 
                    />
                  </button>
                  
                  {isOpen && (
                    <div className="px-8 pb-6">
                      <div className="pl-14">
                        <p className="text-gray-600 font-manrope leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Ainda tem dúvidas?
              </h3>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Nossa equipe de especialistas está pronta para esclarecer todas as suas questões e mostrar como o Vynlo Taste pode transformar seu restaurante.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={handleWhatsAppContact}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-manrope font-bold px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Falar com Especialista</span>
                </button>
                
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="bg-white border-2 border-gray-200 text-gray-700 font-manrope font-bold px-8 py-4 rounded-xl hover:border-blue-300 hover:text-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Agendar Demonstração</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <AppointmentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </section>
  )
}
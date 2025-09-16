'use client'

import React, { useState } from 'react'
import { ChevronDown, MessageCircle, Calendar, Bot, Zap, Shield, Palette, GraduationCap, CreditCard, Headphones, BarChart3, TrendingUp } from 'lucide-react'
import AppointmentModal from '../modals/AppointmentModal'

const faqData = [
  {
    id: 1,
    category: 'Funcionamento',
    icon: Bot,
    question: 'Como funciona a IA Bot na prática?',
    answer: 'Nossa IA Bot utiliza machine learning avançado para automatizar processos, analisar dados e tomar decisões inteligentes. Ela aprende continuamente com cada interação, melhorando sua performance automaticamente e se adaptando às necessidades específicas do seu negócio.'
  },
  {
    id: 2,
    category: 'Integração',
    icon: Zap,
    question: 'A IA integra com meus sistemas atuais?',
    answer: 'Sim! Nossa IA Bot possui APIs nativas e conectores para os principais sistemas empresariais: CRM, ERP, e-commerce, WhatsApp Business, redes sociais e muito mais. A integração é rápida e não requer alterações nos seus sistemas existentes.'
  },
  {
    id: 3,
    category: 'Segurança',
    icon: Shield,
    question: 'Como é garantida a segurança dos dados na IA?',
    answer: 'Utilizamos criptografia de nível militar (256-bit), compliance total com LGPD, servidores seguros na AWS e auditoria completa de todas as operações. Sua IA Bot opera em ambiente isolado e seguro, com backup automático e monitoramento 24/7.'
  },
  {
    id: 4,
    category: 'Personalização',
    icon: Palette,
    question: 'Posso personalizar a IA para meu negócio?',
    answer: 'Absolutamente! A IA Bot é totalmente personalizável: fluxos de trabalho, interface, respostas, análises e até mesmo a personalidade do bot. Você pode treinar a IA com seus próprios dados e processos específicos, criando uma solução única para seu negócio.'
  },
  {
    id: 5,
    category: 'Treinamento',
    icon: GraduationCap,
    question: 'Preciso treinar a IA ou ela já vem pronta?',
    answer: 'A IA já vem pré-treinada com conhecimentos gerais, mas oferecemos treinamento personalizado gratuito. Nossa equipe configura a IA especificamente para seu negócio, treina com seus dados e processos, garantindo máxima eficiência desde o primeiro dia.'
  },
  {
    id: 6,
    category: 'Custos',
    icon: CreditCard,
    question: 'Como funciona o investimento em IA?',
    answer: 'Oferecemos planos flexíveis baseados no uso e complexidade da IA. Inclui setup gratuito, treinamento personalizado, suporte 24/7 e atualizações automáticas. O ROI médio é de 200% em 6 meses. Entre em contato para uma proposta personalizada.'
  },
  {
    id: 7,
    category: 'Suporte',
    icon: Headphones,
    question: 'Que suporte é oferecido para a IA?',
    answer: 'Suporte especializado 24/7 com engenheiros de IA: WhatsApp, telefone, email e acesso remoto. Monitoramento proativo da IA, atualizações automáticas, treinamento contínuo da equipe e consultoria estratégica para otimização constante.'
  },
  {
    id: 8,
    category: 'Escalabilidade',
    icon: BarChart3,
    question: 'A IA cresce junto com meu negócio?',
    answer: 'Sim! Nossa IA Bot é altamente escalável, processando desde centenas até milhões de interações. A infraestrutura se adapta automaticamente ao crescimento, mantendo performance otimizada. Você paga apenas pelo que usa, sem limites de crescimento.'
  },
  {
    id: 9,
    category: 'Compliance',
    icon: Shield,
    question: 'A IA atende às regulamentações legais?',
    answer: 'Totalmente! Nossa IA Bot está em compliance com LGPD, GDPR, SOX e outras regulamentações. Possui auditoria completa, logs detalhados, controle de acesso e certificações de segurança. Ideal para setores regulamentados como saúde e finanças.'
  },
  {
    id: 10,
    category: 'ROI',
    icon: TrendingUp,
    question: 'Qual o retorno sobre investimento da IA?',
    answer: 'Nossos clientes obtêm ROI médio de 200% em 6 meses: +80% automação, -90% tempo de processos, +60% precisão nas decisões. A IA paga por si mesma rapidamente através da redução de custos operacionais e aumento de eficiência.'
  }
]

export default function IABotFAQ() {
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
    const message = encodeURIComponent('Olá! Gostaria de falar com um especialista sobre IA Bot para meu negócio.')
    window.open(`https://wa.me/5511999999999?text=${message}`, '_blank')
  }

  return (
    <section className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl lg:text-5xl font-manrope font-black text-gray-900 mb-8 leading-tight">
            Perguntas sobre
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600">
              IA Bot
            </span>
          </h2>
          <p className="text-xl text-gray-600 font-manrope max-w-3xl mx-auto leading-relaxed">
            Tire suas dúvidas sobre nossa Inteligência Artificial e descubra como ela pode revolucionar seu negócio
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
                Pronto para implementar IA?
              </h3>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Nossa equipe de especialistas em IA está pronta para mostrar como a inteligência artificial pode transformar seu negócio.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={handleWhatsAppContact}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-manrope font-bold px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Falar com Especialista IA</span>
                </button>
                
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="bg-white border-2 border-gray-200 text-gray-700 font-manrope font-bold px-8 py-4 rounded-xl hover:border-blue-300 hover:text-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Agendar Demo IA</span>
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
'use client'

import React, { useState } from 'react'
import { ChevronDown, ChevronUp, MessageCircle } from 'lucide-react'
import AppointmentModal from '@/components/modals/AppointmentModal'

export default function ServicosFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const faqs = [
    {
      question: 'Como fazer o sistema para meu negócio?',
      answer: 'Sistema completo com cadastro de clientes, histórico de projetos, contratos digitais e comunicação centralizada para melhor relacionamento.'
    },
    {
      question: 'Posso personalizar com minhas cores do negócio?',
      answer: 'Sim, gestão completa de contratos, propostas comerciais, aprovações digitais e acompanhamento de status em tempo real.'
    },
    {
      question: 'Tem suporte?',
      answer: 'Gestão completa com cronogramas, entregas, marcos do projeto, acompanhamento de progresso e relatórios de performance.'
    },
    {
      question: 'Como funciona a segurança dos meus dados?',
      answer: 'Sistema inteligente para agendamento de visitas, reuniões, execução de serviços com confirmação automática e lembretes.'
    },
    {
      question: 'O sistema integra com Pix? Saga e outros bancos?',
      answer: 'Controle completo de orçamentos, faturamento automático, controle de pagamentos e análise financeira detalhada por projeto.'
    },
    {
      question: 'Como funciona o treinamento e a hora de usar?',
      answer: 'Suporte 24/7 especializado em gestão de serviços, treinamento completo e acompanhamento personalizado para seu negócio.'
    },
    {
      question: 'Posso integrar equipamentos novos?',
      answer: 'Sistema adaptável para diferentes tipos de prestação de serviços com configurações específicas para cada área.'
    },
    {
      question: 'Que tipo de segurança vocês oferecem?',
      answer: 'Máxima segurança com criptografia avançada, backup automático e controle de acesso para proteger dados dos clientes.'
    },
    {
      question: 'Posso personalizar o sistema com minha marca?',
      answer: 'Sim, personalização completa com cores, logo e identidade visual do seu negócio, mantendo a funcionalidade profissional.'
    },
    {
      question: 'O sistema se pode conectar quando quiser?',
      answer: 'Sistema funciona online e offline com sincronização automática, garantindo acesso contínuo aos dados dos projetos.'
    }
  ]

  const handleOpenModal = () => setIsModalOpen(true)
  const handleCloseModal = () => setIsModalOpen(false)
  const handleWhatsApp = () => {
    window.open('https://wa.me/5511999999999?text=Olá! Gostaria de saber mais sobre o sistema para prestadores de serviços.', '_blank')
  }

  return (
    <>
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-manrope font-black text-gray-900 mb-6">
              Perguntas
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600">
                Frequentes
              </span>
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Tire suas dúvidas sobre como nosso sistema pode transformar seu negócio
            </p>
          </div>

          <div className="space-y-4 mb-16">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-gray-50 border border-gray-100 rounded-2xl overflow-hidden hover:border-blue-200 hover:shadow-lg transition-all duration-300"
              >
                <button
                  className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-100 transition-colors"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                >
                  <span className="font-manrope font-bold text-gray-900 text-lg pr-8">
                    {faq.question}
                  </span>
                  {openIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                
                {openIndex === index && (
                  <div className="px-8 pb-6">
                    <div className="border-t border-gray-200 pt-6">
                      <p className="text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl">
            <h3 className="text-2xl font-manrope font-bold text-gray-900 mb-4">
              Que tal começar agora mesmo?
            </h3>
            <p className="text-gray-600 mb-8">
              Nossa equipe está pronta para ajudar você a transformar seu negócio
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleWhatsApp}
                className="inline-flex items-center space-x-2 bg-green-600 text-white font-manrope font-bold px-8 py-4 rounded-xl hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <MessageCircle className="w-5 h-5" />
                <span>WhatsApp</span>
              </button>
              <button
                onClick={handleOpenModal}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-manrope font-bold px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Agendar Demonstração
              </button>
            </div>
          </div>
        </div>
      </section>

      <AppointmentModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
      />
    </>
  )
}
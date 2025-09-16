'use client'

import React, { useState } from 'react'
import { ChevronDown, ChevronUp, Scissors, Calendar, MessageCircle } from 'lucide-react'
import AppointmentModal from '@/components/modals/AppointmentModal'

export default function BarbeariasFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const faqCategories = [
    {
      icon: Scissors,
      title: 'Agendamento e Serviços',
      questions: [
        {
          question: 'Como funciona o agendamento online?',
          answer: 'Sistema completo com disponibilidade em tempo real, escolha de barbeiro, confirmação automática e lembretes por WhatsApp.'
        },
        {
          question: 'Posso personalizar os serviços?',
          answer: 'Totalmente personalizável com catálogo de serviços, preços dinâmicos, tempo de execução e especialidades por barbeiro.'
        }
      ]
    },
    {
      icon: Calendar,
      title: 'Gestão e Controle',
      questions: [
        {
          question: 'O sistema controla a agenda dos barbeiros?',
          answer: 'Sim, controle individual por barbeiro com horários disponíveis, bloqueios, folgas e gestão de capacidade por serviço.'
        },
        {
          question: 'Como funciona o controle financeiro?',
          answer: 'Gestão completa com faturamento automático, controle de comissões, relatórios por barbeiro e análise de performance.'
        }
      ]
    },
    {
      icon: MessageCircle,
      title: 'Fidelidade e Suporte',
      questions: [
        {
          question: 'Tem programa de fidelidade?',
          answer: 'Sistema completo de fidelidade com pontos, descontos progressivos e campanhas personalizadas para cada cliente.'
        },
        {
          question: 'Tem suporte técnico?',
          answer: 'Suporte 24/7 especializado em barbearias, treinamento completo e acompanhamento personalizado.'
        }
      ]
    }
  ]

  const handleOpenModal = () => setIsModalOpen(true)
  const handleCloseModal = () => setIsModalOpen(false)
  const handleWhatsApp = () => {
    window.open('https://wa.me/5511999999999?text=Olá! Gostaria de saber mais sobre o sistema para barbearias.', '_blank')
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
              Esclarecemos as principais dúvidas sobre nosso sistema para barbearias
            </p>
          </div>

          {faqCategories.map((category, categoryIndex) => {
            const IconComponent = category.icon
            return (
              <div key={categoryIndex} className="mb-12">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-manrope font-bold text-gray-900">{category.title}</h3>
                </div>

                <div className="space-y-4">
                  {category.questions.map((faq, questionIndex) => {
                    const globalIndex = categoryIndex * 10 + questionIndex
                    return (
                      <div
                        key={globalIndex}
                        className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-blue-200 transition-colors shadow-sm"
                      >
                        <button
                          className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                          onClick={() => setOpenIndex(openIndex === globalIndex ? null : globalIndex)}
                        >
                          <span className="font-manrope font-bold text-gray-900 text-lg pr-8">
                            {faq.question}
                          </span>
                          {openIndex === globalIndex ? (
                            <ChevronUp className="w-5 h-5 text-blue-600 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                          )}
                        </button>
                        
                        {openIndex === globalIndex && (
                          <div className="px-8 pb-6">
                            <div className="border-t border-gray-100 pt-6">
                              <p className="text-gray-600 leading-relaxed">
                                {faq.answer}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}

          <div className="text-center mt-16 p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl">
            <h3 className="text-2xl font-manrope font-bold text-gray-900 mb-4">
              Ainda tem dúvidas?
            </h3>
            <p className="text-gray-600 mb-8">
              Nossa equipe está pronta para ajudar você a transformar sua barbearia
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
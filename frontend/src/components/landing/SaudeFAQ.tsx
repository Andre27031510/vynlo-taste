'use client'

import React, { useState } from 'react'
import { ChevronDown, ChevronUp, MessageCircle } from 'lucide-react'
import AppointmentModal from '@/components/modals/AppointmentModal'

export default function SaudeFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const faqs = [
    {
      question: 'Como fazer o sistema para minha clínica?',
      answer: 'Prontuário digital completo com histórico médico, exames, prescrições, evolução do paciente e integração com equipamentos médicos.'
    },
    {
      question: 'Posso personalizar com minhas cores da clínica?',
      answer: 'Sim, agendamento inteligente com disponibilidade em tempo real, confirmação automática, lembretes por SMS e integração com agenda médica.'
    },
    {
      question: 'Tem suporte?',
      answer: 'Perfeitamente integrado com todos os convênios, faturamento TISS automático, autorização de procedimentos e controle de glosas.'
    },
    {
      question: 'Como funciona a segurança dos meus dados?',
      answer: 'Sim, plataforma completa de telemedicina com videochamada, prescrição digital, atestados eletrônicos e integração com prontuário.'
    },
    {
      question: 'O sistema integra com Pix? Saga e outros bancos?',
      answer: 'Máxima segurança com criptografia de ponta, conformidade LGPD, backup automático e controle de acesso por níveis.'
    },
    {
      question: 'Como funciona o treinamento e a hora de usar?',
      answer: 'Suporte 24/7 com equipe especializada em sistemas médicos, treinamento completo e acompanhamento técnico personalizado.'
    },
    {
      question: 'Posso integrar equipamentos novos?',
      answer: 'Sim, adaptável para todas as especialidades médicas com templates específicos, protocolos personalizados e campos customizáveis.'
    },
    {
      question: 'Que tipo de segurança vocês oferecem?',
      answer: 'Máxima proteção dos dados médicos com criptografia avançada, conformidade LGPD e backup automático.'
    },
    {
      question: 'Posso personalizar o sistema com minha marca?',
      answer: 'Sim, personalização completa com cores, logo e identidade visual da sua clínica, mantendo a funcionalidade profissional.'
    },
    {
      question: 'O sistema se pode conectar quando quiser?',
      answer: 'Sistema funciona online e offline com sincronização automática, garantindo acesso contínuo aos dados médicos.'
    }
  ]

  const handleOpenModal = () => setIsModalOpen(true)
  const handleCloseModal = () => setIsModalOpen(false)
  const handleWhatsApp = () => {
    window.open('https://wa.me/5511999999999?text=Olá! Gostaria de saber mais sobre o sistema para clínicas.', '_blank')
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
              Tire suas dúvidas sobre como nosso sistema pode transformar sua clínica
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
              Nossa equipe está pronta para ajudar você a transformar sua clínica
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
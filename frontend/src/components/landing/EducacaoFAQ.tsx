'use client'

import React, { useState } from 'react'
import { ChevronDown, ChevronUp, MessageCircle } from 'lucide-react'
import AppointmentModal from '@/components/modals/AppointmentModal'

export default function EducacaoFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const faqs = [
    {
      question: 'Como fazer o sistema para minha escola?',
      answer: 'Sistema completo de matrículas online com documentação digital, controle de vagas por turma, lista de espera automática e integração com sistema financeiro.'
    },
    {
      question: 'Posso personalizar com minhas cores da escola?',
      answer: 'Sim, controle total de notas por disciplina, cálculo automático de médias, registro de frequência e relatórios de desempenho para pais e alunos.'
    },
    {
      question: 'Tem suporte?',
      answer: 'Portal completo com acesso a notas, frequência, calendário escolar, comunicados, boletos e acompanhamento pedagógico em tempo real.'
    },
    {
      question: 'Como funciona a segurança dos meus dados?',
      answer: 'Gestão completa de mensalidades, geração automática de boletos, controle de inadimplência, relatórios financeiros e integração bancária.'
    },
    {
      question: 'O sistema integra com Pix? Saga e outros bancos?',
      answer: 'Dashboards completos com desempenho por turma, disciplina, professor, análise de aproveitamento e relatórios personalizados.'
    },
    {
      question: 'Como funciona o treinamento e a hora de usar?',
      answer: 'Máxima segurança com criptografia avançada, backup automático, conformidade LGPD e controle de acesso por perfis.'
    },
    {
      question: 'Posso integrar equipamentos novos?',
      answer: 'Sim, adaptável para educação infantil, fundamental, médio, técnico e superior com configurações específicas para cada modalidade.'
    },
    {
      question: 'Que tipo de segurança vocês oferecem?',
      answer: 'Suporte 24/7 com equipe especializada em gestão educacional, treinamento completo e acompanhamento pedagógico.'
    },
    {
      question: 'Posso personalizar o sistema com minha marca?',
      answer: 'Sim, personalização completa com cores, logo e identidade visual da sua escola, mantendo a funcionalidade profissional.'
    },
    {
      question: 'O sistema se pode conectar quando quiser?',
      answer: 'Sistema funciona online e offline com sincronização automática, garantindo acesso contínuo aos dados da escola.'
    }
  ]

  const handleOpenModal = () => setIsModalOpen(true)
  const handleCloseModal = () => setIsModalOpen(false)
  const handleWhatsApp = () => {
    window.open('https://wa.me/5511999999999?text=Olá! Gostaria de saber mais sobre o sistema para escolas.', '_blank')
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
              Tire suas dúvidas sobre como nosso sistema pode transformar sua escola
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
              Nossa equipe está pronta para ajudar você a transformar sua escola
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
'use client'

import { useState } from 'react'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  MessageCircle, 
  Send,
  CheckCircle
} from 'lucide-react'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: '',
    restaurantType: '',
    employees: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simular envio do formulário
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({
        name: '',
        email: '',
        company: '',
        phone: '',
        message: '',
        restaurantType: '',
        employees: ''
      })
    }, 3000)
  }

  const contactInfo = [
    {
      icon: Phone,
      title: "Telefone",
      value: "(11) 99999-9999",
      subtitle: "Segunda a Sexta, 8h às 18h",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Mail,
      title: "Email",
      value: "contato@vynlotaste.com",
      subtitle: "Resposta em até 2 horas",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: MapPin,
      title: "Endereço",
      value: "Av. Paulista, 1000",
      subtitle: "São Paulo - SP, 01310-100",
      color: "from-green-500 to-green-600"
    },
    {
      icon: Clock,
      title: "Suporte",
      value: "24/7",
      subtitle: "Chat, email e telefone",
      color: "from-orange-500 to-orange-600"
    }
  ]

  const restaurantTypes = [
    "Restaurante Gourmet",
    "Pizzaria & Fast Food",
    "Cafeteria & Bistrô",
    "Rede & Franquias",
    "Food Truck",
    "Outro"
  ]

  const employeeRanges = [
    "1-5 funcionários",
    "6-15 funcionários",
    "16-30 funcionários",
    "31-50 funcionários",
    "50+ funcionários"
  ]

  return (
    <section id="contact" className="py-24 bg-gradient-to-br from-vynlo-dark via-gray-900 to-black relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-6">
            <MessageCircle className="w-4 h-4 text-blue-400" />
            <span>Entre em Contato</span>
          </div>
          
          <h2 className="text-5xl lg:text-6xl font-manrope font-bold text-white mb-6">
            Vamos conversar
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              sobre seu projeto
            </span>
          </h2>
          
          <p className="text-xl text-gray-300 font-manrope max-w-3xl mx-auto">
            Nossa equipe especializada está pronta para entender suas necessidades e mostrar como o Vynlo Taste pode transformar seu restaurante
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-gray-700">
            <h3 className="text-2xl font-manrope font-bold text-white mb-6">
              Solicite uma demonstração
            </h3>

            {isSubmitted ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <h4 className="text-2xl font-manrope font-bold text-white mb-2">
                  Mensagem enviada!
                </h4>
                <p className="text-gray-300 font-manrope">
                  Entraremos em contato em até 2 horas úteis.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 font-manrope font-medium mb-2">
                      Nome completo *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-white/10 border border-gray-600 rounded-xl px-4 py-3 text-white font-manrope placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors duration-200"
                      placeholder="Seu nome"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 font-manrope font-medium mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-white/10 border border-gray-600 rounded-xl px-4 py-3 text-white font-manrope placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors duration-200"
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 font-manrope font-medium mb-2">
                      Nome do restaurante
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full bg-white/10 border border-gray-600 rounded-xl px-4 py-3 text-white font-manrope placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors duration-200"
                      placeholder="Nome do estabelecimento"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 font-manrope font-medium mb-2">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full bg-white/10 border border-gray-600 rounded-xl px-4 py-3 text-white font-manrope placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors duration-200"
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 font-manrope font-medium mb-2">
                      Tipo de restaurante
                    </label>
                    <select
                      name="restaurantType"
                      value={formData.restaurantType}
                      onChange={handleInputChange}
                      className="w-full bg-white/10 border border-gray-600 rounded-xl px-4 py-3 text-white font-manrope focus:outline-none focus:border-blue-500 transition-colors duration-200"
                    >
                      <option value="">Selecione...</option>
                      {restaurantTypes.map((type, index) => (
                        <option key={index} value={type} className="bg-gray-800 text-white">
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 font-manrope font-medium mb-2">
                      Número de funcionários
                    </label>
                    <select
                      name="employees"
                      value={formData.employees}
                      onChange={handleInputChange}
                      className="w-full bg-white/10 border border-gray-600 rounded-xl px-4 py-3 text-white font-manrope focus:outline-none focus:border-blue-500 transition-colors duration-200"
                    >
                      <option value="">Selecione...</option>
                      {employeeRanges.map((range, index) => (
                        <option key={index} value={range} className="bg-gray-800 text-white">
                          {range}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 font-manrope font-medium mb-2">
                    Mensagem
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full bg-white/10 border border-gray-600 rounded-xl px-4 py-3 text-white font-manrope placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors duration-200 resize-none"
                    placeholder="Conte-nos sobre suas necessidades..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 text-white font-manrope font-bold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Enviando...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Enviar Mensagem</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-manrope font-bold text-white mb-6">
                Informações de contato
              </h3>
              <p className="text-gray-300 font-manrope leading-relaxed mb-8">
                Nossa equipe está sempre disponível para ajudar você a encontrar a melhor solução para seu restaurante.
              </p>
            </div>

            <div className="space-y-6">
              {contactInfo.map((info, index) => {
                const IconComponent = info.icon
                return (
                  <div 
                    key={index}
                    className="flex items-start space-x-4 group cursor-pointer transform hover:scale-105 transition-all duration-300"
                  >
                    <div className={`w-12 h-12 bg-gradient-to-r ${info.color} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-manrope font-semibold text-white mb-1">
                        {info.title}
                      </h4>
                      <p className="text-blue-400 font-manrope font-medium">
                        {info.value}
                      </p>
                      <p className="text-gray-400 font-manrope text-sm">
                        {info.subtitle}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Additional Info */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-gray-700">
              <h4 className="text-lg font-manrope font-semibold text-white mb-4">
                Por que escolher o Vynlo Taste?
              </h4>
              <div className="space-y-3">
                {[
                  "✓ Demonstração personalizada para seu negócio",
                  "✓ Suporte especializado para restaurantes",
                  "✓ Migração gratuita e acompanhada",
                  "✓ Teste gratuito por 14 dias"
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span className="text-green-400 font-manrope">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-20">
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-blue-500/30 rounded-3xl p-12">
            <h3 className="text-3xl font-manrope font-bold text-white mb-4">
              Pronto para transformar seu restaurante?
            </h3>
            <p className="text-xl font-manrope text-gray-300 mb-8">
              Comece seu teste gratuito hoje mesmo e veja a diferença
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-manrope font-bold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105">
                Começar Teste Grátis
              </button>
              <button className="border-2 border-white text-white font-manrope font-bold px-8 py-4 rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105">
                Agendar Demonstração
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

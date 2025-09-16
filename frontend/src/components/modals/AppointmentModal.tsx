'use client'

import React, { useState, useEffect } from 'react'
import { X, Calendar, Clock, User, Building, Phone, Mail, MessageSquare, CheckCircle2, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
import { newsletterService, AppointmentData } from '../../services/newsletterService'

interface AppointmentModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AppointmentModal({ isOpen, onClose }: AppointmentModalProps) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState<Partial<AppointmentData>>({
    type: 'demo',
    segment: 'restaurantes'
  })
  
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [currentMonth, setCurrentMonth] = useState(new Date())

  useEffect(() => {
    if (isOpen) {
      setStep(1)
      setSuccess(false)
      setError('')
      setFormData({ type: 'demo', segment: 'restaurantes' })
      setSelectedDate('')
      setSelectedTime('')
    }
  }, [isOpen])

  useEffect(() => {
    if (selectedDate) {
      const slots = newsletterService.getAvailableSlots(selectedDate)
      setAvailableSlots(slots)
      setSelectedTime('')
    }
  }, [selectedDate])

  const handleInputChange = (field: keyof AppointmentData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError('')
  }

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.company || !selectedDate || !selectedTime) {
      setError('Preencha todos os campos obrigatórios')
      return
    }

    setLoading(true)
    setError('')

    try {
      const appointmentData: AppointmentData = {
        ...formData as AppointmentData,
        date: selectedDate,
        time: selectedTime
      }

      const result = await newsletterService.scheduleAppointment(appointmentData)
      
      if (result.success) {
        setSuccess(true)
        setTimeout(() => {
          onClose()
        }, 3000)
      } else {
        setError(result.message)
      }
    } catch (err) {
      setError('Erro ao agendar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())
    
    const days = []
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)
      
      const isCurrentMonth = date.getMonth() === month
      const isPast = date < today
      const isWeekend = date.getDay() === 0 || date.getDay() === 6
      const dateStr = date.toISOString().split('T')[0]
      
      days.push({
        date: date.getDate(),
        dateStr,
        isCurrentMonth,
        isPast,
        isWeekend,
        isAvailable: isCurrentMonth && !isPast && !isWeekend
      })
    }
    
    return days
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
        
        <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Agendar Demonstração</h2>
                <p className="text-blue-100 mt-1">Vamos mostrar como a Vynlo pode transformar seu negócio</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex items-center mt-6 space-x-4">
              {[1, 2, 3].map((num) => (
                <div key={num} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    step >= num ? 'bg-white text-blue-600' : 'bg-white/20 text-white/60'
                  }`}>
                    {success && num === 3 ? <CheckCircle2 className="w-5 h-5" /> : num}
                  </div>
                  {num < 3 && <div className={`w-12 h-1 mx-2 ${step > num ? 'bg-white' : 'bg-white/20'}`} />}
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            {success ? (
              <div className="text-center py-12">
                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Agendamento Confirmado!</h3>
                <p className="text-gray-600 mb-4">Você receberá um email de confirmação em breve.</p>
                <p className="text-sm text-gray-500">Este modal será fechado automaticamente...</p>
              </div>
            ) : (
              <>
                {step === 1 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Suas Informações</h3>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <User className="w-4 h-4 inline mr-2" />
                          Nome Completo *
                        </label>
                        <input
                          type="text"
                          value={formData.name || ''}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Seu nome completo"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Mail className="w-4 h-4 inline mr-2" />
                          Email *
                        </label>
                        <input
                          type="email"
                          value={formData.email || ''}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="seu@email.com"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Phone className="w-4 h-4 inline mr-2" />
                          Telefone *
                        </label>
                        <input
                          type="tel"
                          value={formData.phone || ''}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="(11) 99999-9999"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Building className="w-4 h-4 inline mr-2" />
                          Empresa *
                        </label>
                        <input
                          type="text"
                          value={formData.company || ''}
                          onChange={(e) => handleInputChange('company', e.target.value)}
                          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Nome da sua empresa"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Segmento do Negócio *</label>
                      <select
                        value={formData.segment || ''}
                        onChange={(e) => handleInputChange('segment', e.target.value)}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="restaurantes">Restaurantes</option>
                        <option value="barbearias">Barbearias</option>
                        <option value="petshops">Pet Shops</option>
                        <option value="igrejas">Igrejas</option>
                        <option value="educacao">Educação</option>
                        <option value="saude">Saúde</option>
                        <option value="servicos">Serviços</option>
                        <option value="outros">Outros</option>
                      </select>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Escolha Data e Horário</h3>
                    
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium text-gray-900">
                            {currentMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                          </h4>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                              className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                              className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-7 gap-1 mb-2">
                          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                            <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                              {day}
                            </div>
                          ))}
                        </div>
                        
                        <div className="grid grid-cols-7 gap-1">
                          {generateCalendarDays().map((day, index) => (
                            <button
                              key={index}
                              onClick={() => day.isAvailable ? setSelectedDate(day.dateStr) : null}
                              disabled={!day.isAvailable}
                              className={`p-2 text-sm rounded-lg transition-colors ${
                                !day.isCurrentMonth ? 'text-gray-300' :
                                !day.isAvailable ? 'text-gray-400 cursor-not-allowed' :
                                selectedDate === day.dateStr ? 'bg-blue-600 text-white' :
                                'hover:bg-blue-50 text-gray-900'
                              }`}
                            >
                              {day.date}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-4">Horários Disponíveis</h4>
                        {selectedDate ? (
                          <div className="grid grid-cols-2 gap-2">
                            {availableSlots.map((time) => (
                              <button
                                key={time}
                                onClick={() => setSelectedTime(time)}
                                className={`p-3 text-sm rounded-lg border transition-colors ${
                                  selectedTime === time 
                                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                                }`}
                              >
                                {time}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 text-center py-8">Selecione uma data para ver os horários</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Confirmar Agendamento</h3>
                    
                    <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm text-gray-500">Nome:</span>
                          <p className="font-medium">{formData.name}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Email:</span>
                          <p className="font-medium">{formData.email}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Empresa:</span>
                          <p className="font-medium">{formData.company}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Data:</span>
                          <p className="font-medium">{selectedDate && new Date(selectedDate).toLocaleDateString('pt-BR')}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Horário:</span>
                          <p className="font-medium">{selectedTime}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 mt-6">
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}

                <div className="flex justify-between mt-8 pt-6 border-t">
                  <button
                    onClick={() => step > 1 ? setStep(step - 1) : onClose()}
                    className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    {step === 1 ? 'Cancelar' : 'Voltar'}
                  </button>
                  
                  <button
                    onClick={() => step < 3 ? setStep(step + 1) : handleSubmit()}
                    disabled={loading || (step === 1 && (!formData.name || !formData.email || !formData.phone || !formData.company)) || (step === 2 && (!selectedDate || !selectedTime))}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : step < 3 ? (
                      'Próximo'
                    ) : (
                      'Confirmar Agendamento'
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
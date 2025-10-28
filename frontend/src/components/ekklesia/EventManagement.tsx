'use client'

import React, { useEffect, useState } from 'react'
import { Calendar, Plus, MapPin, Clock, Users, Eye } from 'lucide-react'
import { apiRequest } from '@/services/api'

type Event = {
  id: number
  title: string
  description?: string
  eventType: string
  category?: string
  location?: string
  startDate: string
  endDate?: string
  expectedAttendance?: number
  status: string
}

const EVENT_TYPES = [
  'Culto', 'Escola Dominical', 'Culto de Doutrina', 'Culto de Oração',
  'Culto de Jovens', 'Culto Infantil', 'Conferência', 'Retiro',
  'Reunião de Célula', 'Oração do Meio Dia', 'Vigília', 'Evangelização'
]

export default function EventManagement() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

  useEffect(() => {
    // Aguardar inicialização do Firebase Auth
    const timer = setTimeout(() => {
      fetchEvents()
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const fetchEvents = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await apiRequest('core-service', '/v1/ekklesia/events?size=100')
      const json = await res.json()
      setEvents(json.content || [])
    } catch (e: any) {
      setError(e.message || 'Falha ao carregar eventos')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'ONGOING': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'COMPLETED': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
      case 'CANCELLED': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Eventos e Cultos</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Gestão de eventos e cultos da igreja</p>
        </div>
        <button
          onClick={() => {
            setSelectedEvent(null)
            setShowModal(true)
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Registrar Evento
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {!loading && events.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          Nenhum evento cadastrado
        </div>
      )}

      {!loading && events.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map(event => (
            <div
              key={event.id}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{event.title}</h4>
                  <span className={`inline-block px-2 py-1 rounded text-xs ${getStatusColor(event.status)}`}>
                    {event.eventType}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(event.startDate)}</span>
                </div>
                {event.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span className="truncate">{event.location}</span>
                  </div>
                )}
                {event.expectedAttendance && (
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>Esperados: {event.expectedAttendance}</span>
                  </div>
                )}
              </div>

              {event.description && (
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {event.description}
                </p>
              )}

              <button
                onClick={() => {
                  setSelectedEvent(event)
                  setShowModal(true)
                }}
                className="mt-4 w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Ver Detalhes
              </button>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <EventModal
          event={selectedEvent}
          onClose={() => {
            setShowModal(false)
            setSelectedEvent(null)
          }}
          onSuccess={fetchEvents}
        />
      )}
    </div>
  )
}

const EventModal: React.FC<{ event: Event | null; onClose: () => void; onSuccess: () => void }> = ({ event, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    title: event?.title || '',
    description: event?.description || '',
    eventType: event?.eventType || '',
    location: event?.location || '',
    startDate: event?.startDate ? new Date(event.startDate).toISOString().slice(0, 16) : '',
    endDate: event?.endDate ? new Date(event.endDate).toISOString().slice(0, 16) : '',
    expectedAttendance: event?.expectedAttendance?.toString() || ''
  })
  const [submitting, setSubmitting] = useState(false)

  const submit = async () => {
    if (!form.title || !form.eventType || !form.startDate) return

    setSubmitting(true)
    try {
      const isEdit = !!event
      const url = isEdit 
        ? `/v1/ekklesia/events/${event.id}` 
        : '/v1/ekklesia/events'
      
      const body = {
        title: form.title,
        description: form.description,
        eventType: form.eventType,
        location: form.location,
        startDate: form.startDate,
        endDate: form.endDate || null,
        expectedAttendance: form.expectedAttendance ? parseInt(form.expectedAttendance) : null,
        status: 'SCHEDULED'
      }

      const res = await apiRequest('core-service', url, {
        method: isEdit ? 'PUT' : 'POST',
        body: JSON.stringify(body)
      })

      if (!res.ok) throw new Error('Falha ao salvar')
      onSuccess()
      onClose()
    } catch (e) {
      console.error(e)
      alert('Erro ao salvar evento')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-xl font-bold text-gray-900 dark:text-white">
            {event ? 'Editar Evento' : 'Registrar Evento'}
          </h4>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">✕</button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Título do Evento *
            </label>
            <input
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              placeholder="Ex: Culto de Domingo"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tipo de Evento *
            </label>
            <select
              value={form.eventType}
              onChange={e => setForm({ ...form, eventType: e.target.value })}
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            >
              <option value="">Selecione</option>
              {EVENT_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Data e Hora de Início *
              </label>
              <input
                type="datetime-local"
                value={form.startDate}
                onChange={e => setForm({ ...form, startDate: e.target.value })}
                className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Data e Hora de Término
              </label>
              <input
                type="datetime-local"
                value={form.endDate}
                onChange={e => setForm({ ...form, endDate: e.target.value })}
                className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Local
            </label>
            <input
              value={form.location}
              onChange={e => setForm({ ...form, location: e.target.value })}
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              placeholder="Ex: Templo Central"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Pessoas Esperadas
            </label>
            <input
              type="number"
              value={form.expectedAttendance}
              onChange={e => setForm({ ...form, expectedAttendance: e.target.value })}
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              placeholder="Ex: 100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Observações
            </label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              placeholder="Detalhes adicionais sobre o evento"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            Cancelar
          </button>
          <button
            disabled={submitting || !form.title || !form.eventType || !form.startDate}
            onClick={submit}
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {submitting ? 'Salvando...' : event ? 'Atualizar' : 'Registrar Evento'}
          </button>
        </div>
      </div>
    </div>
  )
}

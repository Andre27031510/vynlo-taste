'use client'

import React, { useEffect, useState } from 'react'
import { Search, Plus, Building2, Eye, Users } from 'lucide-react'
import { apiRequest } from '@/services/api'

type Church = {
  id: number
  nomeIgreja: string
  porte: string
  cidade: string
}

type Department = {
  id: number
  departmentType: string
  leaderName: string
  leaderPhone: string
  churchId: number
}

const DEPARTMENT_TYPES = [
  'Jovens', 'Infantil', 'Social', 'Adolescentes', 'Financeiro', 
  'Livraria', 'Estudos', 'Visitas', 'Evangelismos', 'Obreiros', 'Obreiras'
]

export default function MinistryManagement() {
  const [churches, setChurches] = useState<Church[]>([])
  const [filteredChurches, setFilteredChurches] = useState<Church[]>([])
  const [search, setSearch] = useState('')
  const [selectedChurch, setSelectedChurch] = useState<Church | null>(null)
  const [showRegister, setShowRegister] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchChurches()
  }, [])

  useEffect(() => {
    if (search) {
      setFilteredChurches(
        churches.filter(c => 
          c.nomeIgreja.toLowerCase().includes(search.toLowerCase()) ||
          c.cidade.toLowerCase().includes(search.toLowerCase())
        )
      )
    } else {
      setFilteredChurches(churches)
    }
  }, [search, churches])

  const fetchChurches = async () => {
    setLoading(true)
    try {
      const res = await apiRequest('core-service', '/v1/ekklesia/churches?size=100')
      const json = await res.json()
      setChurches(json.content || [])
      setFilteredChurches(json.content || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleChurchClick = (church: Church) => {
    setSelectedChurch(church)
    setShowRegister(true)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Departamentos</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Gestão de departamentos das igrejas</p>
      </div>

      {/* Busca */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar igreja por nome ou cidade..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
        />
      </div>

      {/* Lista de Igrejas */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredChurches.map(church => (
            <div
              key={church.id}
              onClick={() => handleChurchClick(church)}
              className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <Building2 className="w-6 h-6 text-blue-600 mt-1" />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white">{church.nomeIgreja}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{church.cidade}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filteredChurches.length === 0 && (
        <div className="text-center py-12 text-gray-500">Nenhuma igreja encontrada</div>
      )}

      {/* Modal de Registro de Departamento */}
      {showRegister && selectedChurch && (
        <RegisterDepartmentModal
          church={selectedChurch}
          onClose={() => {
            setShowRegister(false)
            setSelectedChurch(null)
          }}
          onSuccess={() => {
            setShowRegister(false)
            setSelectedChurch(null)
          }}
        />
      )}
    </div>
  )
}

const RegisterDepartmentModal: React.FC<{
  church: Church
  onClose: () => void
  onSuccess: () => void
}> = ({ church, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    departmentType: '',
    leaderName: '',
    leaderPhone: '',
    description: ''
  })
  const [submitting, setSubmitting] = useState(false)

  const submit = async () => {
    if (!form.departmentType) return
    setSubmitting(true)
    try {
      const res = await apiRequest('core-service', '/v1/ekklesia/ministries', {
        method: 'POST',
        body: JSON.stringify({
          churchId: church.id,
          departmentType: form.departmentType,
          leaderName: form.leaderName,
          leaderPhone: form.leaderPhone,
          description: form.description,
          status: 'ACTIVE'
        })
      })
      if (res.ok) onSuccess()
    } catch (e) {
      console.error(e)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h4 className="text-xl font-bold text-gray-900 dark:text-white">Registrar Departamento</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">{church.nomeIgreja}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tipo de Departamento *
            </label>
            <select
              value={form.departmentType}
              onChange={e => setForm({ ...form, departmentType: e.target.value })}
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            >
              <option value="">Selecione</option>
              {DEPARTMENT_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nome do Líder
            </label>
            <input
              value={form.leaderName}
              onChange={e => setForm({ ...form, leaderName: e.target.value })}
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Telefone do Líder
            </label>
            <input
              value={form.leaderPhone}
              onChange={e => setForm({ ...form, leaderPhone: e.target.value })}
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
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
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
          >
            Cancelar
          </button>
          <button
            disabled={submitting || !form.departmentType}
            onClick={submit}
            className="px-4 py-2 rounded-md bg-blue-600 text-white disabled:opacity-50"
          >
            {submitting ? 'Salvando...' : 'Salvar Departamento'}
          </button>
        </div>
      </div>
    </div>
  )
}

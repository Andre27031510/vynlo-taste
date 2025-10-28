'use client'

import React, { useEffect, useState } from 'react'
import { Building2 } from 'lucide-react'
import { apiRequest } from '@/services/api'

type Church = {
  id?: number
  tenantId?: number
  porte: string
  cidade: string
  nomeIgreja: string
  totvs?: string
  pastorNome: string
  pastorTelefone?: string
  financeiraNome: string
  financeiraTelefone?: string
  endereco?: string
  status?: string
}

const ChurchesList: React.FC<{ initialRegisterOpen?: boolean }> = ({ initialRegisterOpen }) => {
  const [churches, setChurches] = useState<Church[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)

  const fetchChurches = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await apiRequest('core-service', '/v1/ekklesia/churches?size=100')
      const json = await res.json()
      setChurches(json.content || [])
    } catch (e: any) {
      setError(e.message || 'Falha ao carregar igrejas')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { 
    // Aguardar inicialização do Firebase Auth
    const timer = setTimeout(() => {
      fetchChurches()
    }, 1000)
    return () => clearTimeout(timer)
  }, [])
  useEffect(() => { if (initialRegisterOpen) setIsRegisterOpen(true) }, [initialRegisterOpen])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Relação de Igrejas</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Lista de todas as igrejas cadastradas</p>
        </div>
        <button
          onClick={() => setIsRegisterOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Building2 className="w-4 h-4" />
          Registrar Nova Igreja
        </button>
      </div>

      {/* Tabela Profissional */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800">
              <tr>
                <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Nome da Igreja</th>
                <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Pastor</th>
                <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Telefone Pastor</th>
                <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Financeira</th>
                <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Telefone Financeira</th>
                <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Endereço</th>
                <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">TOTVS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {loading && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <span className="ml-3">Carregando igrejas...</span>
                    </div>
                  </td>
                </tr>
              )}
              
              {!loading && churches.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500">
                    Nenhuma igreja encontrada
                  </td>
                </tr>
              )}
              
              {!loading && churches.map((church) => (
                <tr key={church.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="p-4">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {church.nomeIgreja}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {church.porte} - {church.cidade}
                    </div>
                  </td>
                  <td className="p-4 text-gray-700 dark:text-gray-300">{church.pastorNome}</td>
                  <td className="p-4 text-gray-600 dark:text-gray-400">{church.pastorTelefone || '-'}</td>
                  <td className="p-4 text-gray-700 dark:text-gray-300">{church.financeiraNome}</td>
                  <td className="p-4 text-gray-600 dark:text-gray-400">{church.financeiraTelefone || '-'}</td>
                  <td className="p-4 text-gray-600 dark:text-gray-400">{church.endereco || '-'}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs font-medium">
                      {church.totvs || '-'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isRegisterOpen && (
        <RegisterChurchModal
          onClose={() => setIsRegisterOpen(false)}
          onCreated={fetchChurches}
        />
      )}
    </div>
  )
}

const RegisterChurchModal: React.FC<{ onClose: () => void; onCreated: () => void }> = ({ onClose, onCreated }) => {
  const [form, setForm] = useState<Partial<Church>>({
    porte: '',
    cidade: '',
    pastorNome: '',
    pastorTelefone: '',
    financeiraNome: '',
    financeiraTelefone: '',
    endereco: '',
    totvs: ''
  })
  const [submitting, setSubmitting] = useState(false)

  const submit = async () => {
    if (!form.porte || !form.cidade || !form.pastorNome || !form.financeiraNome) {
      alert('Preencha todos os campos obrigatórios')
      return
    }

    setSubmitting(true)
    try {
      const res = await apiRequest('core-service', '/v1/ekklesia/churches', {
        method: 'POST',
        body: JSON.stringify(form)
      })
      if (!res.ok) throw new Error('Falha ao salvar igreja')
      onCreated()
      onClose()
    } catch (e) {
      console.error(e)
      alert('Erro ao salvar igreja')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-xl font-bold text-gray-900 dark:text-white">Registrar Nova Igreja</h4>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Porte da Igreja <span className="text-red-500">*</span>
            </label>
            <select
              value={form.porte}
              onChange={(e) => setForm({ ...form, porte: e.target.value })}
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
            >
              <option value="">Selecione o porte</option>
              <option value="Central">Central</option>
              <option value="Estadual">Estadual</option>
              <option value="Setorial">Setorial</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Cidade <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.cidade || ''}
              onChange={(e) => setForm({ ...form, cidade: e.target.value })}
              placeholder="Ex: Londrina"
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
            />
          </div>

          <div className="md:col-span-2 border-t pt-4">
            <h5 className="font-semibold text-gray-900 dark:text-white mb-3">Dados do Pastor</h5>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nome do Pastor <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.pastorNome || ''}
              onChange={(e) => setForm({ ...form, pastorNome: e.target.value })}
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Telefone do Pastor
            </label>
            <input
              type="tel"
              value={form.pastorTelefone || ''}
              onChange={(e) => setForm({ ...form, pastorTelefone: e.target.value })}
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
            />
          </div>

          <div className="md:col-span-2 border-t pt-4">
            <h5 className="font-semibold text-gray-900 dark:text-white mb-3">Dados da Financeira</h5>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nome da Financeira <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.financeiraNome || ''}
              onChange={(e) => setForm({ ...form, financeiraNome: e.target.value })}
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Telefone da Financeira
            </label>
            <input
              type="tel"
              value={form.financeiraTelefone || ''}
              onChange={(e) => setForm({ ...form, financeiraTelefone: e.target.value })}
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Endereço
            </label>
            <input
              type="text"
              value={form.endereco || ''}
              onChange={(e) => setForm({ ...form, endereco: e.target.value })}
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              TOTVS (Matrícula)
            </label>
            <input
              type="text"
              value={form.totvs || ''}
              onChange={(e) => setForm({ ...form, totvs: e.target.value })}
              placeholder="Número de matrícula"
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6 border-t pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            Cancelar
          </button>
          <button
            disabled={submitting}
            onClick={submit}
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {submitting ? 'Salvando...' : 'Salvar Igreja'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChurchesList


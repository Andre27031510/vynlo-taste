'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { apiRequest } from '@/services/api'
import { Download, Upload, Plus, Search } from 'lucide-react'

type Member = {
  id?: number
  tenantId?: number
  name: string
  birthDate?: string
  baptismDate?: string
  phone?: string
  address?: string
  status?: string
}

const MemberManagement: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return members
    return members.filter(m => (m.name || '').toLowerCase().includes(q) || (m.phone || '').toLowerCase().includes(q))
  }, [members, query])

  const fetchMembers = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await apiRequest('core-service', '/v1/ekklesia/members?size=100')
      const json = await res.json()
      setMembers(json.content || [])
    } catch (e: any) {
      setError(e.message || 'Falha ao carregar membros')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchMembers() }, [])

  const handleExport = async () => {
    try {
      const res = await apiRequest('core-service', '/v1/ekklesia/members/export', { method: 'GET' })
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'members.xlsx'
      a.click()
      URL.revokeObjectURL(url)
    } catch (e) {
      console.error(e)
    }
  }

  const handleImport = async (file: File) => {
    const form = new FormData()
    form.append('file', file)
    try {
      const baseUrl = new URL((process as any).env.NEXT_PUBLIC_API_URL || 'https://api.vynlotech.com')
      const endpoint = `${baseUrl.origin}/api/v1/ekklesia/members/import`
      const res = await fetch(endpoint, { method: 'POST', body: form })
      if (!res.ok) throw new Error('Falha ao importar')
      await fetchMembers()
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Lista de Membros</h3>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="pl-7 pr-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
              placeholder="Buscar por nome ou telefone"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button onClick={() => fileInputRef.current?.click()} className="px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-800 text-sm flex items-center gap-1">
            <Upload className="w-4 h-4" /> Importar
          </button>
          <input ref={fileInputRef} type="file" accept=".xlsx" className="hidden" onChange={(e) => e.target.files && handleImport(e.target.files[0])} />
          <button onClick={handleExport} className="px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-800 text-sm flex items-center gap-1">
            <Download className="w-4 h-4" /> Exportar
          </button>
          <button onClick={() => setIsModalOpen(true)} className="px-3 py-2 rounded-md bg-blue-600 text-white text-sm flex items-center gap-1">
            <Plus className="w-4 h-4" /> Novo Membro
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800/50">
            <tr>
              <th className="text-left p-3">Nome</th>
              <th className="text-left p-3">Nascimento</th>
              <th className="text-left p-3">Batismo</th>
              <th className="text-left p-3">Telefone</th>
              <th className="text-left p-3">Endereço</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={5} className="p-4 text-center">Carregando...</td></tr>
            )}
            {!loading && filtered.map((m) => (
              <tr key={m.id} className="border-t border-gray-100 dark:border-gray-800">
                <td className="p-3">{m.name}</td>
                <td className="p-3">{m.birthDate || '-'}</td>
                <td className="p-3">{m.baptismDate || '-'}</td>
                <td className="p-3">{m.phone || '-'}</td>
                <td className="p-3">{m.address || '-'}</td>
              </tr>
            ))}
            {!loading && filtered.length === 0 && (
              <tr><td colSpan={5} className="p-4 text-center text-gray-500">Nenhum membro encontrado</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && <CreateMemberModal onClose={() => setIsModalOpen(false)} onCreated={fetchMembers} />}
    </div>
  )
}

const CreateMemberModal: React.FC<{ onClose: () => void; onCreated: () => void }> = ({ onClose, onCreated }) => {
  const [form, setForm] = useState<Member>({ name: '', birthDate: '', baptismDate: '', phone: '', address: '' })
  const [submitting, setSubmitting] = useState(false)

  const submit = async () => {
    setSubmitting(true)
    try {
      const res = await apiRequest('core-service', '/v1/ekklesia/members', {
        method: 'POST',
        body: JSON.stringify({
          name: form.name,
          birthDate: form.birthDate || null,
          baptismDate: form.baptismDate || null,
          phone: form.phone || null,
          address: form.address || null,
          status: 'ACTIVE',
          spiritualStatus: 'NEW_BELIEVER'
        })
      })
      if (!res.ok) throw new Error('Falha ao salvar')
      onCreated()
      onClose()
    } catch (e) {
      console.error(e)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold">Cadastrar Membro</h4>
          <button onClick={onClose} className="text-gray-500">✕</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Nome completo</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Data de batismo</label>
            <input type="date" value={form.baptismDate} onChange={e => setForm({ ...form, baptismDate: e.target.value })} className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Data de nascimento</label>
            <input type="date" value={form.birthDate} onChange={e => setForm({ ...form, birthDate: e.target.value })} className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Telefone</label>
            <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs text-gray-500 mb-1">Endereço</label>
            <input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900" />
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-800 text-sm">Cancelar</button>
          <button disabled={submitting} onClick={submit} className="px-3 py-2 rounded-md bg-blue-600 text-white text-sm">Salvar</button>
        </div>
      </div>
    </div>
  )
}

export default MemberManagement



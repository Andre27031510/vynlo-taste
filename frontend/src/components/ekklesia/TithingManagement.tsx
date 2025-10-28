'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { Plus, DollarSign } from 'lucide-react'
import { apiRequest } from '@/services/api'

const monthNames = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
]

const currentYear = new Date().getFullYear()
const currentMonth = new Date().getMonth()

export default function FinancialReport() {
  const [year, setYear] = useState<number>(currentYear)
  const [month, setMonth] = useState<string>(String(currentMonth + 1).padStart(2, '0'))
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<{ cash: number; pixCard: number; general: number; expenses: number }>({ cash: 0, pixCard: 0, general: 0, expenses: 0 })
  const [showModal, setShowModal] = useState(false)

  const fetchSummary = async () => {
    setLoading(true)
    try {
      const ym = `${year}-${month}`
      const res = await apiRequest('core-service', `/v1/ekklesia/financial-report/summary?month=${ym}`)
      const json = await res.json()
      setData({
        cash: Number(json.cash || 0),
        pixCard: Number(json.pixCard || 0),
        general: Number(json.general || 0),
        expenses: Number(json.expenses || 0)
      })
    } finally { setLoading(false) }
  }

  useEffect(() => { fetchSummary() }, [year, month])

  const net = useMemo(() => (data.cash + data.pixCard + data.general) - data.expenses, [data])

  // Gerar anos disponíveis (até ano atual)
  const availableYears = Array.from({ length: 3 }, (_, i) => currentYear - i)
  
  // Gerar meses disponíveis baseado no ano/mês atual
  const getAvailableMonths = () => {
    if (year === currentYear) {
      return Array.from({ length: currentMonth + 1 }, (_, i) => String(i + 1).padStart(2, '0'))
    }
    return Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Relatório Financeiro</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Consolidação mensal de entradas e saídas</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Registrar Entrada
          </button>
          <div className="flex items-center gap-2">
            <select
              value={month}
              onChange={e => setMonth(e.target.value)}
              className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            >
              {getAvailableMonths().map(m => (
                <option key={m} value={m}>{monthNames[Number(m) - 1]}</option>
              ))}
            </select>
            <select
              value={year}
              onChange={e => setYear(Number(e.target.value))}
              className="w-24 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            >
              {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Entradas em Dinheiro', value: data.cash, color: 'bg-emerald-500' },
          { label: 'Entradas PIX/CARTÃO', value: data.pixCard, color: 'bg-blue-500' },
          { label: 'Entradas Gerais', value: data.general, color: 'bg-violet-500' },
          { label: 'Saídas', value: data.expenses, color: 'bg-rose-500' }
        ].map((c) => (
          <div key={c.label} className="p-5 rounded-xl shadow-sm bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
            <div className="text-sm text-gray-500 dark:text-gray-400">{c.label}</div>
            <div className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">R$ {c.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            <div className={`mt-3 h-1.5 rounded-full ${c.color}`} />
          </div>
        ))}
      </div>

      {/* Gráfico */}
      <div className="p-6 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
        <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Gráfico de Entradas e Saídas</h4>
        <svg viewBox="0 0 600 220" className="w-full h-56">
          <line x1="40" y1="200" x2="580" y2="200" stroke="#e5e7eb" />
          <line x1="40" y1="20" x2="40" y2="200" stroke="#e5e7eb" />
          {(() => {
            const points = [data.cash, data.pixCard, data.general, data.expenses]
            const max = Math.max(1, ...points)
            const xs = [80, 220, 360, 500]
            const colors = ['#10b981', '#3b82f6', '#8b5cf6', '#ef4444']
            return points.map((v, i) => {
              const y = 200 - (v / max) * 160
              return (
                <g key={i}>
                  <line x1={xs[i]} y1={200} x2={xs[i]} y2={y} stroke={colors[i]} strokeWidth={3} />
                  <circle cx={xs[i]} cy={y} r={5} fill={colors[i]} />
                </g>
              )
            })
          })()}
          <text x="80" y="215" fontSize="12" textAnchor="middle" fill="#6b7280">Dinheiro</text>
          <text x="220" y="215" fontSize="12" textAnchor="middle" fill="#6b7280">PIX/CARTÃO</text>
          <text x="360" y="215" fontSize="12" textAnchor="middle" fill="#6b7280">Gerais</text>
          <text x="500" y="215" fontSize="12" textAnchor="middle" fill="#6b7280">Saídas</text>
        </svg>
      </div>

      {/* Modal de Registro */}
      {showModal && <RegisterFinancialModal onClose={() => setShowModal(false)} onSuccess={fetchSummary} />}
    </div>
  )
}

const RegisterFinancialModal: React.FC<{ onClose: () => void; onSuccess: () => void }> = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState<{ type: string; amount: string; paymentMethod: string; date: string; notes: string }>({
    type: 'TITHE',
    amount: '',
    paymentMethod: 'CASH',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  })
  const [submitting, setSubmitting] = useState(false)

  const submit = async () => {
    if (!form.amount) return
    setSubmitting(true)
    try {
      const res = await apiRequest('core-service', '/v1/ekklesia/tithings', {
        method: 'POST',
        body: JSON.stringify({
          amount: parseFloat(form.amount),
          titheType: form.type,
          paymentMethod: form.paymentMethod,
          paymentDate: form.date,
          notes: form.notes
        })
      })
      if (res.ok) {
        onSuccess()
        onClose()
      }
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
          <h4 className="text-xl font-bold text-gray-900 dark:text-white">Registrar Entrada Financeira</h4>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">✕</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tipo de Entrada</label>
            <select
              value={form.type}
              onChange={e => setForm({ ...form, type: e.target.value })}
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            >
              <option value="TITHE">Dízimo</option>
              <option value="OFFERING">Oferta</option>
              <option value="DONATION">Doação</option>
              <option value="SPECIAL">Especial</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Valor (R$)</label>
            <input
              type="number"
              step="0.01"
              value={form.amount}
              onChange={e => setForm({ ...form, amount: e.target.value })}
              placeholder="0,00"
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Método de Pagamento</label>
            <select
              value={form.paymentMethod}
              onChange={e => setForm({ ...form, paymentMethod: e.target.value })}
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            >
              <option value="CASH">Dinheiro</option>
              <option value="PIX">PIX</option>
              <option value="BANK_TRANSFER">Transferência Bancária</option>
              <option value="CREDIT_CARD">Cartão de Crédito</option>
              <option value="CHECK">Cheque</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Data</label>
            <input
              type="date"
              value={form.date}
              onChange={e => setForm({ ...form, date: e.target.value })}
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Observações</label>
            <textarea
              value={form.notes}
              onChange={e => setForm({ ...form, notes: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
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
            disabled={submitting || !form.amount}
            onClick={submit}
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {submitting ? 'Registrando...' : 'Registrar Entrada'}
          </button>
        </div>
      </div>
    </div>
  )
}

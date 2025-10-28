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
  const [isInitialMount, setIsInitialMount] = useState(true)

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

  useEffect(() => {
    if (isInitialMount) {
      // Aguardar inicialização do Firebase Auth no primeiro mount
      const timer = setTimeout(() => {
        fetchSummary()
        setIsInitialMount(false)
      }, 1000)
      return () => clearTimeout(timer)
    } else {
      // Chamadas subsequentes sem delay
      fetchSummary()
    }
  }, [year, month])

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

      {/* Gráfico Profissional */}
      <div className="p-8 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-xl font-bold text-gray-900 dark:text-white">Análise Financeira</h4>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span className="text-gray-600 dark:text-gray-400">Entradas</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-gray-600 dark:text-gray-400">Saídas</span>
            </div>
          </div>
        </div>
        
        <div className="relative h-80">
          <svg viewBox="0 0 700 300" className="w-full h-full">
            {/* Gradiente para efeito visual */}
            <defs>
              <linearGradient id="gradient-entradas" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.05" />
              </linearGradient>
            </defs>

            {/* Grade de fundo */}
            {[0, 1, 2, 3, 4].map((i) => (
              <line
                key={i}
                x1="60"
                y1={40 + i * 60}
                x2="640"
                y2={40 + i * 60}
                stroke="#e5e7eb"
                strokeWidth="1"
                strokeDasharray="2,2"
              />
            ))}

            {/* Labels do eixo Y */}
            {(() => {
              const totalEntradas = data.cash + data.pixCard + data.general
              const maxValue = Math.max(1, totalEntradas, data.expenses)
              const step = maxValue / 4
              return [0, 1, 2, 3, 4].map((i) => {
                const value = maxValue - (step * i)
                return (
                  <text
                    key={i}
                    x="55"
                    y={45 + i * 60}
                    fontSize="11"
                    fill="#6b7280"
                    textAnchor="end"
                  >
                    R$ {value.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </text>
                )
              })
            })()}

            {/* Linhas do gráfico partindo do zero */}
            {(() => {
              const totalEntradas = data.cash + data.pixCard + data.general
              const maxValue = Math.max(1, totalEntradas, data.expenses)
              const spacing = 140
              const startX = 120
              
              const barData = [
                { label: 'Entradas em\nDinheiro', value: data.cash, color: '#10b981', x: startX },
                { label: 'Entradas\nPIX/CARTÃO', value: data.pixCard, color: '#3b82f6', x: startX + spacing },
                { label: 'Entradas\nGerais', value: data.general, color: '#8b5cf6', x: startX + spacing * 2 },
                { label: 'Saídas', value: data.expenses, color: '#ef4444', x: startX + spacing * 3 }
              ]

              return barData.map((bar, i) => {
                const height = maxValue > 0 ? (bar.value / maxValue) * 240 : 0
                const y = 250 - height

                return (
                  <g key={i}>
                    {/* Barra */}
                    <rect
                      x={bar.x - 50}
                      y={y}
                      width="100"
                      height={height}
                      fill={bar.color}
                      rx="4"
                      className="hover:opacity-80 transition-opacity"
                    />
                    
                    {/* Valor no topo */}
                    {bar.value > 0 && (
                      <text
                        x={bar.x}
                        y={y - 10}
                        fontSize="13"
                        fontWeight="600"
                        fill={bar.color}
                        textAnchor="middle"
                      >
                        R$ {bar.value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </text>
                    )}
                    
                    {/* Label na base */}
                    <text
                      x={bar.x}
                      y="280"
                      fontSize="11"
                      fill="#374151"
                      textAnchor="middle"
                      className="dark:fill-gray-400"
                    >
                      {bar.label.split('\n').map((line, j) => (
                        <tspan key={j} x={bar.x} dy={j > 0 ? "12" : "0"}>{line}</tspan>
                      ))}
                    </text>
                  </g>
                )
              })
            })()}

            {/* Eixos */}
            <line x1="60" y1="250" x2="640" y2="250" stroke="#374151" strokeWidth="2" />
            <line x1="60" y1="10" x2="60" y2="250" stroke="#374151" strokeWidth="2" />
          </svg>
        </div>

        {/* Totais abaixo do gráfico */}
        <div className="grid grid-cols-2 gap-6 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total de Entradas</div>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              R$ {(data.cash + data.pixCard + data.general).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total de Saídas</div>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              R$ {data.expenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </div>
        </div>
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

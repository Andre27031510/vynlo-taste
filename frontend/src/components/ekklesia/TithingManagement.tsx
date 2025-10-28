'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { apiRequest } from '@/services/api'

const months = [
  '01','02','03','04','05','06','07','08','09','10','11','12'
]

export default function FinancialReport() {
  const [year, setYear] = useState<number>(new Date().getFullYear())
  const [month, setMonth] = useState<string>(String(new Date().getMonth()+1).padStart(2,'0'))
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<{ cash: number; pixCard: number; general: number; expenses: number }>({ cash: 0, pixCard: 0, general: 0, expenses: 0 })

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold">Relatório Financeiro</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Consolidação mensal</p>
        </div>
        <div className="flex items-center gap-2">
          <select value={month} onChange={e=>setMonth(e.target.value)} className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900">
            {months.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <input type="number" value={year} onChange={e=>setYear(Number(e.target.value))} className="w-24 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900" />
        </div>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Entradas em Dinheiro', value: data.cash, color: 'bg-emerald-500' },
          { label: 'Entradas PIX/CARTÃO', value: data.pixCard, color: 'bg-blue-500' },
          { label: 'Entradas Gerais', value: data.general, color: 'bg-violet-500' },
          { label: 'Saídas', value: data.expenses, color: 'bg-rose-500' }
        ].map((c) => (
          <div key={c.label} className="p-5 rounded-xl shadow-sm bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
            <div className="text-sm text-gray-500 dark:text-gray-400">{c.label}</div>
            <div className="mt-1 text-2xl font-bold">R$ {c.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            <div className={`mt-3 h-1.5 rounded-full ${c.color}`} />
          </div>
        ))}
      </div>

      {/* Gráfico simples (linhas saindo do 0) */}
      <div className="p-6 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
        <svg viewBox="0 0 600 220" className="w-full h-56">
          {/* Eixos */}
          <line x1="40" y1="200" x2="580" y2="200" stroke="#e5e7eb" />
          <line x1="40" y1="20" x2="40" y2="200" stroke="#e5e7eb" />
          {/* Linhas partindo do zero */}
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
          {/* Labels */}
          <text x="80" y="215" fontSize="12" textAnchor="middle">Dinheiro</text>
          <text x="220" y="215" fontSize="12" textAnchor="middle">PIX/CARTÃO</text>
          <text x="360" y="215" fontSize="12" textAnchor="middle">Gerais</text>
          <text x="500" y="215" fontSize="12" textAnchor="middle">Saídas</text>
        </svg>
      </div>
    </div>
  )
}


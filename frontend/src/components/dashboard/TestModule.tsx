'use client'

export default function TestModule() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-manrope font-bold text-gray-900">Módulo de Teste</h1>
        <p className="text-gray-600 font-manrope">Este é um módulo de teste para verificar a navegação</p>
      </div>
      
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
        <p className="text-gray-900 font-manrope text-lg">✅ Módulo funcionando corretamente!</p>
      </div>
    </div>
  )
}
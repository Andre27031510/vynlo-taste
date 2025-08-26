'use client'

import { useState } from 'react'
import { 
  Activity, 
  Check, 
  X, 
  AlertTriangle, 
  Zap, 
  Globe,
  CreditCard,
  DollarSign,
  Clock
} from 'lucide-react'

/**
 * Componente de demonstração para testar webhooks de pagamento
 * Simula transações das máquinas de cartão
 */
export default function PaymentTestDemo() {
  const [testProvider, setTestProvider] = useState('stone')
  const [testMethod, setTestMethod] = useState('credit_card')
  const [testAmount, setTestAmount] = useState('45.90')
  const [testStatus, setTestStatus] = useState('approved')
  const [testCardBrand, setTestCardBrand] = useState('Visa')
  const [testResult, setTestResult] = useState<{
    status: 'success' | 'error' | 'warning';
    message: string;
    transactionId?: string;
    responseTime?: number;
    details?: string;
  } | null>(null)
  const [testHistory, setTestHistory] = useState<{
    provider: string;
    amount: string;
    status: string;
    time: string;
  }[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  const simulateTransaction = async () => {
    setIsProcessing(true)
    setTestResult(null)

    // Adicionar ao histórico
    const newTest = {
      provider: testProvider,
      amount: testAmount,
      status: testStatus,
      time: new Date().toLocaleString('pt-BR')
    }
    setTestHistory(prev => [newTest, ...prev.slice(0, 4)])

    // Simular processamento do webhook
    const startTime = Date.now()
    
    try {
      // Simular chamada para o backend
      const response = await fetch('/api/webhooks/payment/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transaction_id: `TXN-${Date.now()}`,
          provider: testProvider,
          status: testStatus,
          method: testMethod,
          amount: parseFloat(testAmount),
          card_brand: testCardBrand,
          currency: 'BRL',
          timestamp: new Date().toISOString()
        })
      })

      const responseTime = Date.now() - startTime

      if (response.ok) {
        const data = await response.json()
        setTestResult({
          status: 'success',
          message: `Transação ${testStatus} para ${testProvider} processada com sucesso!`,
          transactionId: data.transactionId || `TXN-${Date.now()}`,
          responseTime: responseTime,
          details: JSON.stringify(data, null, 2)
        })
      } else {
        setTestResult({
          status: 'error',
          message: `Erro ao processar transação: ${response.statusText}`,
          responseTime: responseTime,
          details: `Status: ${response.status}\nStatusText: ${response.statusText}`
        })
      }
    } catch (error) {
      const responseTime = Date.now() - startTime
      setTestResult({
        status: 'error',
        message: `Erro de conexão: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        responseTime: responseTime,
        details: 'Erro ao conectar com o servidor. Verifique se o backend está rodando.'
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const resetTest = () => {
    setTestResult(null)
    setTestHistory([])
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Activity className="w-6 h-6 text-purple-600" />
          <h3 className="text-xl font-manrope font-bold text-gray-900">Teste de Webhooks</h3>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-sm text-gray-600 font-manrope">Sistema de Teste Ativo</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Simulador de Transação */}
        <div className="space-y-4">
          <h4 className="text-lg font-manrope font-semibold text-gray-900">Simular Transação</h4>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-manrope font-medium text-gray-700 mb-1">Provedor</label>
                              <select 
                  value={testProvider}
                  onChange={(e) => setTestProvider(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-manrope"
                >
                  <option value="stone">Stone</option>
                  <option value="cielo">Cielo</option>
                  <option value="rede">Rede</option>
                  <option value="pagseguro">PagSeguro</option>
                  <option value="sicred">Sicred</option>
                  <option value="pix">PIX</option>
                </select>
            </div>

            <div>
              <label className="block text-sm font-manrope font-medium text-gray-700 mb-1">Método de Pagamento</label>
              <select 
                value={testMethod}
                onChange={(e) => setTestMethod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-manrope"
              >
                <option value="credit_card">Cartão de Crédito</option>
                <option value="debit_card">Cartão de Débito</option>
                <option value="pix">PIX</option>
                <option value="cash">Dinheiro</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-manrope font-medium text-gray-700 mb-1">Valor (R$)</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={testAmount}
                onChange={(e) => setTestAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-manrope"
                placeholder="45.90"
              />
            </div>

            <div>
              <label className="block text-sm font-manrope font-medium text-gray-700 mb-1">Status</label>
              <select 
                value={testStatus}
                onChange={(e) => setTestStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-manrope"
              >
                <option value="approved">Aprovado</option>
                <option value="declined">Recusado</option>
                <option value="pending">Pendente</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-manrope font-medium text-gray-700 mb-1">Marca do Cartão</label>
              <input
                type="text"
                value={testCardBrand}
                onChange={(e) => setTestCardBrand(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-manrope"
                placeholder="Visa, Mastercard, etc."
              />
            </div>

            <button
              onClick={simulateTransaction}
              disabled={isProcessing}
              className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-manrope font-semibold hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processando...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>Simular Transação</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Resultado do Teste */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-manrope font-semibold text-gray-900">Resultado do Teste</h4>
            {testHistory.length > 0 && (
              <button
                onClick={resetTest}
                className="text-sm text-gray-500 hover:text-gray-700 font-manrope"
              >
                Limpar Histórico
              </button>
            )}
          </div>
          
          {testResult ? (
            <div className={`p-4 rounded-xl border-2 ${
              testResult.status === 'success' 
                ? 'border-green-200 bg-green-50' 
                : testResult.status === 'error'
                ? 'border-red-200 bg-red-50'
                : 'border-yellow-200 bg-yellow-50'
            }`}>
              <div className="flex items-center space-x-2 mb-3">
                {testResult.status === 'success' ? (
                  <Check className="w-5 h-5 text-green-600" />
                ) : testResult.status === 'error' ? (
                  <X className="w-5 h-5 text-red-600" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                )}
                <span className={`font-manrope font-semibold ${
                  testResult.status === 'success' 
                    ? 'text-green-800' 
                    : testResult.status === 'error'
                    ? 'text-red-800'
                    : 'text-yellow-800'
                }`}>
                  {testResult.status === 'success' ? 'Sucesso!' : 
                   testResult.status === 'error' ? 'Erro!' : 'Atenção!'}
                </span>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium">{testResult.message}</span>
                </div>
                {testResult.transactionId && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">ID da Transação:</span>
                    <span className="font-mono text-xs">{testResult.transactionId}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Tempo de Resposta:</span>
                  <span className="font-medium">{testResult.responseTime}ms</span>
                </div>
                {testResult.details && (
                  <div className="mt-3 p-3 bg-white rounded-lg border">
                    <div className="text-xs font-mono text-gray-700 whitespace-pre-wrap">
                      {testResult.details}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center border-2 border-dashed border-gray-300 rounded-xl">
              <Activity className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 font-manrope">
                Clique em "Simular Transação" para testar o webhook
              </p>
            </div>
          )}

          {/* Histórico de Testes */}
          {testHistory.length > 0 && (
            <div className="mt-6">
              <h5 className="text-sm font-manrope font-semibold text-gray-700 mb-3">Histórico de Testes</h5>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {testHistory.map((test, index) => (
                  <div key={index} className={`p-2 rounded-lg text-xs ${
                    test.status === 'approved' 
                      ? 'bg-green-100 text-green-800' 
                      : test.status === 'declined'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{test.provider.toUpperCase()}</span>
                      <span className="flex items-center space-x-1">
                        <DollarSign className="w-3 h-3" />
                        <span>{test.amount}</span>
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="capitalize">{test.status}</span>
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{test.time}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Informações de Configuração */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Globe className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">URLs de Teste</span>
            </div>
            <div className="space-y-1 text-xs text-blue-800">
              <div>Stone: <code className="bg-blue-100 px-1 rounded">/api/webhooks/payment/stone</code></div>
              <div>Cielo: <code className="bg-blue-100 px-1 rounded">/api/webhooks/payment/cielo</code></div>
              <div>Rede: <code className="bg-blue-100 px-1 rounded">/api/webhooks/payment/rede</code></div>
              <div>Sicred: <code className="bg-blue-100 px-1 rounded">/api/webhooks/payment/sicred</code></div>
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Check className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-900">Status do Sistema</span>
            </div>
            <div className="space-y-1 text-xs text-green-800">
              <div>✅ Webhooks ativos</div>
              <div>✅ Processamento automático</div>
              <div>✅ Sincronização em tempo real</div>
            </div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-900">Próximos Passos</span>
            </div>
            <div className="space-y-1 text-xs text-purple-800">
              <div>1. Teste com este simulador</div>
              <div>2. Configure a máquina real</div>
              <div>3. Monitore no dashboard</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

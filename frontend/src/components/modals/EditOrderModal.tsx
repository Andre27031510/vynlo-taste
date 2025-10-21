'use client'
// Modal para edição rápida de pedidos - UX otimizada

import { useState, useEffect } from 'react'
import { X, MapPin, CreditCard, Package, Save } from 'lucide-react'
import { useUpdateOrderMutation, type Order, type UpdateOrderData } from '@/hooks/useOrdersQuery'
import { formatCurrency } from '@/utils/format'

interface EditOrderModalProps {
  isOpen: boolean
  onClose: () => void
  order: Order | null
}

export default function EditOrderModal({ isOpen, onClose, order }: EditOrderModalProps) {
  const [status, setStatus] = useState<Order['status']>('pending')
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [notes, setNotes] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('CREDIT_CARD')

  const updateOrderMutation = useUpdateOrderMutation()

  useEffect(() => {
    if (order) {
      setStatus(order.status)
      setDeliveryAddress(order.deliveryAddress || '')
      setPaymentMethod(order.paymentMethod)
      setNotes('')
    }
  }, [order])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!order) return

    const updateData: UpdateOrderData = {
      status: status.toUpperCase() as Order['status'], // Backend espera UPPERCASE
      deliveryAddress: deliveryAddress || undefined,
      paymentMethod,
      notes: notes || undefined
    }

    updateOrderMutation.mutate({ orderId: order.id, data: updateData }, {
      onSuccess: () => {
        onClose()
      }
    })
  }

  if (!isOpen || !order) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Editar Pedido</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">#{order.id}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)] space-y-6">
          {/* Cliente (Read-only) */}
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Package className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <h3 className="font-medium text-gray-700 dark:text-gray-300">Informações do Pedido</h3>
            </div>
            <div className="space-y-1 text-sm">
              <p><span className="text-gray-500">Cliente:</span> <span className="font-medium text-gray-900 dark:text-white">{order.customerName}</span></p>
              <p><span className="text-gray-500">Total:</span> <span className="font-bold text-blue-600 dark:text-blue-400">{formatCurrency(order.total)}</span></p>
              <p><span className="text-gray-500">Itens:</span> <span className="font-medium">{order.items.length}</span></p>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status do Pedido
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Order['status'])}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="pending">⏳ Pendente</option>
              <option value="preparing">👨‍🍳 Preparando</option>
              <option value="ready">✅ Pronto</option>
              <option value="delivered">🚚 Entregue</option>
              <option value="cancelled">❌ Cancelado</option>
            </select>
          </div>

          {/* Endereço de Entrega */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              Endereço de Entrega
            </label>
            <textarea
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              placeholder="Endereço completo de entrega..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Método de Pagamento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <CreditCard className="w-4 h-4 inline mr-1" />
              Método de Pagamento
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="CREDIT_CARD">💳 Cartão de Crédito</option>
              <option value="DEBIT_CARD">💳 Cartão de Débito</option>
              <option value="PIX">📱 PIX</option>
              <option value="CASH">💵 Dinheiro</option>
              <option value="VOUCHER">🎫 Vale</option>
            </select>
          </div>

          {/* Observações */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Observações/Notas
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Adicionar observações sobre alterações..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </form>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-900/50 flex justify-between space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={updateOrderMutation.isPending}
            className="flex-1 px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 font-medium flex items-center justify-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{updateOrderMutation.isPending ? 'Salvando...' : 'Salvar Alterações'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}


'use client'

import { X, User, MapPin, CreditCard, Package, Clock, CheckCircle } from 'lucide-react'
import { type Order } from '@/hooks/useOrdersQuery'
import { formatCurrency, formatDateTime } from '@/utils/format'

interface OrderDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  order: Order | null
}

export default function OrderDetailsModal({ isOpen, onClose, order }: OrderDetailsModalProps) {
  if (!isOpen || !order) return null

  const getStatusInfo = (status: Order['status']) => {
    const statusMap = {
      pending: { label: 'Pendente', color: 'yellow', icon: Clock },
      preparing: { label: 'Preparando', color: 'blue', icon: Package },
      ready: { label: 'Pronto', color: 'green', icon: CheckCircle },
      delivered: { label: 'Entregue', color: 'gray', icon: CheckCircle },
      cancelled: { label: 'Cancelado', color: 'red', icon: X }
    }
    return statusMap[status] || statusMap.pending
  }

  const statusInfo = getStatusInfo(order.status)
  const StatusIcon = statusInfo.icon

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Detalhes do Pedido</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">#{order.id}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)] space-y-6">
          {/* Status e Data */}
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 bg-${statusInfo.color}-100 dark:bg-${statusInfo.color}-900/30 rounded-xl flex items-center justify-center`}>
                <StatusIcon className={`w-6 h-6 text-${statusInfo.color}-600 dark:text-${statusInfo.color}-400`} />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                <p className={`text-lg font-semibold text-${statusInfo.color}-600 dark:text-${statusInfo.color}-400`}>
                  {statusInfo.label}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400">Data</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {formatDateTime(order.createdAt)}
              </p>
            </div>
          </div>

          {/* Cliente */}
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-3">
              <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white">Cliente</h3>
            </div>
            <div className="space-y-1">
              <p className="text-gray-900 dark:text-white font-medium">{order.customerName}</p>
              {order.deliveryAddress && (
                <div className="flex items-start space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <p>{order.deliveryAddress}</p>
                </div>
              )}
            </div>
          </div>

          {/* Itens do Pedido */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
              <Package className="w-5 h-5 mr-2 text-gray-600 dark:text-gray-400" />
              Itens do Pedido ({order.items.length})
            </h3>
            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatCurrency(item.price)} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Pagamento */}
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-3">
              <CreditCard className="w-5 h-5 text-green-600 dark:text-green-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white">Pagamento</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Método:</span>
                <span className="font-medium">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200 dark:border-gray-700">
                <span>Total</span>
                <span className="text-blue-600 dark:text-blue-400">{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-900/50">
          <button
            onClick={onClose}
            className="w-full px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  )
}


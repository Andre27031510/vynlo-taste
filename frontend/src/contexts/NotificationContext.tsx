'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { 
  Bell, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  X,
  ShoppingCart,
  Truck,
  DollarSign,
  User,
  Settings
} from 'lucide-react'

export interface Notification {
  id: string
  type: 'success' | 'warning' | 'error' | 'info' | 'order' | 'delivery' | 'payment' | 'user' | 'system'
  title: string
  message: string
  timestamp: Date
  read: boolean
  action?: {
    label: string
    onClick: () => void
  }
  duration?: number // em milissegundos, undefined = não expira
}

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  removeNotification: (id: string) => void
  clearAll: () => void
  getNotificationsByType: (type: Notification['type']) => Notification[]
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications deve ser usado dentro de um NotificationProvider')
  }
  return context
}

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([])

  // Carregar notificações do localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('vynlo-notifications')
      if (stored) {
        const parsed = JSON.parse(stored)
        // Converter timestamps de volta para Date
        const withDates = parsed.map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        }))
        setNotifications(withDates)
      }
    } catch (error) {
      console.warn('Erro ao carregar notificações:', error)
    }
  }, [])

  // Salvar notificações no localStorage
  useEffect(() => {
    try {
      localStorage.setItem('vynlo-notifications', JSON.stringify(notifications))
    } catch (error) {
      console.warn('Erro ao salvar notificações:', error)
    }
  }, [notifications])

  // Contar notificações não lidas
  const unreadCount = notifications.filter(n => !n.read).length

  // Adicionar notificação
  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      read: false
    }

    setNotifications(prev => [newNotification, ...prev])

    // Auto-remover notificações com duração definida
    if (notification.duration) {
      setTimeout(() => {
        removeNotification(newNotification.id)
      }, notification.duration)
    }

    // Limpar notificações antigas (manter apenas as últimas 50)
    if (notifications.length > 50) {
      setNotifications(prev => prev.slice(0, 50))
    }
  }, [notifications.length])

  // Marcar como lida
  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }, [])

  // Marcar todas como lidas
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    )
  }, [])

  // Remover notificação
  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  // Limpar todas
  const clearAll = useCallback(() => {
    setNotifications([])
  }, [])

  // Filtrar por tipo
  const getNotificationsByType = useCallback((type: Notification['type']) => {
    return notifications.filter(n => n.type === type)
  }, [notifications])

  // Notificações automáticas do sistema
  useEffect(() => {
    // Simular notificações do sistema
    const systemNotifications = [
      {
        type: 'info' as const,
        title: 'Sistema Ativo',
        message: 'Vynlo Taste está funcionando perfeitamente',
        duration: 5000
      }
    ]

    // Adicionar notificação inicial após 2 segundos
    const timer = setTimeout(() => {
      addNotification(systemNotifications[0])
    }, 2000)

    return () => clearTimeout(timer)
  }, [addNotification])

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    getNotificationsByType
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}

// Componente de notificação individual
export const NotificationItem: React.FC<{ notification: Notification }> = ({ notification }) => {
  const { markAsRead, removeNotification } = useNotifications()

  const getIcon = () => {
    switch (notification.type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case 'error': return <AlertTriangle className="w-5 h-5 text-red-500" />
      case 'info': return <Info className="w-5 h-5 text-blue-500" />
      case 'order': return <ShoppingCart className="w-5 h-5 text-purple-500" />
      case 'delivery': return <Truck className="w-5 h-5 text-indigo-500" />
      case 'payment': return <DollarSign className="w-5 h-5 text-green-500" />
      case 'user': return <User className="w-5 h-5 text-blue-500" />
      case 'system': return <Settings className="w-5 h-5 text-gray-500" />
      default: return <Bell className="w-5 h-5 text-gray-500" />
    }
  }

  const getTypeStyles = () => {
    switch (notification.type) {
      case 'success': return 'border-l-green-500 bg-green-50'
      case 'warning': return 'border-l-yellow-500 bg-yellow-50'
      case 'error': return 'border-l-red-500 bg-red-50'
      case 'info': return 'border-l-blue-500 bg-blue-50'
      case 'order': return 'border-l-purple-500 bg-purple-50'
      case 'delivery': return 'border-l-indigo-500 bg-indigo-50'
      case 'payment': return 'border-l-green-500 bg-green-50'
      case 'user': return 'border-l-blue-500 bg-blue-50'
      case 'system': return 'border-l-gray-500 bg-gray-50'
      default: return 'border-l-gray-500 bg-gray-50'
    }
  }

  return (
    <div className={`p-4 border-l-4 rounded-r-lg shadow-sm ${getTypeStyles()} transition-all duration-200 hover:shadow-md`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          {getIcon()}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-gray-900 mb-1">
              {notification.title}
            </h4>
            <p className="text-sm text-gray-600 mb-2">
              {notification.message}
            </p>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">
                {notification.timestamp.toLocaleTimeString()}
              </span>
              {notification.action && (
                <button
                  onClick={notification.action.onClick}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  {notification.action.label}
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {!notification.read && (
            <button
              onClick={() => markAsRead(notification.id)}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Marcar como lida
            </button>
          )}
          <button
            onClick={() => removeNotification(notification.id)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

// Componente de lista de notificações
export const NotificationList: React.FC = () => {
  const { notifications, unreadCount, markAllAsRead, clearAll } = useNotifications()

  if (notifications.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p>Nenhuma notificação</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="font-semibold text-gray-900">
            Notificações {unreadCount > 0 && `(${unreadCount})`}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={markAllAsRead}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Marcar todas como lidas
          </button>
          <button
            onClick={clearAll}
            className="text-sm text-red-600 hover:text-red-800"
          >
            Limpar todas
          </button>
        </div>
      </div>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {notifications.map(notification => (
          <NotificationItem key={notification.id} notification={notification} />
        ))}
      </div>
    </div>
  )
}

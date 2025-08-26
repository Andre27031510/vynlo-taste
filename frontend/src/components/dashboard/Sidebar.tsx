'use client'

import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package,
  Truck, 
  CreditCard, 
  BarChart3, 
  Users, 
  Settings,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  DollarSign,
  TrendingUp,
  Database,
  FileText,
  Shield,
  Zap,
  Smartphone,
  ChevronDown,
  ChevronUp,
  Store,
  BarChart,
  Cog,
  Globe
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useTheme } from '@/hooks/useTheme'

// Tipo para as seções válidas do dashboard
export type DashboardSection = 'dashboard' | 'orders' | 'menu' | 'delivery' | 'drivers' | 'clients' | 'financial' | 'payments' | 'cashflow' | 'fiscal' | 'team' | 'reports-analytics' | 'analytics' | 'integrations' | 'settings'

interface SidebarProps {
  activeSection: DashboardSection
  setActiveSection: (section: DashboardSection) => void
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
}

interface MenuCategory {
  id: string
  label: string
  icon: any
  color: string
  items: MenuItem[]
}

interface MenuItem {
  id: string
  label: string
  icon: any
  description?: string
}

export default function Sidebar({ activeSection, setActiveSection, collapsed, setCollapsed }: SidebarProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['operational'])
  const { currentTheme } = useTheme()

  const menuCategories: MenuCategory[] = [
    {
      id: 'operational',
      label: 'Operacional',
      icon: Store,
      color: 'blue',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, description: 'Visão geral do sistema' },
        { id: 'orders', label: 'Pedidos', icon: ShoppingCart, description: 'Gestão de pedidos' },
        { id: 'delivery', label: 'Delivery', icon: Truck, description: 'Controle de entregas' },
        { id: 'drivers', label: 'Motoboys', icon: UserPlus, description: 'Gestão de entregadores' }
      ]
    },
    {
      id: 'products',
      label: 'Produtos & Estoque',
      icon: Package,
      color: 'green',
      items: [
        { id: 'menu', label: 'Cardápio', icon: Package, description: 'Gestão de produtos' }
      ]
    },
    {
      id: 'customers',
      label: 'Clientes & Vendas',
      icon: Users,
      color: 'purple',
      items: [
        { id: 'clients', label: 'Clientes', icon: Users, description: 'Base de clientes' },
        { id: 'team', label: 'Equipe', icon: Shield, description: 'Gestão de funcionários' }
      ]
    },
    {
      id: 'financial',
      label: 'Financeiro',
      icon: DollarSign,
      color: 'yellow',
      items: [
        { id: 'financial', label: 'Financeiro', icon: CreditCard, description: 'Controle financeiro' },
        { id: 'payments', label: 'Pagamentos', icon: DollarSign, description: 'Gestão de pagamentos' },
        { id: 'cashflow', label: 'Fluxo de Caixa', icon: TrendingUp, description: 'Análise de caixa' },
        { id: 'fiscal', label: 'Nota Fiscal', icon: FileText, description: 'Gestão fiscal' }
      ]
    },
    {
      id: 'analytics',
      label: 'Analytics & Dados',
      icon: BarChart,
      color: 'indigo',
      items: [
        { id: 'reports-analytics', label: 'Relatórios & Análises', icon: BarChart3, description: 'Relatórios avançados' },
        { id: 'analytics', label: 'Big Data', icon: Database, description: 'Análise preditiva' }
      ]
    },
    {
      id: 'integrations',
      label: 'Integrações',
      icon: Globe,
      color: 'pink',
      items: [
        { id: 'integrations', label: 'Integrações', icon: Smartphone, description: 'Canais externos' }
      ]
    },
    {
      id: 'system',
      label: 'Sistema',
      icon: Cog,
      color: 'gray',
      items: [
        { id: 'settings', label: 'Configurações', icon: Settings, description: 'Configurações gerais' }
      ]
    }
  ]

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const isCategoryExpanded = (categoryId: string) => expandedCategories.includes(categoryId)

  const getCategoryColor = (color: string) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      purple: 'from-purple-500 to-purple-600',
      yellow: 'from-yellow-500 to-yellow-600',
      indigo: 'from-indigo-500 to-indigo-600',
      pink: 'from-pink-500 to-pink-600',
      gray: 'from-gray-500 to-gray-600'
    }
    return colors[color as keyof typeof colors] || 'from-blue-500 to-blue-600'
  }

  const getCategoryIconColor = (color: string) => {
    const colors = {
      blue: 'text-blue-400',
      green: 'text-green-400',
      purple: 'text-purple-400',
      yellow: 'text-yellow-400',
      indigo: 'text-indigo-400',
      pink: 'text-pink-400',
      gray: 'text-gray-400'
    }
    return colors[color as keyof typeof colors] || 'text-blue-400'
  }

  return (
    <div 
      className={`fixed left-0 top-0 h-full shadow-2xl transition-all duration-300 z-40 ${
        collapsed ? 'w-16' : 'w-64'
      }`} 
      style={{ 
        background: currentTheme === 'dark'
          ? 'linear-gradient(180deg, #0d1117 0%, #1a1a1a 50%, #000000 100%)'
          : 'linear-gradient(180deg, #ffffff 0%, #f8fafc 50%, #f1f5f9 100%)',
        borderRight: currentTheme === 'dark'
          ? '1px solid rgba(59, 130, 246, 0.1)'
          : '1px solid rgba(59, 130, 246, 0.2)'
      }}
    >
      {/* Logo */}
      <div className={`p-6 border-b ${currentTheme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-center space-x-3">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)' }}
          >
            <span className="text-white font-bold text-lg">V</span>
          </div>
          {!collapsed && (
            <div>
              <h1 className={`font-bold text-xl ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Vynlo <span style={{ color: '#60a5fa' }}>Taste</span>
              </h1>
              <p className={`text-sm ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Admin Panel</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className={`mt-6 px-3 overflow-y-auto h-[calc(100vh-200px)] ${currentTheme === 'dark' ? 'scrollbar-dark' : 'scrollbar-light'}`}>
        {menuCategories.map((category) => {
          const IconComponent = category.icon
          const isExpanded = isCategoryExpanded(category.id)
          const hasActiveItem = category.items.some(item => item.id === activeSection)

          return (
            <div key={category.id} className="mb-3">
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category.id)}
                className={`w-full flex items-center justify-between px-3 py-3 rounded-xl transition-all duration-200 group ${
                  hasActiveItem
                    ? currentTheme === 'dark'
                      ? 'text-white bg-gray-800/50'
                      : 'text-gray-900 bg-blue-50'
                    : currentTheme === 'dark'
                      ? 'text-gray-300 hover:text-white hover:bg-gray-800/30'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-r ${getCategoryColor(category.color)}`}>
                    <IconComponent className="w-4 h-4 text-white" />
                  </div>
                  {!collapsed && (
                    <span className="font-medium text-sm">{category.label}</span>
                  )}
                </div>

                {!collapsed && (
                  <div className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                )}
              </button>

              {/* Category Items */}
              {(!collapsed && isExpanded) && (
                <div className="ml-6 mt-2 space-y-1">
                  {category.items.map((item) => {
                    const ItemIconComponent = item.icon
          const isActive = activeSection === item.id
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id as DashboardSection)}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 group ${
                isActive 
                  ? 'text-white shadow-lg' 
                            : currentTheme === 'dark'
                              ? 'text-gray-400 hover:text-white hover:bg-gray-800/30'
                              : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              }`}
              style={isActive ? { 
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)' 
              } : {}}
            >
                        <ItemIconComponent className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : currentTheme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
                        <div className="flex-1 text-left">
                          <span className="font-medium text-sm">{item.label}</span>
                          {item.description && (
                            <p className={`text-xs ${currentTheme === 'dark' ? 'text-gray-500' : 'text-gray-400'} group-hover:${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'} truncate`}>
                              {item.description}
                            </p>
                          )}
                        </div>
              
              {/* Active indicator */}
                        {isActive && (
                          <div className="w-2 h-2 bg-white rounded-full flex-shrink-0"></div>
                        )}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform duration-200"
        style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)' }}
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>
    </div>
  )
}
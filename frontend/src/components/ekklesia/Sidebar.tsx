'use client'

import React, { useRef, useState, useEffect } from 'react'
import { useMediaQuery } from 'react-responsive'
import {
  LayoutDashboard,
  Users,
  Calendar,
  DollarSign,
  Building2,
  ChevronRight,
  ChevronLeft,
  Menu as MenuIcon,
  ChevronDown,
  ChevronUp,
  Store,
  BarChart3,
  Database,
  FileText,
  Shield,
  Smartphone,
  Package,
  Cog
} from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'

interface SidebarProps {
  activeSection: string
  setActiveSection: (section: string) => void
  collapsed: boolean
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>
}

interface MenuItem { id: string; label: string; icon: React.ComponentType<any>; description?: string }
interface MenuCategory { id: string; label: string; icon: React.ComponentType<any>; color: string; items: MenuItem[] }

export default function Sidebar({ activeSection, setActiveSection, collapsed, setCollapsed }: SidebarProps) {
  
  const { currentTheme } = useTheme()

  // Referência para navegação por teclado
  const sidebarRef = useRef<HTMLDivElement>(null)
  const [focusedIndex, setFocusedIndex] = useState(-1)
  
  // Responsividade
  const isMobile = useMediaQuery({ maxWidth: 768 })
  const isTablet = useMediaQuery({ minWidth: 769, maxWidth: 1024 })
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Auto-colapsar em mobile e tablet
  useEffect(() => {
    if (isMobile) {
      setCollapsed(true)
    } else if (isTablet && !collapsed) {
      setCollapsed(true)
    }
  }, [isMobile, isTablet, setCollapsed])

  // Categorias iguais ao Taste (branding Ekklesia)
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['operational'])
  const toggleCategory = (categoryId: string) => setExpandedCategories(prev => prev.includes(categoryId) ? prev.filter(id => id !== categoryId) : [...prev, categoryId])
  const isCategoryExpanded = (categoryId: string) => expandedCategories.includes(categoryId)

  const menuCategories: MenuCategory[] = [
    {
      id: 'operational',
      label: 'Operacional',
      icon: Store,
      color: 'blue',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, description: 'Visão geral da igreja' },
        { id: 'members', label: 'Membros', icon: Users, description: 'Lista de membros' },
        { id: 'churches-list', label: 'Relação de Igrejas', icon: Users, description: 'Lista de igrejas' }
      ]
    },
    {
      id: 'ministries',
      label: 'Departamentos & Eventos',
      icon: Building2,
      color: 'green',
      items: [
        { id: 'ministries', label: 'Departamentos', icon: Building2, description: 'Gestão de departamentos' },
        { id: 'events', label: 'Eventos', icon: Calendar, description: 'Cultos e eventos' }
      ]
    },
    {
      id: 'financial',
      label: 'Financeiro',
      icon: DollarSign,
      color: 'yellow',
      items: [
        { id: 'tithings', label: 'Relatório Financeiro', icon: DollarSign, description: 'Entradas e saídas' }
      ]
    },
    {
      id: 'analytics',
      label: 'Relatórios & Dados',
      icon: BarChart3,
      color: 'indigo',
      items: [
        { id: 'reports-analytics', label: 'Relatórios', icon: FileText, description: 'Relatórios de membros' },
        { id: 'analytics', label: 'Dados', icon: Database, description: 'Análise' }
      ]
    },
    {
      id: 'integrations',
      label: 'Integrações',
      icon: Smartphone,
      color: 'pink',
      items: [
        { id: 'integrations', label: 'Integrações', icon: Smartphone }
      ]
    },
    {
      id: 'system',
      label: 'Sistema',
      icon: Cog,
      color: 'gray',
      items: [
        { id: 'settings', label: 'Configurações', icon: Cog }
      ]
    }
  ]

  const handleMenuClick = (itemId: string) => {
    setActiveSection(itemId)
    if (isMobile || isTablet) {
      setMobileMenuOpen(false)
      setCollapsed(true)
    }
  }

  const handleCategoryClick = (categoryId: string) => {
    // Se sidebar está colapsado, expande automaticamente
    if (collapsed && !isMobile) {
      setCollapsed(false)
    }
    toggleCategory(categoryId)
  }

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

  return (
    <>
      {/* Overlay para mobile */}
      {isMobile && mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      
      <aside 
        ref={sidebarRef}
        className={`fixed left-0 top-0 h-full shadow-2xl transition-all duration-300 z-40 ${
          isMobile 
            ? mobileMenuOpen 
              ? 'w-64 translate-x-0' 
              : 'w-64 -translate-x-full'
            : collapsed 
              ? 'w-16' 
              : isTablet 
                ? 'w-56' 
                : 'w-64'
        }`} 
        style={{ 
          background: currentTheme === 'dark'
            ? 'linear-gradient(180deg, #0d1117 0%, #1a1a1a 50%, #000000 100%)'
            : 'linear-gradient(180deg, #ffffff 0%, #f8fafc 50%, #f1f5f9 100%)',
          borderRight: currentTheme === 'dark'
            ? '1px solid rgba(59, 130, 246, 0.1)'
            : '1px solid rgba(59, 130, 246, 0.2)'
        }}
        role="navigation"
        aria-label="Menu principal de navegação"
      >
        {/* Logo */}
        <div className={`p-6 border-b ${currentTheme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center space-x-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)' }}
            >
              <Building2 className="w-5 h-5 text-white" />
            </div>
            {(!collapsed || (isMobile && mobileMenuOpen)) && (
              <div>
                <h1 className={`font-bold ${isTablet ? 'text-lg' : 'text-xl'} ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Vynlo <span style={{ color: '#60a5fa' }}>Ekklesia</span>
                </h1>
                <p className={`text-sm ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Sistema de Igrejas</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav 
          className={`mt-6 px-3 overflow-y-auto h-[calc(100vh-200px)] ${currentTheme === 'dark' ? 'scrollbar-dark' : 'scrollbar-light'}`}
          role="menubar"
          aria-label="Menu de navegação do dashboard"
        >
          {menuCategories.map((category) => {
            const IconComponent = category.icon
            const isExpanded = isCategoryExpanded(category.id)
            const hasActiveItem = category.items.some(item => item.id === activeSection)

            return (
              <div key={category.id} className="mb-3">
                {/* Category Header */}
                <button
                  onClick={() => handleCategoryClick(category.id)}
                  className={`w-full flex items-center justify-between px-3 py-3 rounded-xl transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    hasActiveItem
                      ? currentTheme === 'dark'
                        ? 'text-white bg-gray-800/50'
                        : 'text-gray-900 bg-blue-50'
                      : currentTheme === 'dark'
                        ? 'text-gray-300 hover:text-white hover:bg-gray-800/30'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  role="menuitem"
                  aria-expanded={isExpanded}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-r ${getCategoryColor(category.color)}`}>
                      <IconComponent className="w-4 h-4 text-white" />
                    </div>
                    {(!collapsed || (isMobile && mobileMenuOpen)) && (
                      <span className={`font-medium ${isTablet ? 'text-xs' : 'text-sm'}`}>{category.label}</span>
                    )}
                  </div>

                  {(!collapsed || (isMobile && mobileMenuOpen)) && (
                    <div className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  )}
                </button>

                {/* Category Items */}
                {isExpanded && (
                  <div className="ml-6 mt-2 space-y-1">
                    {category.items.map((item) => {
                      const ItemIconComponent = item.icon
                      const isActive = activeSection === item.id
            
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleMenuClick(item.id)}
                          className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                            isActive 
                              ? 'text-white shadow-lg' 
                              : currentTheme === 'dark'
                                ? 'text-gray-400 hover:text-white hover:bg-gray-800/30'
                                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                          }`}
                          style={isActive ? { 
                            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)' 
                          } : {}}
                          role="menuitem"
                          aria-current={isActive ? 'page' : undefined}
                        >
                          <ItemIconComponent className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : currentTheme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
                          <div className="flex-1 text-left">
                            <span className={`font-medium ${isTablet ? 'text-xs' : 'text-sm'}`}>{item.label}</span>
                            {item.description && !isTablet && (
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

        {/* Collapse Toggle - Desktop/Tablet */}
        {!isMobile && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="absolute -right-3 top-20 w-6 h-6 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)' }}
            aria-label={collapsed ? 'Expandir menu lateral' : 'Recolher menu lateral'}
          >
            {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
          </button>
        )}
      </aside>
    </>
  )
}


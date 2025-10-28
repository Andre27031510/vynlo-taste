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
  setActiveSection: React.Dispatch<React.SetStateAction<string>>
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
        { id: 'churches-list', label: 'Relação de Igrejas', icon: Users, description: 'Lista de igrejas' },
        { id: 'churches-register', label: 'Registrar Igreja', icon: Building2, description: 'Cadastrar nova igreja' }
      ]
    },
    {
      id: 'ministries',
      label: 'Ministérios & Eventos',
      icon: Building2,
      color: 'green',
      items: [
        { id: 'ministries', label: 'Ministérios', icon: Building2, description: 'Gestão de ministérios' },
        { id: 'events', label: 'Eventos', icon: Calendar, description: 'Cultos e eventos' }
      ]
    },
    {
      id: 'financial',
      label: 'Financeiro',
      icon: DollarSign,
      color: 'yellow',
      items: [
        { id: 'tithings', label: 'Dízimos', icon: DollarSign, description: 'Dízimos e ofertas' }
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

  const SidebarContent = () => (
    <nav
      ref={sidebarRef}
      className={`h-full overflow-y-auto transition-all duration-300 ${
        currentTheme === 'dark' 
          ? 'bg-gray-900 border-r border-gray-800' 
          : 'bg-white border-r border-gray-200'
      } ${collapsed ? 'w-16' : 'w-64'}`}
      aria-label="Ekklesia Navigation"
    >
      {/* Header do Sidebar */}
      <div className={`p-4 border-b ${currentTheme === 'dark' ? 'border-gray-800' : 'border-gray-200'} flex items-center justify-between`}>
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-gray-900 dark:text-white">Vynlo Ekklesia</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Sistema de Igrejas</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto">
            <Building2 className="w-5 h-5 text-white" />
          </div>
        )}
      </div>

      {/* Menu por categorias (igual ao Taste) */}
      <div className="p-4 space-y-3">
        {menuCategories.map((category, cIdx) => {
          const IconCategory = category.icon
          const expanded = isCategoryExpanded(category.id)
          const hasActive = category.items.some(i => i.id === activeSection)

          return (
            <div key={category.id} className="">
              <button
                onClick={() => toggleCategory(category.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all ${
                  hasActive
                    ? currentTheme === 'dark' ? 'text-white bg-gray-800/50' : 'text-gray-900 bg-blue-50'
                    : currentTheme === 'dark' ? 'text-gray-300 hover:text-white hover:bg-gray-800/30' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
                aria-expanded={expanded}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                    <IconCategory className="w-4 h-4 text-white" />
                  </div>
                  {!collapsed && <span className="font-medium text-sm">{category.label}</span>}
                </div>
                {!collapsed && (expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
              </button>

              {expanded && (
                <div className="ml-6 mt-2 space-y-1">
                  {category.items.map((item, iIdx) => {
                    const IconItem = item.icon
                    const isActive = activeSection === item.id
                    const indexFlat = cIdx * 10 + iIdx
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleMenuClick(item.id)}
                        onFocus={() => setFocusedIndex(indexFlat)}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md transition-all ${
                          isActive
                            ? 'text-white'
                            : currentTheme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-gray-800/30' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                        style={isActive ? { background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)' } : {}}
                        aria-current={isActive ? 'page' : undefined}
                        title={collapsed ? item.label : undefined}
                      >
                        <IconItem className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : ''}`} />
                        {!collapsed && (
                          <div className="flex-1 text-left">
                            <span className="font-medium text-sm">{item.label}</span>
                            {item.description && <p className={`text-xs ${currentTheme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>{item.description}</p>}
                          </div>
                        )}
                        {isActive && <div className="w-2 h-2 bg-white rounded-full" />}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </nav>
  )

  // Mobile/Tablet: Menu lateral com overlay
  if (isMobile || isTablet) {
    return (
      <>
        {/* Botão hambúrguer */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`fixed top-4 left-4 z-50 p-2 rounded-lg ${
            currentTheme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } shadow-lg`}
          aria-label="Toggle menu"
        >
          <MenuIcon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        </button>

        {/* Overlay */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Sidebar mobile */}
        <div
          className={`fixed left-0 top-0 h-full z-50 transition-transform duration-300 ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <SidebarContent />
        </div>
      </>
    )
  }

  // Desktop: Sidebar fixo
  return <SidebarContent />
}


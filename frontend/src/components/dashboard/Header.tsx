'use client'

import { Bell, Search, User, Menu, Moon, Sun, Monitor, LogOut, Settings, ChevronDown } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import { useAuth } from '@/contexts/AuthContext'
import { useState, useEffect, useRef } from 'react'

interface HeaderProps {
  sidebarCollapsed: boolean
  setSidebarCollapsed: (collapsed: boolean) => void
}

export default function Header({ sidebarCollapsed, setSidebarCollapsed }: HeaderProps) {
  const { currentTheme, toggleTheme } = useTheme()
  const { user, logout } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  // Fechar menu quando clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className={`border-b transition-all duration-300 px-6 py-4 ${
      currentTheme === 'dark' 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={`lg:hidden p-2 rounded-lg transition-colors duration-200 ${
              currentTheme === 'dark'
                ? 'hover:bg-gray-700 text-gray-400'
                : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
              currentTheme === 'dark' ? 'text-gray-500' : 'text-gray-400'
            }`} />
            <input
              type="text"
              placeholder="Buscar pedidos, clientes..."
              className={`pl-10 pr-4 py-2 w-80 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                currentTheme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <div className={`flex items-center space-x-1 rounded-lg p-1 ${
            currentTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
          }`}>
            <button
              onClick={() => toggleTheme('light')}
              className={`p-2 rounded-md transition-all duration-200 ${
                currentTheme === 'light'
                  ? 'bg-white text-yellow-600 shadow-sm'
                  : currentTheme === 'dark'
                    ? 'text-gray-400 hover:text-gray-300'
                    : 'text-gray-500 hover:text-gray-700'
              }`}
              title="Modo Claro"
            >
              <Sun className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => toggleTheme('auto')}
              className={`p-2 rounded-md transition-all duration-200 ${
                currentTheme === 'auto'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : currentTheme === 'dark'
                    ? 'text-gray-400 hover:text-gray-300'
                    : 'text-gray-500 hover:text-gray-700'
              }`}
              title="Modo Automático"
            >
              <Monitor className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => toggleTheme('dark')}
              className={`p-2 rounded-md transition-all duration-200 ${
                currentTheme === 'dark'
                  ? 'bg-gray-600 text-purple-400 shadow-sm'
                  : currentTheme === 'dark'
                    ? 'text-gray-400 hover:text-gray-300'
                    : 'text-gray-500 hover:text-gray-700'
              }`}
              title="Modo Escuro"
            >
              <Moon className="w-4 h-4" />
            </button>
          </div>

          <button className={`relative p-2 rounded-lg transition-colors duration-200 ${
            currentTheme === 'dark'
              ? 'hover:bg-gray-700 text-gray-400'
              : 'hover:bg-gray-100 text-gray-600'
          }`}>
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>
          
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="text-left">
                <p className={`text-sm font-medium ${
                  currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>{user?.displayName || 'Usuário'}</p>
                <p className={`text-xs ${
                  currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>{user?.email || 'email@exemplo.com'}</p>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                showUserMenu ? 'rotate-180' : ''
              } ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
            </button>

            {/* User Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                <button
                  onClick={() => {/* TODO: Implementar configurações */}}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                >
                  <Settings className="w-4 h-4" />
                  <span>Configurações</span>
                </button>
                <hr className="my-1 border-gray-200 dark:border-gray-700" />
                <button
                  onClick={logout}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sair</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
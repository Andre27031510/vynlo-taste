'use client'

import { useState, Suspense, lazy, useEffect, startTransition } from 'react'
import Sidebar from '@/components/ekklesia/Sidebar'
import Header from '@/components/dashboard/Header'
import EkklesiaStats from '@/components/ekklesia/EkklesiaStats'
import { useTheme } from '@/hooks/useTheme'
import ProtectedRoute from '@/components/auth/ProtectedRoute'

// Lazy load components
const EkklesiaDashboard = lazy(() => import('@/components/ekklesia/EkklesiaDashboard'))
const MemberManagement = lazy(() => import('@/components/ekklesia/MemberManagement'))
const EventManagement = lazy(() => import('@/components/ekklesia/EventManagement'))
const TithingManagement = lazy(() => import('@/components/ekklesia/TithingManagement'))
const MinistryManagement = lazy(() => import('@/components/ekklesia/MinistryManagement'))
const CellGroupManagement = lazy(() => import('@/components/ekklesia/CellGroupManagement'))
const ChurchesList = lazy(() => import('@/components/ekklesia/ChurchesList'))

type DashboardSection = 'dashboard' | 'members' | 'events' | 'tithings' | 'ministries' | 'cell-groups' | 'churches-list' | 'churches-register'

const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    <span className="ml-3 text-gray-600">Carregando...</span>
  </div>
)

export default function EkklesiaDashboardPage() {
  const [activeSection, setActiveSection] = useState<DashboardSection>('dashboard')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const { currentTheme } = useTheme()
  
  // ✅ CORREÇÃO: Adicionar classe dashboard-context ao body
  useEffect(() => {
    document.body.classList.add('dashboard-context')
    return () => {
      document.body.classList.remove('dashboard-context')
    }
  }, [])

  const renderContent = () => {
    const components: Record<DashboardSection, React.LazyExoticComponent<React.ComponentType<any>>> = {
      dashboard: EkklesiaDashboard,
      members: MemberManagement,
      events: EventManagement,
      tithings: TithingManagement,
      ministries: MinistryManagement,
      'cell-groups': CellGroupManagement,
      'churches-list': ChurchesList,
      'churches-register': ChurchesList
    }

    const Component = components[activeSection]

    const isRegister = activeSection === 'churches-register'
    return (
      <div className="transition-all duration-75 opacity-100">
        <Suspense fallback={<LoadingSpinner />}>
          {activeSection.startsWith('churches-') ? (
            <ChurchesList initialRegisterOpen={isRegister} />
          ) : (
            <Component />
          )}
        </Suspense>
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className={`min-h-screen flex ${currentTheme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <Sidebar 
            activeSection={activeSection}
            setActiveSection={(section) => setActiveSection(section as DashboardSection)}
            collapsed={sidebarCollapsed}
            setCollapsed={setSidebarCollapsed}
          />
          
          <div className={`flex-1 flex flex-col transition-all duration-150 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
            <Header 
              sidebarCollapsed={sidebarCollapsed}
              setSidebarCollapsed={setSidebarCollapsed}
            />
            
            <main className={`flex-1 p-6 ${currentTheme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
              {/* Stats sempre visíveis no topo */}
              <div className="mb-6">
                <EkklesiaStats />
              </div>
              
              {/* Conteúdo principal com lazy loading */}
              {renderContent()}
            </main>
            
            {/* Footer */}
            <footer className={`border-t px-6 py-4 ${currentTheme === 'dark' ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'}`}>
              <div className="flex items-center justify-between">
                <div className={`text-sm ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Vynlo Ekklesia © {new Date().getFullYear()} - Todos os direitos reservados
                </div>
                <div className={`text-sm ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Sistema de Gestão para Igrejas
                </div>
              </div>
            </footer>
          </div>
      </div>
    </ProtectedRoute>
  )
}


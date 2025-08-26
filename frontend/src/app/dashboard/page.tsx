'use client'

import { useState, Suspense, lazy } from 'react'
import { useTheme } from '@/hooks/useTheme'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import Sidebar, { DashboardSection } from '@/components/dashboard/Sidebar'
import Header from '@/components/dashboard/Header'
import DashboardStats from '@/components/dashboard/DashboardStats'

// Lazy loading dos componentes para melhorar performance
const DashboardHome = lazy(() => import('@/components/dashboard/DashboardHome'))
const OrdersManagement = lazy(() => import('@/components/dashboard/OrdersManagement'))
const MenuManagement = lazy(() => import('@/components/dashboard/MenuManagement'))
const DeliveryManagement = lazy(() => import('@/components/dashboard/DeliveryManagement'))
const DriversManagement = lazy(() => import('@/components/dashboard/DriversManagement'))
const ClientsManagement = lazy(() => import('@/components/dashboard/ClientsManagement'))
const FinancialManagement = lazy(() => import('@/components/dashboard/FinancialManagement'))
const PaymentManagement = lazy(() => import('@/components/dashboard/PaymentManagement'))
const CashFlowManagement = lazy(() => import('@/components/dashboard/CashFlowManagement'))
const FiscalManagement = lazy(() => import('@/components/dashboard/FiscalManagement'))
const TeamManagement = lazy(() => import('@/components/dashboard/TeamManagement'))
const ReportsAnalytics = lazy(() => import('@/components/dashboard/ReportsAnalytics'))
const BigDataAnalytics = lazy(() => import('@/components/dashboard/BigDataAnalytics'))
const MultiChannelIntegration = lazy(() => import('@/components/dashboard/MultiChannelIntegration'))
const SpecializedSolutions = lazy(() => import('@/components/dashboard/SpecializedSolutions'))
const SystemSettings = lazy(() => import('@/components/dashboard/SystemSettings'))

// Componente de loading para o Suspense
const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    <span className="ml-3 text-gray-600">Carregando...</span>
  </div>
)

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState<DashboardSection>('dashboard')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const { currentTheme } = useTheme()

  const renderContent = () => {
    const components: Record<DashboardSection, React.LazyExoticComponent<() => JSX.Element>> = {
      dashboard: DashboardHome,
      orders: OrdersManagement,
      menu: MenuManagement,
      delivery: DeliveryManagement,
      drivers: DriversManagement,
      clients: ClientsManagement,
      financial: FinancialManagement,
      payments: PaymentManagement,
      cashflow: CashFlowManagement,
      fiscal: FiscalManagement,
      team: TeamManagement,
      'reports-analytics': ReportsAnalytics,
      analytics: BigDataAnalytics,
      integrations: MultiChannelIntegration,
      settings: SystemSettings
    }

    const Component = components[activeSection]

    return (
      <Suspense fallback={<LoadingSpinner />}>
        <Component />
      </Suspense>
    )
  }

  return (
    <ProtectedRoute>
      <div className={`min-h-screen transition-all duration-300 ${currentTheme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="flex">
          <Sidebar 
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            collapsed={sidebarCollapsed}
            setCollapsed={setSidebarCollapsed}
          />
          
          <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
            <Header 
              sidebarCollapsed={sidebarCollapsed}
              setSidebarCollapsed={setSidebarCollapsed}
            />
            
            <main className="p-6">
              {/* Stats sempre visíveis no topo */}
              <div className="mb-6">
                <DashboardStats />
              </div>
              
              {/* Conteúdo principal com lazy loading */}
              {renderContent()}
            </main>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
'use client';
// Otimizado para produção - carrega dados reais das APIs
// v2.1.2 - Produção ready para 3M+ usuários
// Fixed: Dashboard stats now load from backend APIs
// Deploy: 2025-10-11

import { useDashboardStats } from '@/hooks/useDashboardStats';
import { useProductStatsQuery, type ProductStats } from '@/hooks/useProductsQuery';
import { formatCurrency, formatNumber } from '@/utils/format';
// Modified: 2025-10-14 16:48 UTC | Safe formatters verified ✓

export default function DashboardStats() {
  // Usar hooks que chamam APIs reais
  const { data: dashboardStats, isLoading: dashboardLoading } = useDashboardStats();
  const { data: productsData, isLoading: productsLoading } = useProductStatsQuery();
  
  const loading = dashboardLoading || productsLoading;
  
  // Type guard para garantir tipo correto
  const productsStats = productsData as ProductStats | undefined;
  const activeProducts = productsStats?.activeProducts ?? 0;
  
  // ✅ CORREÇÃO: Garantir que dashboardStats não seja undefined
  const stats = dashboardStats || {
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    activeDrivers: 0,
    totalClients: 0,
    systemHealth: {
      orders: 'down' as const,
      payments: 'down' as const,
      delivery: 'down' as const,
      integrations: 'down' as const
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total de Pedidos</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatNumber(stats.totalOrders)}</p>
          </div>
          <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
            <svg className="w-6 h-6 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Receita Total</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(stats.totalRevenue)}</p>
          </div>
          <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
            <svg className="w-6 h-6 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Produtos Ativos</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{activeProducts}</p>
          </div>
          <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full">
            <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total de Clientes</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatNumber(stats.totalClients)}</p>
          </div>
          <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
            <svg className="w-6 h-6 text-purple-600 dark:text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
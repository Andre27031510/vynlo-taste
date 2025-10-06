'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'
import { Toaster } from 'react-hot-toast'

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  // Criar QueryClient com configurações otimizadas para produção
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // Configurações padrão para queries
        staleTime: 30 * 1000, // 30 segundos (reduzido)
        gcTime: 5 * 60 * 1000, // 5 minutos
        retry: (failureCount, error: any) => {
          // Não tentar novamente para erros 4xx
          if (error?.message?.includes('HTTP 4')) {
            return false
          }
          // Circuit breaker errors
          if (error?.message?.includes('Circuit breaker')) {
            return false
          }
          // Máximo 2 tentativas para outros erros (reduzido)
          return failureCount < 2
        },
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        // Error handling global
        throwOnError: false, // Não lançar erros, usar fallback
      },
      mutations: {
        retry: 1,
        retryDelay: 1000,
        throwOnError: false,
      }
    }
  })

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      
      {/* Toast notifications para feedback de erros/sucessos */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
          loading: {
            duration: Infinity,
            iconTheme: {
              primary: '#3b82f6',
              secondary: '#fff',
            },
          },
        }}
      />
      
      {/* DevTools apenas em desenvolvimento */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  )
}
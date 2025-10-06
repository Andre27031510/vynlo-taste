'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  retryCount?: number
  componentName?: string
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
  retryAttempts: number
}

class ErrorBoundary extends Component<Props, State> {
  private retryTimeout?: NodeJS.Timeout

  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, retryAttempts: 0 }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, retryAttempts: 0 }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const errorData = {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      component: this.props.componentName || 'Unknown',
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    }
    
    // Log estruturado
    console.error('ErrorBoundary caught error:', errorData)
    
    // Callback personalizado
    this.props.onError?.(error, errorInfo)
    
    // Enviar para serviço de monitoramento (se disponível)
    this.reportError(errorData)
    
    this.setState({ error, errorInfo })
  }

  private reportError = async (errorData: any) => {
    try {
      // Em produção, enviar para serviço de monitoramento
      if (process.env.NODE_ENV === 'production') {
        // await fetch('/api/errors', { method: 'POST', body: JSON.stringify(errorData) })
      }
    } catch (e) {
      console.warn('Failed to report error:', e)
    }
  }

  handleReset = () => {
    const newRetryCount = this.state.retryAttempts + 1
    const maxRetries = this.props.retryCount || 3
    
    if (newRetryCount <= maxRetries) {
      this.setState({ 
        hasError: false, 
        error: undefined, 
        errorInfo: undefined,
        retryAttempts: newRetryCount
      })
    } else {
      // Após máximo de tentativas, recarregar página
      window.location.reload()
    }
  }

  handleAutoRetry = () => {
    if (this.state.retryAttempts < (this.props.retryCount || 3)) {
      this.retryTimeout = setTimeout(() => {
        this.handleReset()
      }, 2000) // Retry automático após 2 segundos
    }
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (this.state.hasError && !prevState.hasError) {
      this.handleAutoRetry()
    }
  }

  componentWillUnmount() {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout)
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 border border-gray-200 dark:border-gray-700 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {this.props.componentName ? `Erro em ${this.props.componentName}` : 'Algo deu errado'}
            </h3>
            
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              Ocorreu um erro inesperado. 
              {this.state.retryAttempts > 0 && (
                <span className="block text-sm mt-1">
                  Tentativa {this.state.retryAttempts} de {this.props.retryCount || 3}
                </span>
              )}
            </p>
            
            {this.state.retryAttempts < (this.props.retryCount || 3) && (
              <p className="text-sm text-blue-600 dark:text-blue-400 mb-4">
                Tentando novamente automaticamente...
              </p>
            )}

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 dark:text-gray-400 mb-2">
                  Detalhes do erro (desenvolvimento)
                </summary>
                <pre className="text-xs bg-gray-100 dark:bg-gray-900 p-3 rounded overflow-auto max-h-32">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
            
            <div className="flex flex-col sm:flex-row gap-3">
              {this.state.retryAttempts < (this.props.retryCount || 3) ? (
                <button
                  onClick={this.handleReset}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium flex items-center justify-center space-x-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Tentar Agora</span>
                </button>
              ) : (
                <button
                  onClick={() => window.location.reload()}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium flex items-center justify-center space-x-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Recarregar Página</span>
                </button>
              )}
              
              <button
                onClick={() => window.history.back()}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 font-medium"
              >
                Voltar
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
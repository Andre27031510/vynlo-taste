'use client'
// v2.2.0 - Configurações do Sistema com APIs Reais
// Modified: 2025-10-25 | Removidos dados mocks, implementadas APIs reais
// CRITICAL: Configurações totalmente funcionais com multi-tenancy
// Deploy: 2025-10-25

import { useState, useEffect } from 'react'
import { 
  Settings, 
  Palette, 
  Moon, 
  Sun, 
  Monitor, 
  Smartphone, 
  Database, 
  Shield, 
  Bell, 
  Users, 
  Globe, 
  Zap, 
  Save, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle, 
  X,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Trash2,
  Download,
  Upload,
  RotateCcw,
  Activity,
  Cpu,
  HardDrive,
  Wifi,
  WifiOff,
  BellOff,
  BellRing,
  UserCheck,
  UserX,
  Globe2,
  Languages,
  Calendar,
  Clock,
  MapPin,
  CreditCard,
  FileText,
  BarChart3,
  Database as DatabaseIcon,
  Server,
  Cloud,
  Key,
  QrCode,
  Scan,
  Fingerprint,
  Smartphone as MobileIcon,
  Tablet,
  Laptop,
  Monitor as DesktopIcon,
  Loader2
} from 'lucide-react'
import { useThemeContext } from '../../contexts/ThemeContext'
import { apiRequest } from '@/services/api'
import toast from 'react-hot-toast'

export default function SystemSettings() {
  const { currentTheme, toggleTheme } = useThemeContext()
  
  // Estados para dados reais
  const [configs, setConfigs] = useState<Map<string, any>>(new Map())
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('appearance')
  const [showAdvancedModal, setShowAdvancedModal] = useState(false)
  const [selectedConfig, setSelectedConfig] = useState<any>(null)

  // Estados para configurações por categoria
  const [appearanceConfigs, setAppearanceConfigs] = useState<Map<string, any>>(new Map())
  const [systemConfigs, setSystemConfigs] = useState<Map<string, any>>(new Map())
  const [securityConfigs, setSecurityConfigs] = useState<Map<string, any>>(new Map())
  const [notificationConfigs, setNotificationConfigs] = useState<Map<string, any>>(new Map())
  const [businessConfigs, setBusinessConfigs] = useState<Map<string, any>>(new Map())
  const [performanceConfigs, setPerformanceConfigs] = useState<Map<string, any>>(new Map())

  // ✅ Carregar configurações reais da API
  const loadConfigs = async () => {
    try {
      setIsLoading(true)
      
      // Carregar todas as configurações
      const response = await apiRequest('core-service', 'v1/system-configs/all')
      
      if (!response.ok) {
        // Se não houver configurações no banco, usar valores padrão
        console.warn('⚠️ Nenhuma configuração encontrada, usando valores padrão')
        initializeDefaultConfigs()
        setIsLoading(false)
        return
      }
      
      const data = await response.json()
      const configsMap = new Map(Object.entries(data.configs || {}))
      setConfigs(configsMap)
      
      // Separar por categoria
      const appearance = new Map()
      const system = new Map()
      const security = new Map()
      const notifications = new Map()
      const business = new Map()
      const performance = new Map()
      
      configsMap.forEach((value, key) => {
        if (key.startsWith('appearance.')) {
          appearance.set(key, value)
        } else if (key.startsWith('system.')) {
          system.set(key, value)
        } else if (key.startsWith('security.')) {
          security.set(key, value)
        } else if (key.startsWith('notifications.')) {
          notifications.set(key, value)
        } else if (key.startsWith('business.')) {
          business.set(key, value)
        } else if (key.startsWith('performance.')) {
          performance.set(key, value)
        }
      })
      
      setAppearanceConfigs(appearance)
      setSystemConfigs(system)
      setSecurityConfigs(security)
      setNotificationConfigs(notifications)
      setBusinessConfigs(business)
      setPerformanceConfigs(performance)
      
    } catch (error: any) {
      console.error('Erro ao carregar configurações:', error)
      toast.error(`❌ Erro ao carregar configurações: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  // ✅ Salvar configurações
  const saveConfigs = async (configsToSave: Map<string, any>) => {
    try {
      setIsSaving(true)
      
      const configsObject = Object.fromEntries(configsToSave)
      const response = await apiRequest('core-service', 'v1/system-configs/bulk-update', {
        method: 'POST',
        body: JSON.stringify(configsObject)
      })
      
      if (!response.ok) {
        throw new Error(`Erro ao salvar configurações: ${response.status}`)
      }
      
      toast.success('✅ Configurações salvas com sucesso!')
      await loadConfigs() // Recarregar configurações
      
    } catch (error: any) {
      console.error('Erro ao salvar configurações:', error)
      toast.error(`❌ Erro ao salvar configurações: ${error.message}`)
    } finally {
      setIsSaving(false)
    }
  }

  // ✅ Atualizar configuração específica
  const updateConfig = (key: string, value: any) => {
    const newConfigs = new Map(configs)
    newConfigs.set(key, value)
    setConfigs(newConfigs)
    
    // Aplicar mudança de tema imediatamente
    if (key === 'appearance.theme' && value) {
      toggleTheme(value as 'light' | 'dark' | 'auto')
      toast.success(`✅ Tema alterado para: ${value}`)
    }
    
    // Atualizar categoria específica
    if (key.startsWith('appearance.')) {
      const newAppearance = new Map(appearanceConfigs)
      newAppearance.set(key, value)
      setAppearanceConfigs(newAppearance)
    } else if (key.startsWith('system.')) {
      const newSystem = new Map(systemConfigs)
      newSystem.set(key, value)
      setSystemConfigs(newSystem)
    } else if (key.startsWith('security.')) {
      const newSecurity = new Map(securityConfigs)
      newSecurity.set(key, value)
      setSecurityConfigs(newSecurity)
    } else if (key.startsWith('notifications.')) {
      const newNotifications = new Map(notificationConfigs)
      newNotifications.set(key, value)
      setNotificationConfigs(newNotifications)
    } else if (key.startsWith('business.')) {
      const newBusiness = new Map(businessConfigs)
      newBusiness.set(key, value)
      setBusinessConfigs(newBusiness)
    } else if (key.startsWith('performance.')) {
      const newPerformance = new Map(performanceConfigs)
      newPerformance.set(key, value)
      setPerformanceConfigs(newPerformance)
    }
  }

  // ✅ Inicializar configurações padrão
  const initializeDefaultConfigs = () => {
    const defaultConfigs = new Map([
      // Aparência
      ['appearance.theme', 'light'],
      ['appearance.primary_color', '#3b82f6'],
      ['appearance.secondary_color', '#8b5cf6'],
      ['appearance.font_size', 'medium'],
      ['appearance.border_radius', 'medium'],
      ['appearance.shadows', 'true'],
      ['appearance.animations', 'true'],
      ['appearance.compact_mode', 'false'],
      
      // Sistema
      ['system.language', 'pt-BR'],
      ['system.timezone', 'America/Sao_Paulo'],
      ['system.date_format', 'DD/MM/YYYY'],
      ['system.time_format', '24h'],
      ['system.currency', 'BRL'],
      ['system.decimal_places', '2'],
      ['system.thousands_separator', '.'],
      ['system.decimal_separator', ','],
      
      // Segurança
      ['security.session_timeout', '3600'],
      ['security.password_min_length', '8'],
      ['security.password_require_special', 'true'],
      ['security.password_require_numbers', 'true'],
      ['security.password_require_uppercase', 'true'],
      ['security.max_login_attempts', '5'],
      ['security.lockout_duration', '15'],
      ['security.require_2fa', 'false'],
      
      // Notificações
      ['notifications.email_enabled', 'true'],
      ['notifications.sms_enabled', 'false'],
      ['notifications.push_enabled', 'true'],
      ['notifications.whatsapp_enabled', 'false'],
      
      // Negócio
      ['business.delivery_fee', '5.00'],
      ['business.min_order_value', '10.00'],
      ['business.max_delivery_distance', '10'],
      ['business.delivery_time_estimate', '30'],
      ['business.auto_accept_orders', 'false'],
      
      // Performance
      ['performance.cache_ttl', '300'],
      ['performance.max_cache_size', '100'],
      ['performance.enable_redis', 'false'],
      ['performance.redis_ttl', '600'],
      ['performance.max_connections', '50'],
      ['performance.connection_timeout', '30'],
      ['performance.request_timeout', '60'],
      ['performance.rate_limit_per_minute', '100']
    ])
    
    setConfigs(defaultConfigs)
    
    // Separar por categoria
    const appearance = new Map()
    const system = new Map()
    const security = new Map()
    const notifications = new Map()
    const business = new Map()
    const performance = new Map()
    
    defaultConfigs.forEach((value, key) => {
      if (key.startsWith('appearance.')) appearance.set(key, value)
      else if (key.startsWith('system.')) system.set(key, value)
      else if (key.startsWith('security.')) security.set(key, value)
      else if (key.startsWith('notifications.')) notifications.set(key, value)
      else if (key.startsWith('business.')) business.set(key, value)
      else if (key.startsWith('performance.')) performance.set(key, value)
    })
    
    setAppearanceConfigs(appearance)
    setSystemConfigs(system)
    setSecurityConfigs(security)
    setNotificationConfigs(notifications)
    setBusinessConfigs(business)
    setPerformanceConfigs(performance)
  }

  // ✅ Carregar dados na inicialização
  useEffect(() => {
    loadConfigs()
  }, [])

  // ✅ Função para obter valor da configuração
  const getConfigValue = (key: string, defaultValue: any = '') => {
    return configs.get(key) || defaultValue
  }

  // ✅ Função para renderizar campo de configuração
  const renderConfigField = (key: string, label: string, type: string = 'text', options?: any[]) => {
    const value = getConfigValue(key)
    
    // Valores padrão para campos de cor
    const getColorValue = () => {
      if (value && value.startsWith('#')) return value
      return value || '#3b82f6' // Valor padrão azul
    }
    
    return (
      <div key={key} className="space-y-2">
        <label className={`block text-sm font-medium ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
          {label}
        </label>
        
        {type === 'select' && options ? (
          <select
            value={value || ''}
            onChange={(e) => updateConfig(key, e.target.value)}
            className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white`}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : type === 'textarea' ? (
          <textarea
            value={value || ''}
            onChange={(e) => updateConfig(key, e.target.value)}
            rows={3}
            className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white`}
          />
        ) : type === 'checkbox' ? (
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={value === 'true' || value === true}
              onChange={(e) => updateConfig(key, e.target.checked.toString())}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label className={`ml-2 text-sm ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Habilitado
            </label>
          </div>
        ) : type === 'number' ? (
          <input
            type="number"
            value={value || ''}
            onChange={(e) => updateConfig(key, e.target.value)}
            className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white`}
          />
        ) : type === 'color' ? (
          <input
            type="color"
            value={getColorValue()}
            onChange={(e) => updateConfig(key, e.target.value)}
            className={`w-full h-10 px-1 py-1 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700`}
          />
        ) : (
          <input
            type={type}
            value={value || ''}
            onChange={(e) => updateConfig(key, e.target.value)}
            className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white`}
          />
        )}
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-600 dark:text-gray-400">Carregando configurações...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Configurações do Sistema</h2>
          <p className="text-gray-600 dark:text-gray-400">Gerencie as configurações do sistema</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={loadConfigs}
            disabled={isLoading}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Atualizar</span>
          </button>
          <button
            onClick={() => saveConfigs(configs)}
            disabled={isSaving}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className={`w-4 h-4 ${isSaving ? 'animate-spin' : ''}`} />
            <span>{isSaving ? 'Salvando...' : 'Salvar'}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'appearance', label: 'Aparência', icon: Palette },
            { id: 'system', label: 'Sistema', icon: Settings },
            { id: 'security', label: 'Segurança', icon: Shield },
            { id: 'notifications', label: 'Notificações', icon: Bell },
            { id: 'business', label: 'Negócio', icon: BarChart3 },
            { id: 'performance', label: 'Performance', icon: Zap }
          ].map((tab) => {
            const IconComponent = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {/* Aparência */}
        {activeTab === 'appearance' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`${currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-lg p-6 border`}>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tema e Cores</h3>
              <div className="space-y-4">
                {renderConfigField('appearance.theme', 'Tema', 'select', [
                  { value: 'light', label: 'Claro' },
                  { value: 'dark', label: 'Escuro' },
                  { value: 'auto', label: 'Automático' }
                ])}
                {renderConfigField('appearance.primary_color', 'Cor Primária', 'color')}
                {renderConfigField('appearance.secondary_color', 'Cor Secundária', 'color')}
                {renderConfigField('appearance.font_size', 'Tamanho da Fonte', 'select', [
                  { value: 'small', label: 'Pequeno' },
                  { value: 'medium', label: 'Médio' },
                  { value: 'large', label: 'Grande' }
                ])}
              </div>
            </div>
            
            <div className={`${currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-lg p-6 border`}>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Interface</h3>
              <div className="space-y-4">
                {renderConfigField('appearance.border_radius', 'Bordas Arredondadas', 'select', [
                  { value: 'none', label: 'Nenhuma' },
                  { value: 'small', label: 'Pequenas' },
                  { value: 'medium', label: 'Médias' },
                  { value: 'large', label: 'Grandes' }
                ])}
                {renderConfigField('appearance.shadows', 'Sombras', 'checkbox')}
                {renderConfigField('appearance.animations', 'Animações', 'checkbox')}
                {renderConfigField('appearance.compact_mode', 'Modo Compacto', 'checkbox')}
              </div>
            </div>
          </div>
        )}

        {/* Sistema */}
        {activeTab === 'system' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`${currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-lg p-6 border`}>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Localização</h3>
              <div className="space-y-4">
                {renderConfigField('system.language', 'Idioma', 'select', [
                  { value: 'pt-BR', label: 'Português (Brasil)' },
                  { value: 'en-US', label: 'English (US)' },
                  { value: 'es-ES', label: 'Español' }
                ])}
                {renderConfigField('system.timezone', 'Fuso Horário', 'select', [
                  { value: 'America/Sao_Paulo', label: 'São Paulo (UTC-3)' },
                  { value: 'America/New_York', label: 'New York (UTC-5)' },
                  { value: 'Europe/London', label: 'London (UTC+0)' }
                ])}
                {renderConfigField('system.date_format', 'Formato de Data', 'select', [
                  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
                  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
                  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' }
                ])}
                {renderConfigField('system.time_format', 'Formato de Hora', 'select', [
                  { value: '12h', label: '12 horas' },
                  { value: '24h', label: '24 horas' }
                ])}
              </div>
            </div>
            
            <div className={`${currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-lg p-6 border`}>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Moeda e Formatação</h3>
              <div className="space-y-4">
                {renderConfigField('system.currency', 'Moeda', 'select', [
                  { value: 'BRL', label: 'Real Brasileiro (R$)' },
                  { value: 'USD', label: 'Dólar Americano ($)' },
                  { value: 'EUR', label: 'Euro (€)' }
                ])}
                {renderConfigField('system.decimal_places', 'Casas Decimais', 'number')}
                {renderConfigField('system.thousands_separator', 'Separador de Milhares', 'select', [
                  { value: '.', label: 'Ponto (.)' },
                  { value: ',', label: 'Vírgula (,)' },
                  { value: ' ', label: 'Espaço ( )' }
                ])}
                {renderConfigField('system.decimal_separator', 'Separador Decimal', 'select', [
                  { value: ',', label: 'Vírgula (,)' },
                  { value: '.', label: 'Ponto (.)' }
                ])}
              </div>
            </div>
          </div>
        )}

        {/* Segurança */}
        {activeTab === 'security' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`${currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-lg p-6 border`}>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Autenticação</h3>
              <div className="space-y-4">
                {renderConfigField('security.session_timeout', 'Timeout da Sessão (segundos)', 'number')}
                {renderConfigField('security.password_min_length', 'Tamanho Mínimo da Senha', 'number')}
                {renderConfigField('security.password_require_special', 'Exigir Caracteres Especiais', 'checkbox')}
                {renderConfigField('security.password_require_numbers', 'Exigir Números', 'checkbox')}
                {renderConfigField('security.password_require_uppercase', 'Exigir Maiúsculas', 'checkbox')}
              </div>
            </div>
            
            <div className={`${currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-lg p-6 border`}>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Acesso</h3>
              <div className="space-y-4">
                {renderConfigField('security.max_login_attempts', 'Máximo de Tentativas de Login', 'number')}
                {renderConfigField('security.lockout_duration', 'Duração do Bloqueio (minutos)', 'number')}
                {renderConfigField('security.require_2fa', 'Exigir Autenticação de Dois Fatores', 'checkbox')}
                {renderConfigField('security.ip_whitelist', 'Lista de IPs Permitidos', 'textarea')}
              </div>
            </div>
          </div>
        )}

        {/* Notificações */}
        {activeTab === 'notifications' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`${currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-lg p-6 border`}>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Canais de Notificação</h3>
              <div className="space-y-4">
                {renderConfigField('notifications.email_enabled', 'Notificações por Email', 'checkbox')}
                {renderConfigField('notifications.sms_enabled', 'Notificações por SMS', 'checkbox')}
                {renderConfigField('notifications.push_enabled', 'Notificações Push', 'checkbox')}
                {renderConfigField('notifications.whatsapp_enabled', 'Notificações por WhatsApp', 'checkbox')}
              </div>
            </div>
            
            <div className={`${currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-lg p-6 border`}>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Configurações de Email</h3>
              <div className="space-y-4">
                {renderConfigField('notifications.email_from', 'Email Remetente', 'email')}
                {renderConfigField('notifications.email_reply_to', 'Email de Resposta', 'email')}
                {renderConfigField('notifications.email_smtp_host', 'Servidor SMTP', 'text')}
                {renderConfigField('notifications.email_smtp_port', 'Porta SMTP', 'number')}
              </div>
            </div>
          </div>
        )}

        {/* Negócio */}
        {activeTab === 'business' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`${currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-lg p-6 border`}>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Configurações de Entrega</h3>
              <div className="space-y-4">
                {renderConfigField('business.delivery_fee', 'Taxa de Entrega (R$)', 'number')}
                {renderConfigField('business.min_order_value', 'Valor Mínimo do Pedido (R$)', 'number')}
                {renderConfigField('business.max_delivery_distance', 'Distância Máxima de Entrega (km)', 'number')}
                {renderConfigField('business.delivery_time_estimate', 'Tempo Estimado de Entrega (minutos)', 'number')}
              </div>
            </div>
            
            <div className={`${currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-lg p-6 border`}>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Horários de Funcionamento</h3>
              <div className="space-y-4">
                {renderConfigField('business.open_time', 'Horário de Abertura', 'time')}
                {renderConfigField('business.close_time', 'Horário de Fechamento', 'time')}
                {renderConfigField('business.max_preparation_time', 'Tempo Máximo de Preparo (minutos)', 'number')}
                {renderConfigField('business.auto_accept_orders', 'Aceitar Pedidos Automaticamente', 'checkbox')}
              </div>
            </div>
          </div>
        )}

        {/* Performance */}
        {activeTab === 'performance' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`${currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-lg p-6 border`}>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Cache e Memória</h3>
              <div className="space-y-4">
                {renderConfigField('performance.cache_ttl', 'TTL do Cache (segundos)', 'number')}
                {renderConfigField('performance.max_cache_size', 'Tamanho Máximo do Cache (MB)', 'number')}
                {renderConfigField('performance.enable_redis', 'Habilitar Redis', 'checkbox')}
                {renderConfigField('performance.redis_ttl', 'TTL do Redis (segundos)', 'number')}
              </div>
            </div>
            
            <div className={`${currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-lg p-6 border`}>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Conexões e Limites</h3>
              <div className="space-y-4">
                {renderConfigField('performance.max_connections', 'Máximo de Conexões Simultâneas', 'number')}
                {renderConfigField('performance.connection_timeout', 'Timeout de Conexão (segundos)', 'number')}
                {renderConfigField('performance.request_timeout', 'Timeout de Requisição (segundos)', 'number')}
                {renderConfigField('performance.rate_limit_per_minute', 'Limite de Requisições por Minuto', 'number')}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
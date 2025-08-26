'use client'

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
  Monitor as DesktopIcon
} from 'lucide-react'

export default function SystemSettings() {
  // Estados para funcionalidades
  const [isLoading, setIsLoading] = useState(false)
  const [showMessage, setShowMessage] = useState(false)
  const [messageText, setMessageText] = useState('')
  const [messageType, setMessageType] = useState('success')
  const [isProcessing, setIsProcessing] = useState(false)
  const [activeTab, setActiveTab] = useState('appearance')
  const [showAdvancedModal, setShowAdvancedModal] = useState(false)
  const [selectedSetting, setSelectedSetting] = useState(null)

  // Estados para configurações de aparência
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: 'dark',
    primaryColor: '#3b82f6',
    secondaryColor: '#8b5cf6',
    accentColor: '#10b981',
    fontSize: 'medium',
    fontFamily: 'Inter',
    borderRadius: 'medium',
    shadows: true,
    animations: true,
    compactMode: false
  })

  // Estados para configurações de sistema
  const [systemSettings, setSystemSettings] = useState({
    language: 'pt-BR',
    timezone: 'America/Sao_Paulo',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    currency: 'BRL',
    decimalPlaces: 2,
    autoSave: true,
    autoSaveInterval: 5,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordExpiry: 90
  })

  // Estados para configurações de segurança
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    biometricAuth: false,
    passwordComplexity: 'strong',
    sessionManagement: true,
    ipWhitelist: [],
    vpnRequired: false,
    encryptionLevel: 'aes-256',
    auditLogging: true,
    backupEncryption: true
  })

  // Estados para configurações de notificações
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    whatsappNotifications: true,
    orderUpdates: true,
    systemAlerts: true,
    marketingEmails: false,
    quietHours: false,
    quietHoursStart: '22:00',
    quietHoursEnd: '08:00'
  })

  // Estados para configurações de performance
  const [performanceSettings, setPerformanceSettings] = useState({
    cacheEnabled: true,
    cacheSize: '1GB',
    imageOptimization: true,
    lazyLoading: true,
    compression: true,
    cdnEnabled: true,
    databaseOptimization: true,
    backgroundTasks: true,
    autoCleanup: true,
    cleanupInterval: 7
  })

  // Estados para configurações de backup
  const [backupSettings, setBackupSettings] = useState({
    autoBackup: true,
    backupFrequency: 'daily',
    backupTime: '02:00',
    retentionPeriod: 30,
    cloudBackup: true,
    localBackup: true,
    encryption: true,
    compression: true,
    verifyBackup: true
  })

  // Estados para configurações de integração
  const [integrationSettings, setIntegrationSettings] = useState({
    apiRateLimit: 1000,
    webhookTimeout: 30,
    retryAttempts: 3,
    sslVerification: true,
    proxyEnabled: false,
    proxyUrl: '',
    corsEnabled: true,
    allowedOrigins: ['*'],
    apiVersioning: true,
    deprecatedApiSupport: false
  })

  // Estados para configurações de usuários
  const [userSettings, setUserSettings] = useState({
    userRegistration: true,
    emailVerification: true,
    phoneVerification: false,
    socialLogin: true,
    guestCheckout: true,
    userProfiles: true,
    privacySettings: true,
    dataExport: true,
    dataDeletion: true
  })

  // Estados para configurações de negócio
  const [businessSettings, setBusinessSettings] = useState({
    businessName: 'Vynlo Taste',
    businessType: 'restaurant',
    taxId: '12.345.678/0001-90',
    address: 'Rua das Flores, 123',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01234-567',
    country: 'Brasil',
    phone: '+55 11 99999-9999',
    email: 'contato@vynlotaste.com',
    website: 'www.vynlotaste.com',
    businessHours: {
      monday: { open: '08:00', close: '22:00', closed: false },
      tuesday: { open: '08:00', close: '22:00', closed: false },
      wednesday: { open: '08:00', close: '22:00', closed: false },
      thursday: { open: '08:00', close: '22:00', closed: false },
      friday: { open: '08:00', close: '23:00', closed: false },
      saturday: { open: '09:00', close: '23:00', closed: false },
      sunday: { open: '10:00', close: '21:00', closed: false }
    }
  })

  // Função para mostrar mensagens
  const displayMessage = (text: string, type: 'success' | 'error') => {
    setMessageText(text)
    setMessageType(type)
    setShowMessage(true)
    
    setTimeout(() => {
      setShowMessage(false)
    }, 3000)
  }

  // Função para salvar configurações
  const saveSettings = async (category: string) => {
    setIsProcessing(true)
    
    try {
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Aplicar configurações ao sistema
      applySettingsToSystem(category)
      
      displayMessage('Configurações salvas com sucesso!', 'success')
      
    } catch (error) {
      displayMessage('Erro ao salvar configurações', 'error')
    } finally {
      setIsProcessing(false)
    }
  }

  // Função para aplicar configurações ao sistema
  const applySettingsToSystem = (category: string) => {
    switch (category) {
      case 'appearance':
        // Aplicar tema ao sistema
        document.documentElement.setAttribute('data-theme', appearanceSettings.theme)
        document.documentElement.style.setProperty('--primary-color', appearanceSettings.primaryColor)
        document.documentElement.style.setProperty('--secondary-color', appearanceSettings.secondaryColor)
        document.documentElement.style.setProperty('--accent-color', appearanceSettings.accentColor)
        
        // Forçar re-render de todos os componentes
        window.dispatchEvent(new CustomEvent('themeChange', { detail: appearanceSettings.theme }))
        break
      
      case 'system':
        // Aplicar configurações de sistema
        localStorage.setItem('systemLanguage', systemSettings.language)
        localStorage.setItem('systemTimezone', systemSettings.timezone)
        break
      
      case 'security':
        // Aplicar configurações de segurança
        if (securitySettings.twoFactorAuth) {
          // Ativar 2FA
        }
        break
      
      case 'notifications':
        // Aplicar configurações de notificações
        if (notificationSettings.pushNotifications) {
          // Ativar notificações push
        }
        break
      
      case 'performance':
        // Aplicar configurações de performance
        if (performanceSettings.cacheEnabled) {
          // Ativar cache
        }
        break
      
      case 'backup':
        // Aplicar configurações de backup
        if (backupSettings.autoBackup) {
          // Configurar backup automático
        }
        break
      
      case 'integration':
        // Aplicar configurações de integração
        if (integrationSettings.sslVerification) {
          // Ativar verificação SSL
        }
        break
      
      case 'users':
        // Aplicar configurações de usuários
        if (userSettings.emailVerification) {
          // Ativar verificação de email
        }
        break
      
      case 'business':
        // Aplicar configurações de negócio
        localStorage.setItem('businessInfo', JSON.stringify(businessSettings))
        break
    }
  }

  // Função para resetar configurações
  const resetSettings = async (category: string) => {
    setIsProcessing(true)
    
    try {
      // Simular reset
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Resetar para valores padrão
      resetToDefaults(category)
      
      displayMessage('Configurações resetadas com sucesso!', 'success')
      
    } catch (error) {
      displayMessage('Erro ao resetar configurações', 'error')
    } finally {
      setIsProcessing(false)
    }
  }

  // Função para resetar para valores padrão
  const resetToDefaults = (category: string) => {
    switch (category) {
      case 'appearance':
        setAppearanceSettings({
          theme: 'dark',
          primaryColor: '#3b82f6',
          secondaryColor: '#8b5cf6',
          accentColor: '#10b981',
          fontSize: 'medium',
          fontFamily: 'Inter',
          borderRadius: 'medium',
          shadows: true,
          animations: true,
          compactMode: false
        })
        break
      
      case 'system':
        setSystemSettings({
          language: 'pt-BR',
          timezone: 'America/Sao_Paulo',
          dateFormat: 'DD/MM/YYYY',
          timeFormat: '24h',
          currency: 'BRL',
          decimalPlaces: 2,
          autoSave: true,
          autoSaveInterval: 5,
          sessionTimeout: 30,
          maxLoginAttempts: 5,
          passwordExpiry: 90
        })
        break
      
      // Adicionar outros casos conforme necessário
    }
  }

  // Função para exportar configurações
  const exportSettings = async (category: string) => {
    setIsLoading(true)
    
    try {
      // Simular exportação
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      displayMessage('Configurações exportadas com sucesso!', 'success')
      
    } catch (error) {
      displayMessage('Erro na exportação', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  // Função para importar configurações
  const importSettings = async (category: string) => {
    setIsLoading(true)
    
    try {
      // Simular importação
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      displayMessage('Configurações importadas com sucesso!', 'success')
      
    } catch (error) {
      displayMessage('Erro na importação', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  // Função para testar configurações
  const testSettings = async (category: string) => {
    setIsProcessing(true)
    
    try {
      // Simular teste
      await new Promise(resolve => setTimeout(resolve, 2500))
      
      displayMessage('Teste realizado com sucesso!', 'success')
      
    } catch (error) {
      displayMessage('Erro no teste', 'error')
    } finally {
      setIsProcessing(false)
    }
  }

  // Efeito para aplicar tema inicial
  useEffect(() => {
    // Aplicar tema ao carregar
    document.documentElement.setAttribute('data-theme', appearanceSettings.theme)
    document.documentElement.style.setProperty('--primary-color', appearanceSettings.primaryColor)
    document.documentElement.style.setProperty('--secondary-color', appearanceSettings.secondaryColor)
    document.documentElement.style.setProperty('--accent-color', appearanceSettings.accentColor)
    
    // Forçar re-render de todos os componentes
    window.dispatchEvent(new CustomEvent('themeChange', { detail: appearanceSettings.theme }))
  }, [appearanceSettings.theme])

  const saveAllSettings = async () => {
    setIsProcessing(true);
    try {
      await Promise.all([
        saveSettings('appearance'),
        saveSettings('system'),
        saveSettings('security'),
        saveSettings('notifications'),
        saveSettings('performance'),
        saveSettings('backup'),
        saveSettings('integration'),
        saveSettings('users'),
        saveSettings('business')
      ]);
      displayMessage('Todas as configurações salvas com sucesso!', 'success');
    } catch (error) {
      displayMessage('Erro ao salvar todas as configurações', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const tabs = [
    { id: 'appearance', label: 'Aparência', icon: Palette },
    { id: 'system', label: 'Sistema', icon: Settings },
    { id: 'security', label: 'Segurança', icon: Shield },
    { id: 'notifications', label: 'Notificações', icon: Bell },
    { id: 'performance', label: 'Performance', icon: Zap },
    { id: 'backup', label: 'Backup', icon: Database },
    { id: 'integration', label: 'Integração', icon: Globe },
    { id: 'users', label: 'Usuários', icon: Users },
    { id: 'business', label: 'Negócio', icon: BarChart3 }
  ]

  return (
    <div className="space-y-6">
      {/* Mensagem de Sucesso/Erro */}
      {showMessage && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg transition-all duration-300 ${
          messageType === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          <div className="flex items-center space-x-2">
            {messageType === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span className="font-medium">{messageText}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">Configurações do Sistema</h1>
          <p className="text-secondary">Gerencie todas as configurações e preferências do sistema</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="btn-primary px-6 py-3 rounded-xl flex items-center space-x-3"
          >
            <Activity className="w-4 h-4" />
            <span>Ir para Dashboard</span>
          </button>
          <button
            onClick={saveAllSettings}
            disabled={isProcessing}
            className="btn-success px-6 py-3 rounded-xl flex items-center space-x-3"
          >
            <Save className="w-4 h-4" />
            <span>{isProcessing ? 'Salvando...' : 'Salvar Tudo'}</span>
          </button>
        </div>
      </div>

      {/* Navegação de Abas */}
      <div className="card-primary rounded-2xl">
        <div className="border-b border-adaptive">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'appearance', label: 'Aparência', icon: Palette },
              { id: 'system', label: 'Sistema', icon: Settings },
              { id: 'security', label: 'Segurança', icon: Shield },
              { id: 'notifications', label: 'Notificações', icon: Bell },
              { id: 'performance', label: 'Performance', icon: Zap },
              { id: 'backup', label: 'Backup', icon: Database },
              { id: 'integrations', label: 'Integrações', icon: Globe },
              { id: 'users', label: 'Usuários', icon: Users },
              { id: 'business', label: 'Negócios', icon: BarChart3 }
            ].map((tab) => {
              const IconComponent = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-secondary hover:text-primary'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Aparência */}
          {activeTab === 'appearance' && (
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="label-primary text-lg mb-4">Tema e Cores</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="label-primary mb-2">Tema do Sistema</label>
                      <div className="flex items-center space-x-2">
                        {[
                          { id: 'light', icon: Sun, label: 'Claro' },
                          { id: 'dark', icon: Moon, label: 'Escuro' },
                          { id: 'auto', icon: Monitor, label: 'Automático' }
                        ].map((theme) => {
                          const IconComponent = theme.icon
                          return (
                            <button
                              key={theme.id}
                              onClick={() => setAppearanceSettings(prev => ({ ...prev, theme: theme.id }))}
                              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                                appearanceSettings.theme === theme.id
                                  ? 'btn-primary'
                                  : 'btn-ghost'
                              }`}
                            >
                              <IconComponent className="w-4 h-4" />
                              <span>{theme.label}</span>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                    
                    <div>
                      <label className="label-primary mb-2">Cor Primária</label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={appearanceSettings.primaryColor}
                          onChange={(e) => setAppearanceSettings(prev => ({ ...prev, primaryColor: e.target.value }))}
                          className="w-12 h-12 rounded-lg border-2 border-adaptive cursor-pointer"
                        />
                        <input
                          type="text"
                          value={appearanceSettings.primaryColor}
                          onChange={(e) => setAppearanceSettings(prev => ({ ...prev, primaryColor: e.target.value }))}
                          className="input-primary flex-1 px-3 py-2 rounded-lg"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="label-primary mb-2">Cor Secundária</label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={appearanceSettings.secondaryColor}
                          onChange={(e) => setAppearanceSettings(prev => ({ ...prev, secondaryColor: e.target.value }))}
                          className="w-12 h-12 rounded-lg border-2 border-adaptive cursor-pointer"
                        />
                        <input
                          type="text"
                          value={appearanceSettings.secondaryColor}
                          onChange={(e) => setAppearanceSettings(prev => ({ ...prev, secondaryColor: e.target.value }))}
                          className="input-primary flex-1 px-3 py-2 rounded-lg"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="label-primary mb-2">Cor de Destaque</label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={appearanceSettings.accentColor}
                          onChange={(e) => setAppearanceSettings(prev => ({ ...prev, accentColor: e.target.value }))}
                          className="w-12 h-12 rounded-lg border-2 border-adaptive cursor-pointer"
                        />
                        <input
                          type="text"
                          value={appearanceSettings.accentColor}
                          onChange={(e) => setAppearanceSettings(prev => ({ ...prev, accentColor: e.target.value }))}
                          className="input-primary flex-1 px-3 py-2 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="label-primary text-lg mb-4">Tipografia e Layout</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="label-primary mb-2">Tamanho da Fonte</label>
                      <select
                        value={appearanceSettings.fontSize}
                        onChange={(e) => setAppearanceSettings(prev => ({ ...prev, fontSize: e.target.value }))}
                        className="input-primary w-full px-3 py-2 rounded-lg"
                      >
                        <option value="small">Pequeno</option>
                        <option value="medium">Médio</option>
                        <option value="large">Grande</option>
                        <option value="extra-large">Extra Grande</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="label-primary mb-2">Família da Fonte</label>
                      <select
                        value={appearanceSettings.fontFamily}
                        onChange={(e) => setAppearanceSettings(prev => ({ ...prev, fontFamily: e.target.value }))}
                        className="input-primary w-full px-3 py-2 rounded-lg"
                      >
                        <option value="Inter">Inter</option>
                        <option value="Roboto">Roboto</option>
                        <option value="Open Sans">Open Sans</option>
                        <option value="Montserrat">Montserrat</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="label-primary mb-2">Raio das Bordas</label>
                      <select
                        value={appearanceSettings.borderRadius}
                        onChange={(e) => setAppearanceSettings(prev => ({ ...prev, borderRadius: e.target.value }))}
                        className="input-primary w-full px-3 py-2 rounded-lg"
                      >
                        <option value="none">Sem bordas</option>
                        <option value="small">Pequeno</option>
                        <option value="medium">Médio</option>
                        <option value="large">Grande</option>
                        <option value="full">Completo</option>
                      </select>
                    </div>
                    
                    <div className="space-y-3">
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={appearanceSettings.shadows}
                          onChange={(e) => setAppearanceSettings(prev => ({ ...prev, shadows: e.target.checked }))}
                          className="w-4 h-4 text-blue-600 border-adaptive rounded focus:ring-blue-500"
                        />
                        <span className="text-secondary">Ativar sombras</span>
                      </label>
                      
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={appearanceSettings.animations}
                          onChange={(e) => setAppearanceSettings(prev => ({ ...prev, animations: e.target.checked }))}
                          className="w-4 h-4 text-blue-600 border-adaptive rounded focus:ring-blue-500"
                        />
                        <span className="text-secondary">Ativar animações</span>
                      </label>
                      
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={appearanceSettings.compactMode}
                          onChange={(e) => setAppearanceSettings(prev => ({ ...prev, compactMode: e.target.checked }))}
                          className="w-4 h-4 text-blue-600 border-adaptive rounded focus:ring-blue-500"
                        />
                        <span className="text-secondary">Modo compacto</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-adaptive">
                <button
                  onClick={() => resetSettings('appearance')}
                  disabled={isProcessing}
                  className="btn-ghost px-6 py-3 font-medium"
                >
                  Resetar
                </button>
                <button
                  onClick={() => saveSettings('appearance')}
                  disabled={isProcessing}
                  className="btn-primary px-6 py-3 rounded-xl font-bold"
                >
                  {isProcessing ? 'Salvando...' : 'Salvar Aparência'}
                </button>
              </div>
            </div>
          )}

          {/* Sistema */}
          {activeTab === 'system' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Localização</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Idioma</label>
                      <select
                        value={systemSettings.language}
                        onChange={(e) => setSystemSettings(prev => ({ ...prev, language: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      >
                        <option value="pt-BR">Português (Brasil)</option>
                        <option value="en-US">English (US)</option>
                        <option value="es-ES">Español</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Fuso Horário</label>
                      <select
                        value={systemSettings.timezone}
                        onChange={(e) => setSystemSettings(prev => ({ ...prev, timezone: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      >
                        <option value="America/Sao_Paulo">São Paulo (GMT-3)</option>
                        <option value="America/New_York">New York (GMT-5)</option>
                        <option value="Europe/London">London (GMT+0)</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Formato de Data</label>
                      <select
                        value={systemSettings.dateFormat}
                        onChange={(e) => setSystemSettings(prev => ({ ...prev, dateFormat: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      >
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Comportamento</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Salvamento Automático</label>
                      <div className="flex items-center space-x-4">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={systemSettings.autoSave}
                            onChange={(e) => setSystemSettings(prev => ({ ...prev, autoSave: e.target.checked }))}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">Ativar</span>
                        </label>
                        
                        {systemSettings.autoSave && (
                          <select
                            value={systemSettings.autoSaveInterval}
                            onChange={(e) => setSystemSettings(prev => ({ ...prev, autoSaveInterval: Number(e.target.value) }))}
                            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          >
                            <option value={1}>1 minuto</option>
                            <option value={5}>5 minutos</option>
                            <option value={10}>10 minutos</option>
                          </select>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Timeout de Sessão (minutos)</label>
                      <input
                        type="number"
                        value={systemSettings.sessionTimeout}
                        onChange={(e) => setSystemSettings(prev => ({ ...prev, sessionTimeout: Number(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        min="5"
                        max="480"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => resetSettings('system')}
                  disabled={isProcessing}
                  className="px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors duration-200 font-medium"
                >
                  Resetar
                </button>
                <button
                  onClick={() => saveSettings('system')}
                  disabled={isProcessing}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-200 font-bold"
                >
                  {isProcessing ? 'Salvando...' : 'Salvar Sistema'}
                </button>
              </div>
            </div>
          )}

          {/* Segurança */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Autenticação</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">Autenticação de Dois Fatores</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Adicione uma camada extra de segurança</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={securitySettings.twoFactorAuth}
                          onChange={(e) => setSecuritySettings(prev => ({ ...prev, twoFactorAuth: e.target.checked }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">Autenticação Biométrica</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Use impressão digital ou Face ID</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={securitySettings.biometricAuth}
                          onChange={(e) => setSecuritySettings(prev => ({ ...prev, biometricAuth: e.target.checked }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Políticas de Senha</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Complexidade da Senha</label>
                      <select
                        value={securitySettings.passwordComplexity}
                        onChange={(e) => setSecuritySettings(prev => ({ ...prev, passwordComplexity: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      >
                        <option value="weak">Fraca</option>
                        <option value="medium">Média</option>
                        <option value="strong">Forte</option>
                        <option value="very-strong">Muito Forte</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Expiração de Senha (dias)</label>
                      <input
                        type="number"
                        value={90}
                        onChange={(e) => console.log('Password expiry:', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        min="30"
                        max="365"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => resetSettings('security')}
                  disabled={isProcessing}
                  className="px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors duration-200 font-medium"
                >
                  Resetar
                </button>
                <button
                  onClick={() => saveSettings('security')}
                  disabled={isProcessing}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-200 font-bold"
                >
                  {isProcessing ? 'Salvando...' : 'Salvar Segurança'}
                </button>
              </div>
            </div>
          )}

          {/* Notificações */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="label-primary text-lg mb-4">Canais de Notificação</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-adaptive rounded-lg">
                      <div>
                        <h4 className="label-primary">Notificações por Email</h4>
                        <p className="text-secondary">Receba alertas importantes por email</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings.emailNotifications}
                          onChange={(e) => setNotificationSettings(prev => ({ ...prev, emailNotifications: e.target.checked }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-adaptive rounded-lg">
                      <div>
                        <h4 className="label-primary">Notificações Push</h4>
                        <p className="text-secondary">Alertas em tempo real no navegador</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings.pushNotifications}
                          onChange={(e) => setNotificationSettings(prev => ({ ...prev, pushNotifications: e.target.checked }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-adaptive rounded-lg">
                      <div>
                        <h4 className="label-primary">Notificações WhatsApp</h4>
                        <p className="text-secondary">Receba mensagens no WhatsApp</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings.whatsappNotifications}
                          onChange={(e) => setNotificationSettings(prev => ({ ...prev, whatsappNotifications: e.target.checked }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="label-primary text-lg mb-4">Tipos de Notificação</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-adaptive rounded-lg">
                      <div>
                        <h4 className="label-primary">Atualizações de Pedidos</h4>
                        <p className="text-secondary">Status de pedidos e entregas</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings.orderUpdates}
                          onChange={(e) => setNotificationSettings(prev => ({ ...prev, orderUpdates: e.target.checked }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-adaptive rounded-lg">
                      <div>
                        <h4 className="label-primary">Alertas do Sistema</h4>
                        <p className="text-secondary">Problemas e manutenções</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings.systemAlerts}
                          onChange={(e) => setNotificationSettings(prev => ({ ...prev, systemAlerts: e.target.checked }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-adaptive">
                <button
                  onClick={() => resetSettings('notifications')}
                  disabled={isProcessing}
                  className="btn-ghost px-6 py-3 font-medium"
                >
                  Resetar
                </button>
                <button
                  onClick={() => saveSettings('notifications')}
                  disabled={isProcessing}
                  className="btn-primary px-6 py-3 rounded-xl font-bold"
                >
                  {isProcessing ? 'Salvando...' : 'Salvar Notificações'}
                </button>
              </div>
            </div>
          )}

          {/* Outras abas podem ser implementadas aqui */}
          {activeTab !== 'appearance' && activeTab !== 'system' && activeTab !== 'security' && activeTab !== 'notifications' && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-adaptive rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="w-8 h-8 text-muted" />
              </div>
              <h3 className="label-primary text-lg mb-2">Configurações em Desenvolvimento</h3>
              <p className="text-secondary">Esta seção será implementada em breve com funcionalidades avançadas.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

'use client'

/**
 * ConfigManager - Gerenciador de Configurações do Sistema
 * Aplica configurações salvas no banco de dados ao sistema em tempo real
 */

interface ConfigManager {
  applyFontSize: (size: string) => void
  applyShadows: (enabled: boolean) => void
  applyAnimations: (enabled: boolean) => void
  applyCompactMode: (enabled: boolean) => void
  applyBorderRadius: (size: string) => void
  applyPrimaryColor: (color: string) => void
  applySecondaryColor: (color: string) => void
}

const applyToDocument = (property: string, value: string) => {
  if (typeof document !== 'undefined') {
    document.documentElement.style.setProperty(property, value)
  }
}

export const configManager: ConfigManager = {
  applyFontSize: (size: string) => {
    const fontSizeMap: Record<string, string> = {
      'small': '14px',
      'medium': '16px',
      'large': '18px'
    }
    applyToDocument('--font-size-base', fontSizeMap[size] || '16px')
  },

  applyShadows: (enabled: boolean) => {
    applyToDocument('--shadows-enabled', enabled ? '1' : '0')
    if (typeof document !== 'undefined') {
      document.body.classList.toggle('no-shadows', !enabled)
    }
  },

  applyAnimations: (enabled: boolean) => {
    applyToDocument('--animations-enabled', enabled ? '1' : '0')
    if (typeof document !== 'undefined') {
      document.body.classList.toggle('no-animations', !enabled)
    }
  },

  applyCompactMode: (enabled: boolean) => {
    if (typeof document !== 'undefined') {
      document.body.classList.toggle('compact-mode', enabled)
    }
  },

  applyBorderRadius: (size: string) => {
    const radiusMap: Record<string, string> = {
      'none': '0',
      'small': '4px',
      'medium': '8px',
      'large': '12px'
    }
    applyToDocument('--border-radius-base', radiusMap[size] || '8px')
  },

  applyPrimaryColor: (color: string) => {
    applyToDocument('--primary-color', color)
  },

  applySecondaryColor: (color: string) => {
    applyToDocument('--secondary-color', color)
  }
}

// Aplicar configurações automaticamente (APENAS NO DASHBOARD)
export const applyConfigToSystem = (configs: Map<string, any>) => {
  if (typeof window === 'undefined') return
  
  // ✅ CORREÇÃO CRÍTICA: Aplicar configurações APENAS na área do dashboard
  // Não afetar landing pages, páginas públicas, ou área de autenticação
  const isDashboard = window.location.pathname.startsWith('/dashboard')
  const isAuth = window.location.pathname.startsWith('/login') || window.location.pathname.startsWith('/register')
  const isLanding = window.location.pathname === '/' || window.location.pathname.startsWith('/barbearias') || window.location.pathname.startsWith('/petshops') || window.location.pathname.startsWith('/saude') || window.location.pathname.startsWith('/igrejas') || window.location.pathname.startsWith('/educacao') || window.location.pathname.startsWith('/servicos') || window.location.pathname.startsWith('/taste')
  
  // Se não estiver no dashboard, não aplicar configurações
  if (!isDashboard || isAuth || isLanding) {
    if (process.env.NODE_ENV === 'development') {
      console.log('🚫 Configurações não aplicadas fora do dashboard:', { isDashboard, isAuth, isLanding })
    }
    return
  }

  // Aparência
  const fontSize = configs.get('appearance.font_size')
  if (fontSize) configManager.applyFontSize(fontSize)

  const shadows = configs.get('appearance.shadows')
  if (shadows) configManager.applyShadows(shadows === 'true')

  const animations = configs.get('appearance.animations')
  if (animations) configManager.applyAnimations(animations === 'true')

  const compactMode = configs.get('appearance.compact_mode')
  if (compactMode) configManager.applyCompactMode(compactMode === 'true')

  const borderRadius = configs.get('appearance.border_radius')
  if (borderRadius) configManager.applyBorderRadius(borderRadius)

  const primaryColor = configs.get('appearance.primary_color')
  if (primaryColor) configManager.applyPrimaryColor(primaryColor)

  const secondaryColor = configs.get('appearance.secondary_color')
  if (secondaryColor) configManager.applySecondaryColor(secondaryColor)
}


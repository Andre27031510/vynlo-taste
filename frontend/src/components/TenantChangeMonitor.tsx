'use client'
/**
 * TenantChangeMonitor - Componente para monitorar mudanças de tenant
 * 
 * Detecta quando o usuário faz login/logout ou troca de conta
 * e automaticamente invalida o cache para prevenir vazamento de dados
 * 
 * Deve ser montado no layout principal para funcionar globalmente
 * 
 * Created: 2025-10-18 (Multi-tenant cache isolation)
 */

import { useTenantChange } from '@/hooks/useTenantChange'

export default function TenantChangeMonitor() {
  // Hook que detecta mudanças de tenant e limpa cache automaticamente
  useTenantChange()
  
  // Este componente não renderiza nada, apenas executa o hook
  return null
}


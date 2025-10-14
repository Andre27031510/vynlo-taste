// Utilitários de formatação seguros para produção (3M+ usuários)
// v2.1.2 - Previne TypeError: Cannot read 'toLocaleString' of undefined

/**
 * Formata número com fallback seguro
 * @param value - Valor a ser formatado (pode ser number | string | null | undefined)
 * @param locale - Localização (default: 'pt-BR')
 * @param options - Opções do Intl.NumberFormat
 * @returns String formatada ou "0" se valor inválido
 */
export function formatNumber(
  value: unknown, 
  locale = 'pt-BR',
  options?: Intl.NumberFormatOptions
): string {
  const n = typeof value === 'number' ? value : Number(value ?? 0)
  const safeValue = Number.isFinite(n) ? n : 0
  return new Intl.NumberFormat(locale, options).format(safeValue)
}

/**
 * Formata moeda com fallback seguro
 * @param value - Valor monetário
 * @param locale - Localização (default: 'pt-BR')
 * @param currency - Moeda (default: 'BRL')
 * @returns String formatada como moeda ou "R$ 0,00" se inválido
 */
export function formatCurrency(
  value: unknown,
  locale = 'pt-BR',
  currency = 'BRL'
): string {
  const n = typeof value === 'number' ? value : Number(value ?? 0)
  const safeValue = Number.isFinite(n) ? n : 0
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(safeValue)
}

/**
 * Formata data/hora com fallback seguro
 * @param value - Data (Date | string | number | null | undefined)
 * @param locale - Localização (default: 'pt-BR')
 * @param options - Opções do Intl.DateTimeFormat
 * @returns String formatada ou "—" se inválido
 */
export function formatDateTime(
  value: unknown,
  locale = 'pt-BR',
  options: Intl.DateTimeFormatOptions = { dateStyle: 'short', timeStyle: 'short' }
): string {
  if (!value) return '—'
  
  const d = new Date(String(value))
  
  if (!Number.isFinite(d.getTime())) return '—'
  
  return new Intl.DateTimeFormat(locale, options).format(d)
}

/**
 * Formata apenas data (sem hora)
 * @param value - Data
 * @param locale - Localização (default: 'pt-BR')
 * @returns String formatada ou "—" se inválido
 */
export function formatDate(
  value: unknown,
  locale = 'pt-BR'
): string {
  return formatDateTime(value, locale, { dateStyle: 'short' })
}

/**
 * Formata apenas hora (sem data)
 * @param value - Data/hora
 * @param locale - Localização (default: 'pt-BR')
 * @returns String formatada ou "—" se inválido
 */
export function formatTime(
  value: unknown,
  locale = 'pt-BR'
): string {
  return formatDateTime(value, locale, { timeStyle: 'short' })
}

// Modified: 2025-10-14 - Safe formatting utils for production


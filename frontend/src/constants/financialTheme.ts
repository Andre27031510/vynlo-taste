export const FINANCIAL_COLORS: {
  card: Record<'light' | 'dark', string>
  text: {
    primary: Record<'light' | 'dark', string>
    secondary: Record<'light' | 'dark', string>
  }
  status: {
    income: Record<'light' | 'dark', string>
    expense: Record<'light' | 'dark', string>
    pending: Record<'light' | 'dark', string>
    approved: Record<'light' | 'dark', string>
  }
} = {
  card: {
    light: 'bg-white border-gray-200',
    dark: 'bg-gray-800 border-gray-700'
  },
  text: {
    primary: { light: 'text-gray-900', dark: 'text-white' },
    secondary: { light: 'text-gray-600', dark: 'text-gray-400' }
  },
  status: {
    income: { light: 'bg-green-50 text-green-700', dark: 'bg-green-900 text-green-300' },
    expense: { light: 'bg-red-50 text-red-700', dark: 'bg-red-900 text-red-300' },
    pending: { light: 'bg-yellow-50 text-yellow-700', dark: 'bg-yellow-900 text-yellow-300' },
    approved: { light: 'bg-blue-50 text-blue-700', dark: 'bg-blue-900 text-blue-300' }
  }
}

// Modified: 2025-10-11-v7 | Record types for theme safety
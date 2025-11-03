/** @type {import('next').NextConfig} */
// touch: redeploy note (commit 112b089, d96f8ca, ce2d2e6, 0cc13bc, e32a9a9) - comentário leve sem impacto funcional

// CSP condicional: desenvolvimento vs produção
const isDevelopment = process.env.NODE_ENV === 'development'

const getConnectSrc = () => {
  const baseConnectSrc = [
    "'self'",
    "https://api.vynlotech.com",
    "https://identitytoolkit.googleapis.com",
    "https://securetoken.googleapis.com",
    "https://www.googleapis.com",
    "https://firebase.googleapis.com",
    "https://firestore.googleapis.com",
    "https://*.firebaseapp.com",
    "wss:",
    "ws:"
  ]
  
  // Adicionar localhost APENAS em desenvolvimento
  if (isDevelopment) {
    baseConnectSrc.push(
      "http://localhost:3000",
      "http://localhost:3001",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:3001"
    )
  }
  
  return baseConnectSrc.join(' ')
}

// PADRÃO BIG TECH: Validação fail-fast de variáveis de ambiente no build
// Padrão usado por: Netflix (validam env antes de build), Uber (fail-fast)
const validateBuildEnv = () => {
  // NEXT_PUBLIC_API_URL é crítico - deve estar definido
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  
  if (!apiUrl || apiUrl.trim() === '') {
    console.error('❌ ERRO CRÍTICO: NEXT_PUBLIC_API_URL não está definido')
    console.error('   Configure a variável NEXT_PUBLIC_API_URL antes do build')
    console.error('   Exemplo: NEXT_PUBLIC_API_URL=https://api.vynlotech.com')
    throw new Error('NEXT_PUBLIC_API_URL environment variable is required')
  }
  
  // Validar formato de URL
  try {
    const url = new URL(apiUrl)
    if (!['http:', 'https:'].includes(url.protocol)) {
      throw new Error('NEXT_PUBLIC_API_URL must use http:// or https://')
    }
    // Remover /api do final se presente (buildApiUrl adiciona)
    if (apiUrl.endsWith('/api') || apiUrl.endsWith('/api/')) {
      console.warn('⚠️ AVISO: NEXT_PUBLIC_API_URL termina com /api')
      console.warn('   Recomendado: remover /api (buildApiUrl adiciona automaticamente)')
      console.warn(`   Atual: ${apiUrl}`)
      console.warn(`   Esperado: ${apiUrl.replace(/\/api\/?$/, '')}`)
    }
  } catch (urlError) {
    console.error('❌ ERRO: NEXT_PUBLIC_API_URL não é uma URL válida:', apiUrl)
    throw new Error(`Invalid NEXT_PUBLIC_API_URL: ${urlError.message}`)
  }
  
  console.log('✅ Variáveis de ambiente validadas:', {
    NEXT_PUBLIC_API_URL: apiUrl.replace(/\/api\/?$/, '') // Mostrar sem /api
  })
}

// Executar validação apenas em build (não em dev para permitir fallbacks)
if (process.env.NODE_ENV === 'production' || process.env.VERCEL || process.env.DOCKER_BUILD) {
  validateBuildEnv()
}

const nextConfig = {
  // Fase 7: Configurar workspace root explicitamente para evitar warning de múltiplos lockfiles
  // Next.js detecta lockfiles para inferir workspace root - configurar explicitamente é boa prática
  outputFileTracingRoot: require('path').join(__dirname),
  // Build ID para forçar cache-busting (v2.1.1-fix-FORCE)
  generateBuildId: async () => {
    return `build-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  },
  // FORÇAR LIMPEZA DE CACHE
  distDir: '.next',
  cleanDistDir: true,
  // Source maps para produção (facilita debug de erros minificados como React #310)
  // Modified: 2025-10-14 16:48 UTC | Cursor recommendation verified ✓
  productionBrowserSourceMaps: true,
  images: {
    domains: ['localhost', 'api.vynlotech.com', 'cdn.vynlotech.com'],
  },
  // Configurações para evitar Quirks Mode
  trailingSlash: false,
  generateEtags: false,
  // Força HTML5 DOCTYPE
  experimental: {
    optimizeCss: false,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' https://www.gstatic.com https://www.googleapis.com https://cdn.vynlotech.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https: blob:",
              `connect-src ${getConnectSrc()}`,
              "frame-src 'self' https://*.firebaseapp.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'"
            ].join('; ')
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'geolocation=(), microphone=(), camera=()'
          }
        ],
      },
    ]
  },
}

module.exports = nextConfig
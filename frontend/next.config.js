/** @type {import('next').NextConfig} */
// touch: redeploy note (commit 112b089) - comentário leve sem impacto funcional

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
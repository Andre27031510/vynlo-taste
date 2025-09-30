/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    domains: ['localhost'],
  },
  // Configurações para evitar Quirks Mode
  trailingSlash: false,
  generateEtags: false,
  // Força HTML5 DOCTYPE
  experimental: {
    optimizeCss: true,
  },
}

module.exports = nextConfig
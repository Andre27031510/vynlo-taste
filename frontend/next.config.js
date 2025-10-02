/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  // Configurações para evitar Quirks Mode
  trailingSlash: false,
  generateEtags: false,
  // Força HTML5 DOCTYPE
  experimental: {
    optimizeCss: false,
  },
}

module.exports = nextConfig
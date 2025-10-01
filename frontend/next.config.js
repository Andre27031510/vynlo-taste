/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {

    unoptimized: true, // Necessário para static export
    domains: ['localhost'],
  },
  // Configurações para static export com nginx
  trailingSlash: false,
  generateEtags: false,
  // Desabilitar features que não funcionam com static export
  // Configurações específicas para nginx
  assetPrefix: '',
  basePath: '',
}

module.exports = nextConfig
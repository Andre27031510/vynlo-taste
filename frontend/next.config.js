/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    domains: ['localhost'],
  },
  // Force DOCTYPE for static export
  trailingSlash: false,
  generateEtags: false,
}

module.exports = nextConfig
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: { domains: ['localhost'] },
  serverExternalPackages: [],
}
module.exports = nextConfig
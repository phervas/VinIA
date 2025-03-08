/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/VinIA',
  assetPrefix: '/VinIA/'
}

module.exports = nextConfig 
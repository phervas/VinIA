/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; img-src 'self' blob: data:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; media-src 'self' blob:;"
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=self, microphone=self, geolocation=self'
          }
        ],
      },
    ]
  },
  output: 'export',
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig 
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
  basePath: process.env.NODE_ENV === 'production' ? '/VinIA' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/VinIA/' : '',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

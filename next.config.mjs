/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
  basePath: process.env.NODE_ENV === 'production' ? '/VinIA' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/VinIA/' : '',
  images: {
    unoptimized: true,
  },
  // Ensure CSS modules work with static export
  webpack: (config) => {
    config.module.rules.push({
      test: /\.css$/,
      use: ['style-loader', 'css-loader', 'postcss-loader'],
    });
    return config;
  },
};

export default nextConfig;

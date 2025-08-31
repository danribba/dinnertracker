/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true,
  },
  webpack: (config, { dev, isServer }) => {
    if (dev && isServer) {
      config.cache = false;
    }
    return config;
  },
  output: 'export',
  distDir: 'out_tmp',
  assetPrefix: '.',
  basePath: '',
  trailingSlash: true,
  optimizeFonts: false,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  experimental: {
    instrumentationHook: false
  }
};

module.exports = nextConfig;
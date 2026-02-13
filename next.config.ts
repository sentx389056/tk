import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    domains: ['github.com']
  },
  eslint: {
    // Временно отключаем ESLint при сборке
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer }) => {
    // Fix for pdfjs-dist - only apply fallbacks for client-side
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
      };
    }
    
    return config;
  },
};

export default nextConfig;

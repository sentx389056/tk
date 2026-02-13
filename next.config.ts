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
};

export default nextConfig;

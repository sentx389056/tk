import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    domains: ['github.com']
  }
};

export default nextConfig;

module.exports = {
  async redirects() {
    return [
      // {
      //   source: "/standards",
      //   destination: "/provisions",
      //   permanent: true,
      // },
    ];
  },
}

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['github.com']
  }
};

export default nextConfig;

module.exports = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/provisions",
        permanent: true,
      },
      {
        source: "/team",
        destination: "/provisions",
        permanent: true,
      },
      {
        source: "/login",
        destination: "/provisions",
        permanent: true,
      },
      {
        source: "/management",
        destination: "/provisions",
        permanent: true,
      },
      {
        source: "/meetings",
        destination: "/provisions",
        permanent: true,
      },
      {
        source: "/protocols",
        destination: "/provisions",
        permanent: true,
      },
      {
        source: "/reports",
        destination: "/provisions",
        permanent: true,
      },
      {
        source: "/securearea",
        destination: "/provisions",
        permanent: true,
      },
      {
        source: "/standards",
        destination: "/provisions",
        permanent: true,
      },
    ];
  },
}
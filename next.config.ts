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
        ];
    },
}
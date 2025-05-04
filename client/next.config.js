/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // serverActions is now available by default in Next.js 14
  },
  env: {
    NEXT_PUBLIC_GRAPHQL_HTTP_URL: 'http://localhost:5001/graphql',
    NEXT_PUBLIC_GRAPHQL_WS_URL: 'ws://localhost:5001/graphql',
  },
  images: {
    domains: ['images.unsplash.com'],
  },
};

module.exports = nextConfig;
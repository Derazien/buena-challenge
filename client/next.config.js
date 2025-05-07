/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // serverActions is now available by default in Next.js 14
  },
  env: {
    // Dynamically set API URLs based on environment
    NEXT_PUBLIC_GRAPHQL_HTTP_URL: process.env.NEXT_PUBLIC_GRAPHQL_HTTP_URL || (
      process.env.VERCEL_ENV === 'production' 
        ? 'https://buena-challenge.onrender.com/graphql'
        : 'http://localhost:5001/graphql'
    ),
    NEXT_PUBLIC_GRAPHQL_WS_URL: process.env.NEXT_PUBLIC_GRAPHQL_WS_URL || (
      process.env.VERCEL_ENV === 'production'
        ? 'wss://buena-challenge.onrender.com/graphql'
        : 'ws://localhost:5001/graphql'
    ),
  },
  images: {
    domains: ['images.unsplash.com'],
  },
};

module.exports = nextConfig;
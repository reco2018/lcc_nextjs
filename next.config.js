//const { createProxyMiddleware } = require(cookie-policy);

/** @type {import('next').NextConfig} */
const nextConfig = {
  //generateEtags: false,
  reactStrictMode: false,
  images: {
    unoptimized: true,
  },
  experimental: {
    esmExternals: false,
  },
}
module.exports = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  transpilePackages: ['@your-scope/lcc-lib'],
}


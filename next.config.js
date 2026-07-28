/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['pdf-parse', 'tesseract.js'],
  },
  webpack: (config) => {
    config.externals.push('pg-native');
    return config;
  },
};

module.exports = nextConfig;

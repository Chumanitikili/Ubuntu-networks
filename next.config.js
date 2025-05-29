/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
  env: {
    REDIS_URL: process.env.REDIS_URL,
    MINIO_ENDPOINT: process.env.MINIO_ENDPOINT,
    MINIO_PORT: process.env.MINIO_PORT,
    MINIO_ACCESS_KEY: process.env.MINIO_ACCESS_KEY,
    MINIO_SECRET_KEY: process.env.MINIO_SECRET_KEY,
    MINIO_BUCKET: process.env.MINIO_BUCKET,
    ELASTICSEARCH_URL: process.env.ELASTICSEARCH_URL,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
    TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER,
    OLLAMA_API_URL: process.env.OLLAMA_API_URL,
    QDRANT_URL: process.env.QDRANT_URL,
  },
  webpack: (config, { isServer }) => {
    // Handle undici module
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "undici": false,
      "fs": false,
      "path": false,
      "os": false,
    };

    // Handle https URLs
    config.module.rules.push({
      test: /\.(m?js|node)$/,
      parser: { amd: false },
      use: {
        loader: '@vercel/webpack-asset-relocator-loader',
        options: {
          outputAssetBase: 'assets',
          existingAssetBase: 'assets',
          wrapperCompatibility: true,
          production: true,
        },
      },
    });

    return config;
  },
}

module.exports = nextConfig 
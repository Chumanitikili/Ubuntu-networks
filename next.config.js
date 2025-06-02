/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
  transpilePackages: ['undici'],
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
    // Handle HTTPS URIs
    config.module.rules.push({
      test: /\.(js|mjs|jsx|ts|tsx)$/,
      include: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
        },
      },
    });

    // Add fallback for chromadb-default-embed
    config.resolve.fallback = {
      ...config.resolve.fallback,
      'chromadb-default-embed': false,
    };

    return config;
  },
  // Increase the build timeout
  experimental: {
    serverComponentsExternalPackages: ['chromadb'],
  },
}

module.exports = nextConfig 
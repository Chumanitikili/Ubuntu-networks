import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3000'),
  API_URL: z.string().url(),
  
  // Elasticsearch
  ELASTICSEARCH_URL: z.string().url(),
  ELASTICSEARCH_API_KEY: z.string(),
  
  // Qdrant
  QDRANT_URL: z.string().url(),
  QDRANT_API_KEY: z.string(),
  
  // Twilio
  TWILIO_ACCOUNT_SID: z.string(),
  TWILIO_AUTH_TOKEN: z.string(),
  
  // OpenAI
  OPENAI_API_KEY: z.string(),
  
  // Security
  JWT_SECRET: z.string().min(32),
  SESSION_SECRET: z.string().min(32),
  
  // Database
  DATABASE_URL: z.string().url(),
  
  // Logging
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  SENTRY_DSN: z.string().url().optional(),
});

export const env = envSchema.parse(process.env);

export const isDevelopment = env.NODE_ENV === 'development';
export const isProduction = env.NODE_ENV === 'production';
export const isTest = env.NODE_ENV === 'test'; 
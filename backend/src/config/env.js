const { z } = require('zod');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = z.object({
  NODE_ENV: z.enum(['production', 'development', 'test']).default('development'),
  PORT: z.coerce.number().default(5000),
  DATABASE_URL: z.string().url().describe('MySql database url'),
  REDIS_URL: z.string().url().describe('Redis connection url'),
  JWT_ACCESS_SECRET: z.string().describe('JWT access secret key'),
  JWT_REFRESH_SECRET: z.string().describe('JWT refresh secret key'),
  JWT_ACCESS_EXPIRY: z.string().default('15m').describe('minutes after which access tokens expire'),
  JWT_REFRESH_EXPIRY: z.string().default('7d').describe('days after which refresh tokens expire'),
  ANTHROPIC_API_KEY: z.string().optional().default('').describe('Anthropic (Claude) API Key — leave empty for mock mode'),
  AI_MODEL: z.string().default('claude-sonnet-4-20250514'),
  AI_MAX_RETRIES: z.coerce.number().default(3),
  SMTP_HOST: z.string().optional().default('').describe('server that will send the emails'),
  SMTP_PORT: z.coerce.number().optional().default(587).describe('port to connect to the email server'),
  SMTP_USER: z.string().optional().default('').describe('username for email server'),
  SMTP_PASS: z.string().optional().default('').describe('password for email server'),
  EMAIL_FROM: z.string().default('StudyAI <noreply@studyai.app>').describe('the from field in the emails sent by the app'),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  REDIS_TOKEN_PREFIX: z.string().default('studyai:')
});

const envVars = envVarsSchema.safeParse(process.env);

if (!envVars.success) {
  console.error('Config validation error:', envVars.error.format());
  throw new Error(`Config validation error: ${envVars.error.message}`);
}

module.exports = {
  env: envVars.data.NODE_ENV,
  port: envVars.data.PORT,
  database: {
    url: envVars.data.DATABASE_URL,
  },
  redis: {
    url: envVars.data.REDIS_URL,
    prefix: envVars.data.REDIS_TOKEN_PREFIX,
  },
  jwt: {
    accessSecret: envVars.data.JWT_ACCESS_SECRET,
    refreshSecret: envVars.data.JWT_REFRESH_SECRET,
    accessExpiration: envVars.data.JWT_ACCESS_EXPIRY,
    refreshExpiration: envVars.data.JWT_REFRESH_EXPIRY,
  },
  ai: {
    apiKey: envVars.data.ANTHROPIC_API_KEY,
    model: envVars.data.AI_MODEL,
    maxRetries: envVars.data.AI_MAX_RETRIES,
  },
  email: {
    smtp: {
      host: envVars.data.SMTP_HOST,
      port: envVars.data.SMTP_PORT,
      auth: {
        user: envVars.data.SMTP_USER,
        pass: envVars.data.SMTP_PASS,
      },
    },
    from: envVars.data.EMAIL_FROM,
  },
  frontendUrl: envVars.data.NEXT_PUBLIC_APP_URL,
};

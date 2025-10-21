import dotenv from 'dotenv';

dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  databaseUrl: string;
  stripePublishableKey: string;
  stripeSecretKey: string;
  redisUrl: string;
  sessionSecret: string;
}

const config: Config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || '',
  stripePublishableKey: process.env.STRIPED_PUBLISHABLE_KEY || '',
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || '',
  redisUrl : process.env.REDIS_URL || '',
  sessionSecret : process.env.SESSION_SECRET || 'default_secret',
};

export default config;
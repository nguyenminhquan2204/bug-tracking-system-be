import fs from 'fs';
import path from 'path';
import 'dotenv/config';
import z from 'zod';

/**
 * Check existing .env file
 */
if (!fs.existsSync(path.resolve('.env'))) {
  console.error('Không tìm thấy file .env');
  process.exit(1);
}

/**
 * JWT expires format type (compile-time)
 */
type TimeUnit = 's' | 'm' | 'h' | 'd';
export type JwtExpiresIn = `${number}${TimeUnit}`;

// const timeString = z.string().regex(/^\d+(s|m|h|d)$/, {
//   message: 'Must be a valid time format like 15m, 1h, 7d',
// });
/**
 * Runtime env validation schema
 */
const configSchema = z.object({
  PORT: z.string(),
  DATABASE_HOST: z.string(),
  DATABASE_PORT: z.string(),
  DATABASE_USERNAME: z.string(),
  DATABASE_PASSWORD: z.string(),
  DATABASE_NAME: z.string(),
  ACCESS_TOKEN_SECRET: z.string(),
  ACCESS_TOKEN_EXPIRES_IN: z.string(),
  REFRESH_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_EXPIRES_IN: z.string(),
  S3_BUCKET_NAME: z.string(),
  S3_REGION: z.string(),
  S3_ACCESS_KEY: z.string(),
  S3_SECRET_KEY: z.string(),
  S3_ENPOINT: z.string()
});

/**
 * Validate env at runtime
 */
const configServer = configSchema.safeParse(process.env);
if (!configServer.success) {
  console.log('Cac gia tri khai bao trong file .env khong hop le');
  console.error(configServer.error);
  process.exit(1);
}

/**
 * Export env with CORRECT TypeScript types
 */
const envConfig = configServer.data;

export default envConfig;

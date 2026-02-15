import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
    throw new Error(
        'DATABASE_URL is not defined. Please check your .env.local file or Vercel project settings.'
    );
}

export const sql = neon(process.env.DATABASE_URL);


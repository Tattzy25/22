import { createClient } from "@libsql/client";
import { config } from 'dotenv';
import { join } from 'path';

// Load environment variables from .env.local
config({ path: join(process.cwd(), '.env.local') });

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url) {
  throw new Error('TURSO_DATABASE_URL is required');
}

if (!authToken) {
  throw new Error('TURSO_AUTH_TOKEN is required');
}

export const turso = createClient({
  url,
  authToken,
});
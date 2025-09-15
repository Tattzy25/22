import { createClient } from '@libsql/client';
import { readFileSync } from 'fs';
import { join } from 'path';

function loadEnv() {
  const envPath = join(process.cwd(), '.env.local');
  const envContent = readFileSync(envPath, 'utf-8');
  const envLines = envContent.split('\n');
  for (const line of envLines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      const value = valueParts.join('=').replace(/^["']|["']$/g, '');
      process.env[key] = value;
    }
  }
}

async function clearDatabase() {
  loadEnv();
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  });

  try {
    await client.execute('DROP TABLE IF EXISTS models');
    console.log('✓ Database cleared - all models removed');
    
    // Verify it's empty
    try {
      const result = await client.execute('SELECT COUNT(*) as count FROM models');
      console.log('Models remaining:', result.rows[0]?.count);
    } catch (e) {
      console.log('✓ Confirmed: models table no longer exists');
    }
  } finally {
    await client.close();
  }
}

clearDatabase();
#!/usr/bin/env node

import { createClient } from '@libsql/client';
import { readFileSync } from 'fs';
import { join } from 'path';

// Load environment variables from .env.local
function loadEnv() {
  try {
    const envPath = join(process.cwd(), '.env.local');
    const envContent = readFileSync(envPath, 'utf-8');
    const envLines = envContent.split('\n');

    for (const line of envLines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        const value = valueParts.join('=').replace(/^["']|["']$/g, ''); // Remove quotes
        process.env[key] = value;
      }
    }
  } catch (error) {
    console.error('Failed to load .env.local file:', error);
    process.exit(1);
  }
}

async function runMigrations() {
  // Load environment variables
  loadEnv();

  const databaseUrl = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!databaseUrl || !authToken) {
    console.error('Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN environment variables');
    process.exit(1);
  }

  const client = createClient({
    url: databaseUrl,
    authToken: authToken,
  });

  try {
    console.log('Connecting to Turso database...');

    // Get list of migration files
    const migrationsDir = join(process.cwd(), 'migrations');
    const migrationFiles = [
      '001_create_models_table_sqlite.sql',
      '002_seed_models_data_sqlite.sql'
    ];

    for (const file of migrationFiles) {
      const filePath = join(migrationsDir, file);
      console.log(`Running migration: ${file}`);

      try {
        const sql = readFileSync(filePath, 'utf-8');

        // Execute the entire SQL file as one batch
        await client.execute(sql);

        console.log(`✓ Migration ${file} completed successfully`);
      } catch (error) {
        console.error(`✗ Migration ${file} failed:`, error);
        throw error;
      }
    }

    console.log('All migrations completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    // Close the client
    await client.close();
  }
}

runMigrations();
#!/usr/bin/env node

import { readFileSync } from 'fs';
import { join } from 'path';
import { config } from 'dotenv';

// Load environment variables from .env.local BEFORE importing turso
config({ path: join(process.cwd(), '.env.local') });

import { turso } from './lib/turso.js';

async function runMigration(filePath: string) {
  console.log(`Running migration: ${filePath}`);

  try {
    const sql = readFileSync(filePath, 'utf-8');

    // Split SQL more carefully, handling CREATE TRIGGER statements
    const statements = [];
    let currentStatement = '';
    let inTrigger = false;
    let parenDepth = 0;

    const lines = sql.split('\n');
    for (const line of lines) {
      const trimmedLine = line.trim();

      // Skip comments and empty lines
      if (trimmedLine.startsWith('--') || trimmedLine === '') {
        continue;
      }

      currentStatement += line + '\n';

      // Track parentheses for CREATE statements
      const openParens = (line.match(/\(/g) || []).length;
      const closeParens = (line.match(/\)/g) || []).length;
      parenDepth += openParens - closeParens;

      // Check for CREATE TRIGGER
      if (trimmedLine.toUpperCase().startsWith('CREATE TRIGGER')) {
        inTrigger = true;
      }

      // If we see END; and we're in a trigger, this might be the end
      if (inTrigger && trimmedLine.toUpperCase() === 'END;') {
        inTrigger = false;
      }

      // Check for statement end (semicolon) but not inside parentheses or triggers
      if (trimmedLine.endsWith(';') && parenDepth === 0 && !inTrigger) {
        statements.push(currentStatement.trim());
        currentStatement = '';
      }
    }

    // Add any remaining statement
    if (currentStatement.trim()) {
      statements.push(currentStatement.trim());
    }

    for (const statement of statements) {
      if (statement.trim()) {
        console.log(`Executing: ${statement.substring(0, 60).replace(/\n/g, ' ')}...`);
        await turso.execute(statement);
      }
    }

    console.log(`✅ Migration completed: ${filePath}`);
  } catch (error) {
    console.error(`❌ Migration failed: ${filePath}`, error);
    throw error;
  }
}

async function runAllMigrations() {
  const migrations = [
    'migrations/001_create_models_table_sqlite.sql',
    'migrations/003_seed_categorization_data.sql',
    'migrations/002_seed_models_data_sqlite_new.sql'
  ];

  console.log('🚀 Starting database migrations...\n');

  for (const migration of migrations) {
    const filePath = join(process.cwd(), migration);
    await runMigration(filePath);
    console.log('');
  }

  console.log('🎉 All migrations completed successfully!');
  process.exit(0);
}

runAllMigrations().catch((error) => {
  console.error('Migration failed:', error);
  process.exit(1);
});
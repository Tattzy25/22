import { config } from 'dotenv';
import { join } from 'path';

// Load environment variables from .env.local BEFORE importing turso
config({ path: join(process.cwd(), '.env.local') });

import { turso } from './lib/turso.js';

async function checkSchema() {
  try {
    console.log('Current models table schema:');
    const modelsResult = await turso.execute('PRAGMA table_info(models);');
    console.log(modelsResult.rows);

    console.log('\nCurrent model_providers table schema:');
    const providersResult = await turso.execute('PRAGMA table_info(model_providers);');
    console.log(providersResult.rows);
  } catch (error) {
    console.error('Error checking schema:', error);
  }
}

checkSchema();
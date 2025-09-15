#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';

function parseCSV(csvContent) {
  const lines = csvContent.split('\n').filter(line => line.trim());
  const headers = lines[0].split(',');

  return lines.slice(1).map(line => {
    const values = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current);

    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = values[index] || '';
    });
    return obj;
  });
}

function sanitizeTableName(provider) {
  return provider.toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
}

function generateProviderTables(models) {
  const providers = {};

  // Group models by provider
  models.forEach(model => {
    const provider = model['Provider'];
    if (!providers[provider]) {
      providers[provider] = [];
    }
    providers[provider].push(model);
  });

  let sql = '-- Provider-Specific Tables Migration\n';
  sql += '-- Large providers (4+ models): Separate tables\n';
  sql += '-- Small providers (1-3 models): One shared table\n';
  sql += '-- Eliminates foreign key constraints and improves query performance\n\n';

  // Define which providers get their own tables (4+ models)
  const largeProviders = Object.keys(providers).filter(provider => providers[provider].length >= 4);
  const smallProviders = Object.keys(providers).filter(provider => providers[provider].length <= 3);

  // Create separate tables for large providers
  largeProviders.sort().forEach(provider => {
    const tableName = sanitizeTableName(provider) + '_models';
    const modelCount = providers[provider].length;

    sql += '-- ' + provider + ' Models (' + modelCount + ' models) - Dedicated Table\n';
    sql += 'CREATE TABLE IF NOT EXISTS ' + tableName + ' (\n';
    sql += '  id TEXT PRIMARY KEY,\n';
    sql += '  name TEXT NOT NULL,\n';
    sql += '  display_name TEXT,\n';
    sql += '  category TEXT NOT NULL DEFAULT \'general\',\n';
    sql += '  description TEXT,\n';
    sql += '  context_window INTEGER DEFAULT 128000,\n';
    sql += '  response_time TEXT DEFAULT \'Standard\',\n';
    sql += '  cost_tier TEXT DEFAULT \'premium\',\n';
    sql += '  is_active BOOLEAN DEFAULT 1,\n';
    sql += '  sort_order INTEGER DEFAULT 0,\n';
    sql += '  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,\n';
    sql += '  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,\n';
    sql += '  provider_name TEXT NOT NULL,\n';
    sql += '  provider_model_id TEXT,\n';
    sql += '  api_endpoint TEXT DEFAULT \'https://gateway.ai.vercel.com/v1\',\n';
    sql += '  auth_type TEXT DEFAULT \'oidc\'\n';
    sql += ');\n\n';

    // Insert models for this provider
    providers[provider].forEach(model => {
      const id = model['Musarty ID'];
      const name = model['Model ID'];
      const displayName = model['Model Name'];
      const description = model['Provider'] + ' ' + model['Model Name'] + ' - AI model available through Vercel AI Gateway';
      const providerName = model['Provider'];
      const providerModelId = model['Model ID'];
      const apiEndpoint = model['API Endpoint URL'] || 'https://gateway.ai.vercel.com/v1';

      sql += 'INSERT OR IGNORE INTO ' + tableName + ' (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES (\'' + id + '\', \'' + name + '\', \'' + displayName.replace(/\'/g, "''") + '\', \'' + description.replace(/\'/g, "''") + '\', \'' + providerName + '\', \'' + providerModelId + '\', \'' + apiEndpoint + '\');\n';
    });

    sql += '\n';
  });

  // Create one shared table for small providers
  const smallModelCount = smallProviders.reduce((sum, provider) => sum + providers[provider].length, 0);
  sql += '-- Small Providers Models (' + smallModelCount + ' models from ' + smallProviders.length + ' providers) - Shared Table\n';
  sql += 'CREATE TABLE IF NOT EXISTS small_providers_models (\n';
  sql += '  id TEXT PRIMARY KEY,\n';
  sql += '  name TEXT NOT NULL,\n';
  sql += '  display_name TEXT,\n';
  sql += '  category TEXT NOT NULL DEFAULT \'general\',\n';
  sql += '  description TEXT,\n';
  sql += '  context_window INTEGER DEFAULT 128000,\n';
  sql += '  response_time TEXT DEFAULT \'Standard\',\n';
  sql += '  cost_tier TEXT DEFAULT \'premium\',\n';
  sql += '  is_active BOOLEAN DEFAULT 1,\n';
  sql += '  sort_order INTEGER DEFAULT 0,\n';
  sql += '  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,\n';
  sql += '  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,\n';
  sql += '  provider_name TEXT NOT NULL,\n';
  sql += '  provider_model_id TEXT,\n';
  sql += '  api_endpoint TEXT DEFAULT \'https://gateway.ai.vercel.com/v1\',\n';
  sql += '  auth_type TEXT DEFAULT \'oidc\'\n';
  sql += ');\n\n';

  // Insert all small provider models into the shared table
  smallProviders.sort().forEach(provider => {
    providers[provider].forEach(model => {
      const id = model['Musarty ID'];
      const name = model['Model ID'];
      const displayName = model['Model Name'];
      const description = model['Provider'] + ' ' + model['Model Name'] + ' - AI model available through Vercel AI Gateway';
      const providerName = model['Provider'];
      const providerModelId = model['Model ID'];
      const apiEndpoint = model['API Endpoint URL'] || 'https://gateway.ai.vercel.com/v1';

      sql += 'INSERT OR IGNORE INTO small_providers_models (id, name, display_name, description, provider_name, provider_model_id, api_endpoint) VALUES (\'' + id + '\', \'' + name + '\', \'' + displayName.replace(/\'/g, "''") + '\', \'' + description.replace(/\'/g, "''") + '\', \'' + providerName + '\', \'' + providerModelId + '\', \'' + apiEndpoint + '\');\n';
    });
  });

  sql += '\n';

  // Add capabilities (shared across all tables)
  sql += '-- Model Capabilities (shared across all provider tables)\n';
  models.forEach(model => {
    const modelId = model['Musarty ID'];
    for (let i = 1; i <= 4; i++) {
      const cap = model['Capabilities ' + i];
      if (cap && cap.trim()) {
        sql += 'INSERT OR IGNORE INTO model_capabilities (model_id, capability) VALUES (\'' + modelId + '\', \'' + cap.trim() + '\');\n';
      }
    }
  });

  return sql;
}

function main() {
  const csvContent = readFileSync('official-gateway-models.csv', 'utf-8');
  const models = parseCSV(csvContent);

  console.log('Found ' + models.length + ' models from ' + new Set(models.map(m => m['Provider'])).size + ' providers');

  const sql = generateProviderTables(models);

  const outputPath = 'migrations/sqlite/007_provider_specific_tables.sql';
  writeFileSync(outputPath, sql);

  console.log('Generated provider-specific tables migration saved to: ' + outputPath);
  console.log('This creates 10 tables: 9 dedicated + 1 shared for small providers.');
}

main();

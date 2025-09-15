#!/usr/bin/env node

import { readFileSync } from 'fs';
import { join } from 'path';

function parseCSV(csvContent) {
  const lines = csvContent.split('\n').filter(line => line.trim());
  const headers = lines[0].split(',');

  return lines.slice(1).map(line => {
    // Simple CSV parser that handles quoted fields
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
    values.push(current); // Add the last field

    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = values[index] || '';
    });
    return obj;
  });
}

function categorizeModel(model) {
  const categories = {
    costTier: '',
    speedDimension: '',
    contextSize: '',
    useCases: [],
    providerEcosystem: '',
    availabilityMode: '',
    activityStatus: '',
    apiPattern: '',
    emergingCategories: []
  };

  const modelName = model.model.toLowerCase();
  const provider = model.provider.toLowerCase();
  const description = model.description.toLowerCase();
  const inputPrice = parseFloat(model.input_per_m) || 0;
  const outputPrice = parseFloat(model.output_per_m) || 0;
  const contextTokens = parseInt(model.context_tokens) || 0;

  // Cost tier categorization
  const avgPrice = (inputPrice + outputPrice) / 2;
  if (avgPrice < 0.5) categories.costTier = 'low_cost';
  else if (avgPrice < 2.0) categories.costTier = 'mid_range';
  else categories.costTier = 'premium';

  // Speed dimension (based on model name patterns)
  if (modelName.includes('flash') || modelName.includes('lite') || modelName.includes('nano') || modelName.includes('instant')) {
    categories.speedDimension = 'instant';
  } else if (modelName.includes('fast') || modelName.includes('quick') || description.includes('fast')) {
    categories.speedDimension = 'fast';
  } else {
    categories.speedDimension = 'slow';
  }

  // Context size
  if (contextTokens < 32000) categories.contextSize = 'short';
  else if (contextTokens < 128000) categories.contextSize = 'medium';
  else categories.contextSize = 'long';

  // Use cases (can have multiple)
  if (description.includes('conversational') || description.includes('chat') || description.includes('dialogue')) {
    categories.useCases.push('conversational');
  }
  if (description.includes('research') || description.includes('analysis') || description.includes('reasoning')) {
    categories.useCases.push('research_analysis');
  }
  if (description.includes('coding') || description.includes('code') || description.includes('programming') || description.includes('development')) {
    categories.useCases.push('coding_development');
  }
  if (description.includes('creative') || description.includes('multimodal') || description.includes('art') || description.includes('image')) {
    categories.useCases.push('creative_multimodal');
  }
  // Default to conversational if no specific use case identified
  if (categories.useCases.length === 0) categories.useCases.push('conversational');

  // Provider ecosystem
  if (['google', 'microsoft', 'amazon', 'apple', 'meta'].includes(provider)) {
    categories.providerEcosystem = 'big_tech';
  } else if (['anthropic', 'openai', 'xai', 'cohere'].includes(provider)) {
    categories.providerEcosystem = 'innovators';
  } else if (['mistral', 'deepseek', 'alibaba', 'huggingface'].includes(provider)) {
    categories.providerEcosystem = 'open_source';
  } else {
    categories.providerEcosystem = 'specialists';
  }

  // Availability mode (online/offline)
  if (['meta', 'mistral', 'deepseek', 'alibaba', 'microsoft'].includes(provider) || description.includes('open.?source') || description.includes('local') || description.includes('download')) {
    categories.availabilityMode = 'offline_capable';
  } else {
    categories.availabilityMode = 'online_only';
  }

  // Activity status
  if (modelName.includes('stealth') || modelName.includes('alpha') || modelName.includes('experimental') || modelName.includes('deprecated') || modelName.includes('preview') ||
      description.includes('stealth') || description.includes('alpha') || description.includes('experimental') || description.includes('deprecated') || description.includes('preview') ||
      parseInt(model.available_providers) === 1) {
    categories.activityStatus = 'idle';
  } else {
    categories.activityStatus = 'active';
  }

  // API usage patterns (based on model characteristics)
  if (modelName.includes('nano') || modelName.includes('lite') || avgPrice < 0.1) {
    categories.apiPattern = 'hourly_users';
  } else if (modelName.includes('pro') || modelName.includes('opus') || avgPrice > 1.0) {
    categories.apiPattern = 'weekly_analysts';
  } else {
    categories.apiPattern = 'daily_workers';
  }

  // Emerging categories (can have multiple)
  if (description.includes('future') || description.includes('advanced') || description.includes('cutting.edge') || modelName.includes('5') || modelName.includes('4.1')) {
    categories.emergingCategories.push('future_proof');
  }
  if (description.includes('global') || description.includes('scale') || description.includes('worldwide') || provider === 'google' || provider === 'microsoft') {
    categories.emergingCategories.push('global_scale');
  }
  if (description.includes('enterprise') || description.includes('industrial') || description.includes('reliable') || description.includes('production')) {
    categories.emergingCategories.push('industrial_grade');
  }

  return categories;
}

function generateCategorizationAssignments(models) {
  const assignments = {
    costTier: [],
    speed: [],
    context: [],
    useCase: [],
    providerEcosystem: [],
    availability: [],
    activity: [],
    apiPattern: [],
    emergingCategory: []
  };

  models.forEach(model => {
    const modelId = `${model.provider}-${model.model}`.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    const categories = categorizeModel(model);

    // Cost tier assignment
    if (categories.costTier) {
      assignments.costTier.push(`('${modelId}', '${categories.costTier}')`);
    }

    // Speed dimension assignment
    if (categories.speedDimension) {
      assignments.speed.push(`('${modelId}', '${categories.speedDimension}')`);
    }

    // Context size assignment
    if (categories.contextSize) {
      assignments.context.push(`('${modelId}', '${categories.contextSize}')`);
    }

    // Use case assignments (multiple allowed)
    categories.useCases.forEach(useCase => {
      assignments.useCase.push(`('${modelId}', '${useCase}')`);
    });

    // Provider ecosystem assignment
    if (categories.providerEcosystem) {
      assignments.providerEcosystem.push(`('${modelId}', '${categories.providerEcosystem}')`);
    }

    // Availability mode assignment
    if (categories.availabilityMode) {
      assignments.availability.push(`('${modelId}', '${categories.availabilityMode}')`);
    }

    // Activity status assignment
    if (categories.activityStatus) {
      assignments.activity.push(`('${modelId}', '${categories.activityStatus}')`);
    }

    // API pattern assignment
    if (categories.apiPattern) {
      assignments.apiPattern.push(`('${modelId}', '${categories.apiPattern}')`);
    }

    // Emerging category assignments (multiple allowed)
    categories.emergingCategories.forEach(category => {
      assignments.emergingCategory.push(`('${modelId}', '${category}')`);
    });
  });

  return `-- ============================================================================
-- MODEL CATEGORIZATION ASSIGNMENTS
-- ============================================================================

-- Cost tier assignments
INSERT OR IGNORE INTO model_cost_tier_assignments (model_id, cost_tier_id) VALUES
${assignments.costTier.join(',\n')};\n\n-- Speed dimension assignments
INSERT OR IGNORE INTO model_speed_assignments (model_id, speed_dimension_id) VALUES
${assignments.speed.join(',\n')};\n\n-- Context size assignments
INSERT OR IGNORE INTO model_context_assignments (model_id, context_size_id) VALUES
${assignments.context.join(',\n')};\n\n-- Use case assignments
INSERT OR IGNORE INTO model_use_case_assignments (model_id, use_case_id) VALUES
${assignments.useCase.join(',\n')};\n\n-- Provider ecosystem assignments
INSERT OR IGNORE INTO model_provider_ecosystem_assignments (model_id, provider_ecosystem_id) VALUES
${assignments.providerEcosystem.join(',\n')};\n\n-- Availability mode assignments
INSERT OR IGNORE INTO model_availability_assignments (model_id, availability_mode_id) VALUES
${assignments.availability.join(',\n')};\n\n-- Activity status assignments
INSERT OR IGNORE INTO model_activity_assignments (model_id, activity_status_id) VALUES
${assignments.activity.join(',\n')};\n\n-- API usage pattern assignments
INSERT OR IGNORE INTO model_api_pattern_assignments (model_id, api_pattern_id) VALUES
${assignments.apiPattern.join(',\n')};\n\n-- Emerging category assignments
INSERT OR IGNORE INTO model_emerging_category_assignments (model_id, emerging_category_id) VALUES
${assignments.emergingCategory.join(',\n')};`;
}

function generateSeedData() {
  const csvPath = join(process.cwd(), 'official-gateway-models.csv');
  const csvContent = readFileSync(csvPath, 'utf-8');
  const models = parseCSV(csvContent);

  console.log(`Found ${models.length} models in CSV`);

  const modelInserts = models.map(model => {
    const id = model['Musarty ID'];
    const name = model['Model ID'];
    const displayName = model['Model Name'];
    const provider = model['Provider'];
    const contextStr = model['Context'];
    const contextWindow = contextStr.includes('K') ? parseInt(contextStr.replace('K', '')) * 1000 : (contextStr.includes('M') ? parseInt(contextStr.replace('M', '')) * 1000000 : parseInt(contextStr) || 0);
    const description = model['Description'];
    const templateId = model['Template ID'];

    // Determine category from provider
    let category = 'general';
    if (provider === 'OpenAI') category = 'gpt';
    else if (provider === 'Anthropic') category = 'claude';
    else if (provider.includes('Google')) category = 'gemini';
    else if (provider === 'xAI') category = 'grok';
    else if (provider === 'Meta') category = 'llama';

    // Determine cost tier
    let costTier = 'premium';
    if (description.toLowerCase().includes('cheap') || description.toLowerCase().includes('cost') || displayName.toLowerCase().includes('nano') || displayName.toLowerCase().includes('lite')) {
      costTier = 'low_cost';
    } else if (description.toLowerCase().includes('balanced') || displayName.toLowerCase().includes('mini')) {
      costTier = 'mid_range';
    }

    // Response time
    let responseTime = 'Standard';
    if (model['Capabilities 1'].toLowerCase().includes('fast') || model['Capabilities 2'].toLowerCase().includes('fast') || description.toLowerCase().includes('fast') || displayName.toLowerCase().includes('flash')) {
      responseTime = 'Fast';
    } else if (displayName.toLowerCase().includes('instant')) {
      responseTime = 'Instant';
    }

    return `INSERT OR IGNORE INTO models (id, name, display_name, category, description, context_window, response_time, cost_tier, is_active, sort_order) VALUES ('${id}', '${name}', '${displayName}', '${category}', '${description.replace(/'/g, "''")}', ${contextWindow}, '${responseTime}', '${costTier}', 1, 0);`;
  });

  const providerInserts = models.map(model => {
    const modelId = model['Musarty ID'];
    const providerName = model['Provider'];
    const providerModelId = model['Model ID'];
    const apiEndpoint = model['API Endpoint URL'];

    return `INSERT OR IGNORE INTO model_providers (model_id, provider_name, provider_model_id, api_endpoint, auth_type, priority, is_active) VALUES ('${modelId}', '${providerName}', '${providerModelId}', '${apiEndpoint}', 'oidc', 1, 1);`;
  });

  const capabilityInserts = [];
  models.forEach(model => {
    const modelId = model['Musarty ID'];
    for (let i = 1; i <= 4; i++) {
      const cap = model[`Capabilities ${i}`];
      if (cap && cap.trim()) {
        capabilityInserts.push(`INSERT OR IGNORE INTO model_capabilities (model_id, capability) VALUES ('${modelId}', '${cap.trim()}');`);
      }
    }
  });

  const output = `-- Import AI Gateway models from CSV
-- Generated from official-gateway-models.csv

${modelInserts.join('\n')}

${providerInserts.join('\n')}

${capabilityInserts.join('\n')}
`;

  console.log('\nGenerated import data for', models.length, 'models');
  return output;
}

// Generate and save the seed data
const seedData = generateSeedData();
const outputPath = join(process.cwd(), 'migrations', 'sqlite', '006_import_gateway_models.sql');

import { writeFileSync } from 'fs';
writeFileSync(outputPath, seedData);

console.log(`\nSeed data saved to: ${outputPath}`);
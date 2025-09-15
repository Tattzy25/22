const fs = require('fs');
const path = require('path');

// Read the official models list
const officialModelsPath = path.join(__dirname, 'official-models.txt');
const officialModels = new Set(
  fs.readFileSync(officialModelsPath, 'utf8')
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
);

// Read the filtered CSV
const csvPath = path.join(__dirname, 'official-gateway-models.csv');
const csvContent = fs.readFileSync(csvPath, 'utf8');
const lines = csvContent.split('\n');
const header = lines[0];

// Get existing model IDs from CSV
const existingModels = new Set();
for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;
  const columns = line.split(',');
  const modelId = columns[2]?.trim();
  if (modelId) existingModels.add(modelId);
}

// Find missing models
const missingModels = [...officialModels].filter(model => !existingModels.has(model));

console.log('Missing models that need to be added:');
missingModels.forEach(model => console.log(model));

if (missingModels.length === 0) {
  console.log('All models are already present!');
  return;
}

// For now, let's create basic entries for missing models
// We'll use the model ID to derive provider and basic info
const missingEntries = missingModels.map(modelId => {
  const [provider, modelName] = modelId.split('/');
  const displayName = modelName.split('-').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  let providerName = provider;
  if (provider === 'anthropic') providerName = 'Anthropic';
  else if (provider === 'google') providerName = 'Google DeepMind';
  else if (provider === 'openai') providerName = 'OpenAI';

  // Basic capabilities based on model type
  let capabilities = 'General, AI, Assistant';
  let cap1 = 'General', cap2 = 'AI', cap3 = 'Assistant', cap4 = '';

  if (modelName.includes('embedding')) {
    capabilities = 'Embeddings, Search, Semantic';
    cap1 = 'Embeddings'; cap2 = 'Search'; cap3 = 'Semantic';
  } else if (modelName.includes('gpt-5') || modelName.includes('o1') || modelName.includes('o3') || modelName.includes('o4')) {
    capabilities = 'Reasoning, Advanced, Coding';
    cap1 = 'Reasoning'; cap2 = 'Advanced'; cap3 = 'Coding';
  } else if (modelName.includes('claude')) {
    capabilities = 'Reasoning, Coding, Fast';
    cap1 = 'Reasoning'; cap2 = 'Coding'; cap3 = 'Fast';
  } else if (modelName.includes('gemini')) {
    capabilities = 'Multimodal, Fast, Tools';
    cap1 = 'Multimodal'; cap2 = 'Fast'; cap3 = 'Tools';
  }

  const description = `${providerName} ${displayName} - AI model available through Vercel AI Gateway`;

  // Create CSV line
  const columns = [
    '', // Musarty DB ID
    'AI Gateway', // API
    modelId, // Model ID
    displayName, // Model Name
    providerName, // Provider
    '128K', // Context (default)
    '', // Tags
    '', // Categories
    capabilities, // Key Capabilities
    cap1, // Capabilities 1
    cap2, // Capabilities 2
    cap3, // Capabilities 3
    cap4, // Capabilities 4
    description, // Description
    '', // Logo Image url
    '', // Online
    '', // Idle
    '', // Offline
    '', // UI Template ID
    '', // Use Case
    modelId, // Musarty ID
    modelId, // Template ID
    'https://gateway.ai.vercel.com/v1' // API Endpoint URL
  ];

  return columns.map(col => `"${col}"`).join(',');
});

// Add missing entries to CSV
const updatedCsv = [header, ...lines.slice(1), ...missingEntries].join('\n');
fs.writeFileSync(csvPath, updatedCsv);

console.log(`\nAdded ${missingModels.length} missing models to CSV`);
console.log(`Total models in CSV: ${lines.length - 1 + missingModels.length}`);
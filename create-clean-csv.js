import fs from 'fs';
import path from 'path';

// Read the official models list
const officialModelsPath = path.join(__dirname, 'official-models.txt');
const officialModels = fs.readFileSync(officialModelsPath, 'utf8')
  .split('\n')
  .map(line => line.trim())
  .filter(line => line.length > 0);

console.log(`Creating clean CSV with ${officialModels.length} official models`);

// CSV Header
const header = 'Musarty DB ID,API,Model ID,Model Name,Provider,Context,Tags,Categories,Key Capabilities,Capabilities 1,Capabilities 2,Capabilities 3,Capabilities 4,Description,Logo Image url,Online,Idle,Ofline,UI Template ID,Use Case,Musarty ID,Template ID,API Endpoint URL';

// Create entries for each official model
const entries = officialModels.map(modelId => {
  const [provider, modelName] = modelId.split('/');
  const displayName = modelName.split('-').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  let providerName = provider;
  if (provider === 'anthropic') providerName = 'Anthropic';
  else if (provider === 'google') providerName = 'Google DeepMind';
  else if (provider === 'openai') providerName = 'OpenAI';

  // Basic capabilities based on model type
  let capabilities = '"General, AI, Assistant"';
  let cap1 = 'General', cap2 = 'AI', cap3 = 'Assistant', cap4 = '';

  if (modelName.includes('embedding')) {
    capabilities = '"Embeddings, Search, Semantic"';
    cap1 = 'Embeddings'; cap2 = 'Search'; cap3 = 'Semantic';
  } else if (modelName.includes('gpt-5') || modelName.includes('o1') || modelName.includes('o3') || modelName.includes('o4')) {
    capabilities = '"Reasoning, Advanced, Coding"';
    cap1 = 'Reasoning'; cap2 = 'Advanced'; cap3 = 'Coding';
  } else if (modelName.includes('claude')) {
    capabilities = '"Reasoning, Coding, Fast"';
    cap1 = 'Reasoning'; cap2 = 'Coding'; cap3 = 'Fast';
  } else if (modelName.includes('gemini')) {
    capabilities = '"Multimodal, Fast, Tools"';
    cap1 = 'Multimodal'; cap2 = 'Fast'; cap3 = 'Tools';
  }

  const description = `"${providerName} ${displayName} - AI model available through Vercel AI Gateway"`;

  // Context window (rough estimates)
  let context = '128K';
  if (modelName.includes('2.5-pro') || modelName.includes('2.0-flash') || modelName.includes('2.5-flash') || modelName.includes('4.1')) {
    context = '1M';
  } else if (modelName.includes('claude') || modelName.includes('o1')) {
    context = '200K';
  } else if (modelName.includes('gpt-5-mini') || modelName.includes('gpt-5-nano')) {
    context = '400K';
  }

  // Create CSV line
  const columns = [
    '', // Musarty DB ID
    'AI Gateway', // API
    modelId, // Model ID
    displayName, // Model Name
    providerName, // Provider
    context, // Context
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

  return columns.join(',');
});

// Write the clean CSV
const csvPath = path.join(__dirname, 'official-gateway-models.csv');
const csvContent = [header, ...entries].join('\n');
fs.writeFileSync(csvPath, csvContent);

console.log(`Created clean CSV with ${entries.length} official models`);
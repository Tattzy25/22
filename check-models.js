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

console.log(`Total official models: ${officialModels.size}`);

// Read the current CSV
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

console.log(`Models already in CSV: ${existingModels.size}`);

// Find truly missing models
const missingModels = [...officialModels].filter(model => !existingModels.has(model));

console.log(`Truly missing models: ${missingModels.length}`);
if (missingModels.length > 0) {
  console.log('Missing:', missingModels);
} else {
  console.log('All official models are present!');
}
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

// Read the CSV file
const csvPath = path.join(__dirname, 'components', 'models', 'gateway model data - Sheet1.csv');
const csvContent = fs.readFileSync(csvPath, 'utf8');
const lines = csvContent.split('\n');

// Filter lines where Model ID (column 3, 0-indexed as 2) is in official models
const header = lines[0];
const filteredLines = [header];

for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;

  // Parse CSV line (simple split by comma, assuming no quoted commas in our data)
  const columns = line.split(',');
  const modelId = columns[2]?.trim(); // Model ID is column 3 (0-indexed as 2)

  if (modelId && officialModels.has(modelId)) {
    filteredLines.push(line);
  }
}

// Write the filtered CSV
const outputPath = path.join(__dirname, 'official-gateway-models.csv');
fs.writeFileSync(outputPath, filteredLines.join('\n'));

console.log(`Filtered CSV created with ${filteredLines.length - 1} models (plus header)`);
console.log(`Official models found: ${[...officialModels].sort().join(', ')}`);
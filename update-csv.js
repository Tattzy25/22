#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

function parseCSV(csvContent) {
  const lines = csvContent.split('\n').filter(line => line.trim());
  const headers = lines[0].split(',');
  const dataLines = lines.slice(1);

  return dataLines.map(line => {
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
      obj[header.trim()] = values[index] || '';
    });
    return obj;
  });
}

function updateCSV() {
  const csvPath = join(process.cwd(), 'components', 'models', 'gateway model data - Sheet1.csv');
  const csvContent = readFileSync(csvPath, 'utf-8');
  const rows = parseCSV(csvContent);

  // Clean rows: remove rows that are just IDs (they were incorrectly added)
  const cleanRows = rows.filter(row => {
    // Keep rows that have a proper Model Name (not an ID)
    const modelName = row['Model Name'] || '';
    return modelName.trim() &&
           !modelName.startsWith('blue_') &&
           !modelName.startsWith('https://') &&
           modelName.length > 5; // IDs are short, real names are longer
  });

  const updatedRows = cleanRows.map(row => {
    // Use the exact Model ID from AI Gateway as the database ID
    const modelId = row['Model ID'];

    // Set the new columns
    row['Musarty ID'] = modelId;  // Use the exact AI Gateway model ID
    row['Template ID'] = modelId; // Use the exact AI Gateway model ID
    row['API Endpoint URL'] = 'https://gateway.ai.vercel.com/v1';

    // Fill capabilities if empty
    if (!row['Capabilities 1'] && row['Key Capabilities']) {
      const caps = row['Key Capabilities'].split(',').map(c => c.trim());
      for (let i = 1; i <= 4; i++) {
        row[`Capabilities ${i}`] = caps[i-1] || '';
      }
    }

    return row;
  });

  // Generate CSV content
  const headers = Object.keys(updatedRows[0]);
  const csvLines = [headers.join(',')];
  updatedRows.forEach(row => {
    const values = headers.map(header => {
      const value = row[header] || '';
      return value.includes(',') ? `"${value}"` : value;
    });
    csvLines.push(values.join(','));
  });

  writeFileSync(csvPath, csvLines.join('\n'), 'utf-8');
  console.log('CSV cleaned and updated successfully');
}

updateCSV();
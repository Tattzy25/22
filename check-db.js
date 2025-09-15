import { turso } from './lib/turso.js';

async function checkDatabase() {
  try {
    // Check models count
    const models = await turso.execute('SELECT COUNT(*) as count FROM models WHERE id LIKE "blue_%"');
    console.log('Models inserted:', models.rows[0].count);

    // Check capabilities count
    const capabilities = await turso.execute('SELECT COUNT(*) as count FROM model_capabilities WHERE model_id LIKE "blue_%"');
    console.log('Capabilities inserted:', capabilities.rows[0].count);

    // Check providers count
    const providers = await turso.execute('SELECT COUNT(*) as count FROM model_providers WHERE model_id LIKE "blue_%"');
    console.log('Providers inserted:', providers.rows[0].count);

    // Check table structure
    const tableInfo = await turso.execute('PRAGMA table_info(model_providers)');
    console.log('model_providers columns:');
    tableInfo.rows.forEach(row => {
      console.log(`  ${row.name}: ${row.type} ${row.notnull ? 'NOT NULL' : 'NULL'}`);
    });

    // Check for missing models referenced in capabilities
    const missing = await turso.execute(`
      SELECT DISTINCT mc.model_id
      FROM model_capabilities mc
      LEFT JOIN models m ON mc.model_id = m.id
      WHERE m.id IS NULL AND mc.model_id LIKE "blue_%"
      LIMIT 5
    `);
    console.log('Missing models referenced in capabilities:', missing.rows);

  } catch (error) {
    console.error('Error:', error);
  }
}

checkDatabase();
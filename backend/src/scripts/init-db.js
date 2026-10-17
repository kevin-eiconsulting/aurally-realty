import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runSchema() {
  const schemaPath = path.resolve(__dirname, '../../../additional_data/auraally_phase1_database_blueprint/auraally_phase1_schema.sql');
  console.log(`Reading schema from: ${schemaPath}`);

  if (!fs.existsSync(schemaPath)) {
    console.error(`Schema file not found at ${schemaPath}`);
    process.exit(1);
  }

  const sql = fs.readFileSync(schemaPath, 'utf8');

  console.log('Executing schema SQL on Supabase PostgreSQL...');
  const client = await pool.connect();
  try {
    await client.query(sql);
    console.log('✅ Schema migration executed successfully!');
  } catch (err) {
    console.error('❌ Schema execution error:', err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

runSchema();

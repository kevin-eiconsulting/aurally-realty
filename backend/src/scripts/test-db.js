import { pool } from '../config/db.js';

async function testConnection() {
  console.log('Testing PostgreSQL connection to Supabase...');
  try {
    const res = await pool.query('SELECT NOW() as now, current_database() as db, version() as version;');
    console.log('✅ Connection successful!');
    console.log('Connected DB:', res.rows[0].db);
    console.log('Current Timestamp:', res.rows[0].now);
    console.log('PostgreSQL Version:', res.rows[0].version.split(' ')[0], res.rows[0].version.split(' ')[1]);

    // Check tables in public schema
    const tablesRes = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);

    const tableNames = tablesRes.rows.map(r => r.table_name);
    console.log(`\nFound ${tableNames.length} tables in 'public' schema:`);
    if (tableNames.length > 0) {
      console.log(tableNames.join(', '));
    } else {
      console.log('⚠️ No tables found in public schema yet. The auraally_phase1_schema.sql may need to be executed.');
    }
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  } finally {
    await pool.end();
  }
}

testConnection();

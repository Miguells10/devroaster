
const { Pool } = require('pg');
require('dotenv').config();

async function test() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    const res = await pool.query('SELECT table_name FROM information_schema.tables WHERE table_schema = \'public\'');
    console.log('Tables:', res.rows.map(r => r.table_name));
    
    if (res.rows.some(r => r.table_name === 'roasts')) {
      const columns = await pool.query('SELECT column_name, data_type FROM information_schema.columns WHERE table_name = \'roasts\'');
      console.log('Columns in roasts:', columns.rows);
      
      const sample = await pool.query('SELECT * FROM roasts LIMIT 1');
      console.log('Sample row:', sample.rows);
    }
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await pool.end();
  }
}

test();

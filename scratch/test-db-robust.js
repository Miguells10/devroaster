
const { Client } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

async function test() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });

  try {
    await client.connect();
    console.log('Connected to DB');
    
    const resTables = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
    console.log('Tables:', resTables.rows.map(r => r.table_name).join(', '));
    
    const resCount = await client.query('SELECT count(*) FROM "roasts"');
    console.log('Roasts count:', resCount.rows[0].count);
    
    const resAvg = await client.query('SELECT avg(score) FROM "roasts"');
    console.log('Roasts avg score:', resAvg.rows[0].avg);

  } catch (err) {
    console.error('DATABASE ERROR:', err.message);
    if (err.detail) console.error('DETAIL:', err.detail);
    if (err.hint) console.error('HINT:', err.hint);
  } finally {
    await client.end();
  }
}

test();

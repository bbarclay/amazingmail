
const { Client } = require('pg');

const client = new Client({
  host: '192.168.0.157',
  port: 5432,
  user: 'postgres',
  password: 'postgres',
  database: 'postgres',
});

const checkMigrations = async () => {
  try {
    await client.connect();
    console.log('Connected to the PostgreSQL database successfully!');

    const result = await client.query('SELECT * FROM migrations;');
    console.log('Applied migrations:', result.rows);
  } catch (err) {
    console.error('Error checking migrations:', err);
  } finally {
    await client.end();
  }
};

checkMigrations();

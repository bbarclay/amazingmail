
const { Client } = require('pg');

const client = new Client({
  host: '192.168.0.157',
  port: 5432,
  user: 'postgres',
  password: 'postgres',
  database: 'postgres',
});

const dropAllTables = async () => {
  try {
    await client.connect();
    console.log('Connected to the PostgreSQL database successfully!');

    const dropTablesQuery = `
      DO $$ DECLARE
        r RECORD;
      BEGIN
        FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
          EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
        END LOOP;
      END $$;
    `;

    await client.query(dropTablesQuery);
    console.log('All tables dropped successfully.');

    // Drop the migrations table explicitly
    await client.query('DROP TABLE IF EXISTS migrations');
    console.log('Migrations table dropped successfully.');
  } catch (err) {
    console.error('Error dropping tables:', err);
  } finally {
    await client.end();
  }
};

dropAllTables();

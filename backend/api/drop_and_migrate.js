
const { Client } = require('pg');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

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

const runMigrations = async () => {
  try {
    console.log('Running migrations...');
    const { stdout, stderr } = await execPromise('DEBUG=typeorm:migration npm run migration:run');
    console.log('Migration output:', stdout);
    if (stderr) {
      console.error('Migration errors:', stderr);
    }
  } catch (err) {
    console.error('Error running migrations:', err);
    if (err.stdout) {
      console.log('Migration stdout:', err.stdout);
    }
    if (err.stderr) {
      console.log('Migration stderr:', err.stderr);
    }
  }
};

const main = async () => {
  await dropAllTables();
  await runMigrations();
  console.log('Process completed.');
};

main();

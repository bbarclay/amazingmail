const { Client } = require('pg');
const { newDb } = require('pg-mem');

// Create a new in-memory database
const db = newDb();

// Function to migrate data from the existing PostgreSQL database
async function migrate() {
    // Connect to the existing PostgreSQL database
    const client = new Client({
        user: 'your_username',
        host: 'localhost',
        database: 'your_database',
        password: 'your_password',
        port: 5432,
    });

    await client.connect();

    // Fetch the existing tables and their data
    const tables = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public'");
    
    for (const table of tables.rows) {
        const tableName = table.table_name;

        // Create the table in the in-memory database
        const createTableQuery = await client.query(`SELECT * FROM ${tableName} LIMIT 0`);
        const columns = createTableQuery.fields.map(field => field.name).join(', ');
        await db.public.none(`CREATE TABLE ${tableName} (${columns})`);

        // Migrate the data
        const data = await client.query(`SELECT * FROM ${tableName}`);
        for (const row of data.rows) {
            const values = Object.values(row).map(value => `'${value}'`).join(', ');
            await db.public.none(`INSERT INTO ${tableName} (${columns}) VALUES (${values})`);
        }
    }

    await client.end();
    console.log('Migration completed successfully!');
}

// Run the migration
migrate().catch(err => console.error('Migration failed:', err));

const { Client } = require('pg');

const client = new Client({
user: 'postgres',
host: '192.168.0.157',
database: 'postgres',
password: 'postgres',
    port: 5432,
});

async function runMigration() {
    try {
        await client.connect();
        console.log('Connected to the database.');

        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL
            );
        `;
        
        await client.query(createTableQuery);
        console.log('Migration completed: users table created.');

    } catch (err) {
        console.error('Error running migration:', err);
    } finally {
        await client.end();
    }
}

runMigration();

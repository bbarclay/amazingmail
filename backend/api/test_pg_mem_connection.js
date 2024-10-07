const { newDb } = require('pg-mem');

// Create a new in-memory database
const db = newDb();

// Test the connection
async function testConnection() {
    try {
        // Create a sample table
        await db.public.none('CREATE TABLE test (id SERIAL PRIMARY KEY, name TEXT)');

        // Insert a sample row
        await db.public.none("INSERT INTO test (name) VALUES ('Alice')");

        // Query the data
        const result = await db.public.many('SELECT * FROM test');
        console.log('Connection successful! Data:', result);
    } catch (err) {
        console.error('Connection failed:', err);
    }
}

// Run the test
testConnection();

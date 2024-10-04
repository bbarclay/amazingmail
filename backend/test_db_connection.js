require('dotenv').config();
const { Client } = require('pg');

// Get database connection details from environment variables
const DATABASE_URL = process.env.POSTGRES_URL;

async function testConnection() {
  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    // Connect to the database
    await client.connect();

    // Create a test table
    await client.query("CREATE TABLE IF NOT EXISTS test_table (id SERIAL PRIMARY KEY, name VARCHAR(50));");

    // Print success message
    console.log("Connected to the database and created test_table successfully.");
  } catch (error) {
    console.error(`Error connecting to the database: ${error}`);
  } finally {
    // Close the database connection
    await client.end();
  }
}

testConnection();

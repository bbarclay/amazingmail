require('dotenv').config();
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Get database connection details from environment variables
const DATABASE_URL = "postgresql://postgres.yjaxgjzlweqdcfmyippu:[Yp2JTB@XDXHVcY5]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require";

// Path to the root CA certificate (you can download this from your database provider)
const CA_CERT_PATH = path.resolve(__dirname, 'root.crt');

async function testConnection() {
  let sslConfig = {
    rejectUnauthorized: false
  };

  // Check if the root CA certificate file exists
  if (fs.existsSync(CA_CERT_PATH)) {
    console.log('Root CA certificate found. Using it for SSL configuration.');
    sslConfig = {
      rejectUnauthorized: true,
      ca: fs.readFileSync(CA_CERT_PATH).toString(),
    };
  } else {
    console.warn('Root CA certificate not found. Falling back to "rejectUnauthorized: false".');
  }

  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: sslConfig,
  });

  try {
    // Connect to the database
    await client.connect();

    // Create a test table
    await client.query("CREATE TABLE IF NOT EXISTS test_table (id SERIAL PRIMARY KEY, name VARCHAR(50));");

    // Print success message
    console.log("Connected to the database and created test_table successfully.");
  } catch (error) {
    console.error(`Error connecting to the database: ${error.message}`);
  } finally {
    // Close the database connection
    await client.end();
  }
}

testConnection();

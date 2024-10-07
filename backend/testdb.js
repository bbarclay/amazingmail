// Import the pg library
const { Client } = require('pg');

// Define the database connection configuration
const client = new Client({
  host: '192.168.0.157',
  port: 5432,
  user: 'postgres',
  password: 'postgres',
  database: 'postgres', // Specify the database name to connect to
});

// Query to get all tables in the current database schema
const queryTables = `
  SELECT table_name
  FROM information_schema.tables
  WHERE table_schema = 'public'
  ORDER BY table_name;
`;

// Query to get all columns for a specific table
const queryColumns = (tableName) => `
  SELECT column_name, data_type, is_nullable
  FROM information_schema.columns
  WHERE table_name = '${tableName}'
  ORDER BY column_name;
`;

// Query to get all indexes for a specific table
const queryIndexes = (tableName) => `
  SELECT indexname, indexdef
  FROM pg_indexes
  WHERE tablename = '${tableName}';
`;

// Function to fetch and print all table details
const printTableDetails = async () => {
  try {
    // Connect to the PostgreSQL database
    await client.connect();
    console.log('Connected to the PostgreSQL database successfully!\n');

    // Fetch all tables
    const tablesResult = await client.query(queryTables);
    const tables = tablesResult.rows;

    console.log('Database Structure:\n');

    // Iterate through each table and print its structure
    for (const table of tables) {
      const tableName = table.table_name;
      console.log(`Table: ${tableName}`);

      // Fetch columns for the current table
      const columnsResult = await client.query(queryColumns(tableName));
      const columns = columnsResult.rows;

      console.log('  Columns:');
      columns.forEach((column) => {
        console.log(`    - ${column.column_name} (${column.data_type}) [Nullable: ${column.is_nullable}]`);
      });

      // Fetch indexes for the current table
      const indexesResult = await client.query(queryIndexes(tableName));
      const indexes = indexesResult.rows;

      console.log('  Indexes:');
      if (indexes.length > 0) {
        indexes.forEach((index) => {
          console.log(`    - ${index.indexname}: ${index.indexdef}`);
        });
      } else {
        console.log('    - No indexes found');
      }

      console.log('\n'); // Add a new line for better readability between tables
    }
  } catch (err) {
    console.error('Failed to retrieve database structure:', err);
  } finally {
    await client.end();
    console.log('Connection to PostgreSQL database closed.');
  }
};

// Execute the function to print table details
printTableDetails();

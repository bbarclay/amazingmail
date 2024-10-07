const { Client } = require('pg');

const client = new Client({
  host: '192.168.0.157',
  port: 5432,
  user: 'postgres',
  password: 'postgres',
  database: 'postgres',
});

const queryTables = `
  SELECT table_name
  FROM information_schema.tables
  WHERE table_schema = 'public'
  ORDER BY table_name;
`;

const queryColumns = (tableName) => `
  SELECT column_name, data_type, is_nullable
  FROM information_schema.columns
  WHERE table_name = '${tableName}'
  ORDER BY column_name;
`;

const queryIndexes = (tableName) => `
  SELECT indexname, indexdef
  FROM pg_indexes
  WHERE tablename = '${tableName}';
`;

const printTableDetails = async () => {
  try {
    await client.connect();
    console.log('Connected to the PostgreSQL database successfully!\n');

    const tablesResult = await client.query(queryTables);
    const tables = tablesResult.rows;

    console.log('Database Structure:\n');

    for (const table of tables) {
      const tableName = table.table_name;
      console.log(`Table: ${tableName}`);

      const columnsResult = await client.query(queryColumns(tableName));
      const columns = columnsResult.rows;

      console.log('  Columns:');
      columns.forEach((column) => {
        console.log(`    - ${column.column_name} (${column.data_type}) [Nullable: ${column.is_nullable}]`);
      });

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

      console.log('\n');
    }
  } catch (err) {
    console.error('Failed to retrieve database structure:', err);
  } finally {
    await client.end();
    console.log('Connection to PostgreSQL database closed.');
  }
};

printTableDetails();

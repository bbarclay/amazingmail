const knex = require('knex');
const config = require('./knexfile');

const db = knex(config);

async function listTables() {
  try {
    const tables = await db.raw(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
    `);

    for (const table of tables.rows) {
      console.log(`Table: ${table.table_name}`);
      const columns = await db.raw(`
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_name = '${table.table_name}'
      `);

      columns.rows.forEach(column => {
        console.log(`  Column: ${column.column_name}, Type: ${column.data_type}`);
      });
    }
  } catch (error) {
    console.error('Error listing tables:', error);
  } finally {
    await db.destroy();
  }
}

listTables();

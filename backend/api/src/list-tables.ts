import { AppDataSource } from '../ormconfig';

async function listTables() {
  try {
    await AppDataSource.initialize();
    const tables = await AppDataSource.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
    console.log('Tables in the database:');
    tables.forEach((table: { table_name: string }) => {
      console.log(table.table_name);
    });
  } catch (error) {
    console.error('Error listing tables:', error);
  } finally {
    await AppDataSource.destroy();
  }
}

listTables().catch(console.error);

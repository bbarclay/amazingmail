import { createConnection } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

async function checkDatabaseStructure() {
  const connection = await createConnection({
    type: 'postgres',
    host: process.env.DB_HOST || '192.168.0.157',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'postgres',
    synchronize: false,
    logging: false,
  });

  try {
    const queryRunner = connection.createQueryRunner();

    // Get all table names
    const tables = await queryRunner.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"
    );

    console.log('Tables in the database:');
    for (const table of tables) {
      console.log(table.table_name);

      // Get foreign keys for each table
      const foreignKeys = await queryRunner.query(
        `SELECT
          tc.constraint_name, 
          kcu.column_name, 
          ccu.table_name AS foreign_table_name,
          ccu.column_name AS foreign_column_name
        FROM 
          information_schema.table_constraints AS tc 
          JOIN information_schema.key_column_usage AS kcu
            ON tc.constraint_name = kcu.constraint_name
          JOIN information_schema.constraint_column_usage AS ccu
            ON ccu.constraint_name = tc.constraint_name
        WHERE constraint_type = 'FOREIGN KEY' AND tc.table_name='${table.table_name}'`
      );

      if (foreignKeys.length > 0) {
        console.log('  Foreign Keys:');
        for (const fk of foreignKeys) {
          console.log(`    ${fk.column_name} -> ${fk.foreign_table_name}(${fk.foreign_column_name})`);
        }
      }
      console.log('');
    }
  } finally {
    await connection.close();
  }
}

checkDatabaseStructure().catch(error => console.error(error));

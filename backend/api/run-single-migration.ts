import { DataSource } from 'typeorm';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

async function runSingleMigration(migrationName: string) {
  const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || '192.168.0.157',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'postgres',
    entities: [path.join(__dirname, 'src/entities/**/*.entity{.ts,.js}')],
    migrations: [path.join(__dirname, `src/migrations/${migrationName}`)],
    synchronize: false,
    logging: true,
  });

  try {
    await AppDataSource.initialize();
    console.log('Data Source has been initialized!');

    await AppDataSource.runMigrations();
    console.log('Migration has been run successfully.');

    await AppDataSource.destroy();
    console.log('Data Source has been destroyed.');
  } catch (error) {
    console.error('Error during migration process', error);
    process.exit(1);
  }
}

const migrationName = process.argv[2];
if (!migrationName) {
  console.error('Please provide a migration file name as an argument.');
  process.exit(1);
}

runSingleMigration(migrationName);

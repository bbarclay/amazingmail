import { DataSource } from 'typeorm';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || '192.168.0.157',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'postgres',
  entities: [path.join(__dirname, 'src/entities/**/*.entity{.ts,.js}')],
  migrations: [
    path.join(__dirname, 'src/migrations/1660000000001-CreateOrganizationsTable.ts'),
    path.join(__dirname, 'src/migrations/1660000000002-CreateUsersTable.ts'),
    path.join(__dirname, 'src/migrations/1660000000003-CreateCampaignsTable.ts'),
    path.join(__dirname, 'src/migrations/1660000000004-CreateEmailAccountsAndAssignmentsTable.ts'),
    path.join(__dirname, 'src/migrations/1660000000099-AddAllForeignKeyConstraints.ts'),
  ],
  synchronize: false,
  logging: true,
});

async function runMigrations() {
  try {
    await AppDataSource.initialize();
    console.log('Data Source has been initialized!');

    await AppDataSource.runMigrations();
    console.log('Migrations have been run successfully.');

    await AppDataSource.destroy();
    console.log('Data Source has been destroyed.');
  } catch (error) {
    console.error('Error during migration process', error);
    process.exit(1);
  }
}

runMigrations();

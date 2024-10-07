import pkg from 'pg';
const { Client } = pkg;
import fs from 'fs';
import path from 'path';
import { DataSource } from 'typeorm';
import util from 'util';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Use ts-node to run TypeScript migrations
import 'ts-node/register';

// PostgreSQL client setup using environment variables for security
import dotenv from 'dotenv';
dotenv.config({ path: '/workspace/.env.local' });

// Disable SSL certificate validation for development
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const connectionString = process.env.POSTGRES_URL || 'postgres://postgres.dhqexsiedzedcbghkdzc:368doXSAQW2vGQlt@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&supa=base-pooler.x';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize TypeORM DataSource without automatic migrations
const AppDataSource = new DataSource({
  type: 'postgres',
  url: connectionString,
  ssl: { rejectUnauthorized: false },
  entities: [], // Add your entities here
  migrations: [path.join(__dirname, 'src/migrations/*.ts')], // Updated to use TypeScript files
  synchronize: false,
  logging: true, // Enable logging for debugging
});

// Function to run migrations individually and track their status
const runMigrationsIndividually = async () => {
  const failedMigrations = [];
  const successfulMigrations = [];

  try {
    console.log('Initializing DataSource...');
    await AppDataSource.initialize();
    console.log('TypeORM DataSource initialized.');

    const migrationsDir = path.join(__dirname, 'src/migrations'); // Update this path as needed
    console.log(`Migrations directory: ${migrationsDir}`);

    // Check if migrations directory exists
    if (!fs.existsSync(migrationsDir)) {
      throw new Error(`Migrations directory not found at path: ${migrationsDir}`);
    }

    const migrationFiles = fs
      .readdirSync(migrationsDir)
      .filter((file) => file.endsWith('.ts')) // Changed to .ts for TypeScript files
      .sort(); // Ensure migrations run in order (optional)

    console.log(`Found migration files: ${migrationFiles.join(', ')}`);

    if (migrationFiles.length === 0) {
      console.warn('No migration files found. Skipping migration step.');
      return { failedMigrations, successfulMigrations };
    }

    for (const file of migrationFiles) {
      const migrationPath = path.join(migrationsDir, file);
      console.log(`Processing migration file: ${migrationPath}`);
      let migrationModule;
      try {
        migrationModule = await import(migrationPath); // Changed to dynamic import
      } catch (importError) {
        console.error(`Failed to import migration file ${file}:`, importError);
        failedMigrations.push(file);
        continue;
      }

      const MigrationClass = migrationModule.default || Object.values(migrationModule)[0];
      if (!MigrationClass) {
        console.error(`No migration class found in file ${file}.`);
        failedMigrations.push(file);
        continue;
      }

      const migrationInstance = new MigrationClass();

      console.log(`Running migration: ${file}`);

      const queryRunner = AppDataSource.createQueryRunner();

      try {
        await queryRunner.connect();
        console.log('Query runner connected.');

        // Start a new transaction
        await queryRunner.startTransaction();
        console.log('Transaction started.');

        // Bypass foreign key constraints by setting session_replication_role to 'replica'
        // This requires superuser privileges
        await queryRunner.query("SET session_replication_role = 'replica';");
        console.log('Set session_replication_role to replica.');

        // Execute the migration's up method
        await migrationInstance.up(queryRunner);
        console.log(`Migration ${file} executed.`);

        // Restore the session_replication_role to 'origin'
        await queryRunner.query("SET session_replication_role = 'origin';");
        console.log('Restored session_replication_role to origin.');

        // Commit the transaction
        await queryRunner.commitTransaction();
        console.log('Transaction committed.');

        console.log(`Migration ${file} ran successfully.`);
        successfulMigrations.push(file);
      } catch (err) {
        console.error(`Migration ${file} failed:`, err);
        failedMigrations.push(file);
        // Rollback the transaction in case of error
        try {
          await queryRunner.rollbackTransaction();
          console.log('Transaction rolled back.');
        } catch (rollbackErr) {
          console.error(`Failed to rollback transaction for migration ${file}:`, rollbackErr);
        }
      } finally {
        // Release the query runner
        await queryRunner.release();
        console.log('Query runner released.');
      }
    }

    console.log('All migrations processed.');
    if (failedMigrations.length > 0) {
      console.warn('Some migrations failed:', failedMigrations);
    }
    if (successfulMigrations.length > 0) {
      console.log('Successful migrations:', successfulMigrations);
    }
  } catch (err) {
    console.error('Error initializing DataSource or running migrations:', err);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('DataSource destroyed.');
    }
  }

  return { failedMigrations, successfulMigrations };
};

// Function to check if tables related to migrations exist
const checkMigrationTables = async (migrations) => {
  const client = new Client({ 
    connectionString, 
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected to the PostgreSQL database for table checks.');

    for (const migrationFile of migrations) {
      // Assuming each migration file follows a naming convention like 'CreateUsersTable.ts'
      // and creates a table named 'users'. Adjust the logic as needed.

      const tableNameMatch = migrationFile.match(/Create(\w+)Table/);
      if (tableNameMatch) {
        const tableName = tableNameMatch[1].toLowerCase(); // e.g., 'Users' => 'users'

        const query = `
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = $1
          ) AS "exists";
        `;

        const res = await client.query(query, [tableName]);
        const exists = res.rows[0].exists;

        if (exists) {
          console.log(`Table "${tableName}" exists for migration "${migrationFile}".`);
        } else {
          console.warn(`Table "${tableName}" does NOT exist for migration "${migrationFile}".`);
        }
      } else {
        console.warn(`Could not determine table name from migration file "${migrationFile}".`);
      }
    }
  } catch (err) {
    console.error('Error checking migration tables:', err);
  } finally {
    await client.end();
    console.log('Database connection closed.');
  }
};

// Main function to orchestrate the process
const main = async () => {
  console.log('Starting migration process...');
  console.log('Connection string:', connectionString.replace(/:[^:@]+@/, ':****@'));
  const { failedMigrations, successfulMigrations } = await runMigrationsIndividually();

  console.log('Process completed.');
  console.log('Successful migrations:', successfulMigrations);
  console.log('Failed migrations:', failedMigrations);

  // Now, check tables for each successful migration
  if (successfulMigrations.length > 0) {
    console.log('Checking migration tables...');
    await checkMigrationTables(successfulMigrations);
  }

  // Exit the process with appropriate status code
  if (failedMigrations.length > 0) {
    console.log('Exiting with status code 1 due to failed migrations.');
    process.exit(1);
  } else {
    console.log('Exiting with status code 0. All migrations successful.');
    process.exit(0);
  }
};

main();


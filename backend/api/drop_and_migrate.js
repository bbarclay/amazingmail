const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const { DataSource } = require('typeorm');
const util = require('util');

// Use ts-node to run TypeScript migrations
require('ts-node').register();

// PostgreSQL client setup using environment variables for security
require('dotenv').config();

const clientConfig = {
  host: process.env.DB_HOST || '192.168.0.157',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'postgres',
};

// Initialize TypeORM DataSource without automatic migrations
const AppDataSource = new DataSource({
  type: 'postgres',
  host: clientConfig.host,
  port: clientConfig.port,
  username: clientConfig.user,
  password: clientConfig.password,
  database: clientConfig.database,
  entities: [], // Add your entities here
  migrations: [path.join(__dirname, 'src/migrations/*.ts')], // Updated to use TypeScript files
  synchronize: false,
  logging: false,
});

// // Function to drop all tables
// const dropAllTables = async () => {
//   const client = new Client(clientConfig);
//   try {
//     await client.connect();
//     console.log('Connected to the PostgreSQL database successfully!');

//     const dropTablesQuery = `
//       DO $$ DECLARE
//         r RECORD;
//       BEGIN
//         FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
//           EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
//         END LOOP;
//       END $$;
//     `;

//     await client.query(dropTablesQuery);
//     console.log('All tables dropped successfully.');

//     // Drop the migrations table explicitly
//     await client.query('DROP TABLE IF EXISTS migrations');
//     console.log('Migrations table dropped successfully.');
//   } catch (err) {
//     console.error('Error dropping tables:', err);
//   } finally {
//     await client.end();
//   }
// };

// Function to run migrations individually and track their status
const runMigrationsIndividually = async () => {
  const failedMigrations = [];
  const successfulMigrations = [];

  try {
    await AppDataSource.initialize();
    console.log('TypeORM DataSource initialized.');

    const migrationsDir = path.join(__dirname, 'src/migrations'); // Update this path as needed

    // Check if migrations directory exists
    if (!fs.existsSync(migrationsDir)) {
      throw new Error(`Migrations directory not found at path: ${migrationsDir}`);
    }

    const migrationFiles = fs
      .readdirSync(migrationsDir)
      .filter((file) => file.endsWith('.ts')) // Changed to .ts for TypeScript files
      .sort(); // Ensure migrations run in order (optional)

    if (migrationFiles.length === 0) {
      console.warn('No migration files found. Skipping migration step.');
      return { failedMigrations, successfulMigrations };
    }

    for (const file of migrationFiles) {
      const migrationPath = path.join(migrationsDir, file);
      let migrationModule;
      try {
        migrationModule = require(migrationPath); // Changed from dynamic import to require
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

        // Start a new transaction
        await queryRunner.startTransaction();

        // Bypass foreign key constraints by setting session_replication_role to 'replica'
        // This requires superuser privileges
        await queryRunner.query("SET session_replication_role = 'replica';");

        // Execute the migration's up method
        await migrationInstance.up(queryRunner);

        // Restore the session_replication_role to 'origin'
        await queryRunner.query("SET session_replication_role = 'origin';");

        // Commit the transaction
        await queryRunner.commitTransaction();

        console.log(`Migration ${file} ran successfully.`);
        successfulMigrations.push(file);
      } catch (err) {
        console.error(`Migration ${file} failed:`, err);
        failedMigrations.push(file);
        // Rollback the transaction in case of error
        try {
          await queryRunner.rollbackTransaction();
        } catch (rollbackErr) {
          console.error(`Failed to rollback transaction for migration ${file}:`, rollbackErr);
        }
      } finally {
        // Release the query runner
        await queryRunner.release();
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
    await AppDataSource.destroy();
  }

  return { failedMigrations, successfulMigrations };
};

// Function to check if tables related to migrations exist
const checkMigrationTables = async (migrations) => {
  const clientCheck = new Client(clientConfig);

  try {
    await clientCheck.connect();
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

        const res = await clientCheck.query(query, [tableName]);
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
    await clientCheck.end();
  }
};

// Main function to orchestrate the process
const main = async () => {
  // await dropAllTables();
  const { failedMigrations, successfulMigrations } = await runMigrationsIndividually();

  console.log('Process completed.');
  console.log('Successful migrations:', successfulMigrations);
  console.log('Failed migrations:', failedMigrations);

  // Now, check tables for each successful migration
  if (successfulMigrations.length > 0) {
    await checkMigrationTables(successfulMigrations);
  }

  // Exit the process with appropriate status code
  if (failedMigrations.length > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
};

main();

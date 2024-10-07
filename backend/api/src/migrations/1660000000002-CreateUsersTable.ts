import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableForeignKey,
    TableIndex,
} from 'typeorm';

export class CreateUsersTable1660000000002 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Ensure uuid-ossp extension is enabled
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

        // Create the Users table
        await queryRunner.createTable(
            new Table({
                name: 'users',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'email',
                        type: 'varchar',
                        isUnique: false, // We'll add a unique index with LOWER(email)
                        isNullable: false,
                    },
                    {
                        name: 'email_verified_at',
                        type: 'timestamp',
                        isNullable: true,
                    },
                    {
                        name: 'confirmation_token',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'confirmation_expires',
                        type: 'timestamp',
                        isNullable: true,
                    },
                    {
                        name: 'name',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'password',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'api_key',
                        type: 'varchar',
                        isUnique: true,
                        isNullable: true,
                    },
                    {
                        name: 'settings',
                        type: 'json',
                        isNullable: true,
                    },
                    {
                        name: 'organization_id',
                        type: 'uuid',
                        isNullable: true,
                    },
                    {
                        name: 'role',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'is_active',
                        type: 'boolean',
                        default: true,
                    },
                    {
                        name: 'last_login',
                        type: 'timestamp',
                        isNullable: true,
                    },
                    {
                        name: 'phone_number',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'profile_picture',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'two_factor_enabled',
                        type: 'boolean',
                        default: false,
                    },
                    {
                        name: 'password_reset_token',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'password_reset_expires',
                        type: 'timestamp',
                        isNullable: true,
                    },
                    {
                        name: 'login_attempts',
                        type: 'integer',
                        default: 0,
                        isNullable: false,
                    },
                    {
                        name: 'lock_until',
                        type: 'timestamp',
                        isNullable: true,
                    },
                    {
                        name: 'deleted_at',
                        type: 'timestamp',
                        isNullable: true,
                    },
                ],
            }),
            true, // indicate that the table should be created if it does not exist
        );

        // Create unique index on lower(email) for case-insensitive uniqueness
        await queryRunner.createIndex(
            'users',
            new TableIndex({
                name: 'IDX_USERS_EMAIL_UNIQUE',
                columnNames: ['email'],
                isUnique: true,
            }),
        );

        await queryRunner.query(
            `CREATE UNIQUE INDEX "IDX_USERS_EMAIL_UNIQUE_LOWER" ON "users" (LOWER(email))`,
        );

        // Create indexes
        await queryRunner.createIndex(
            'users',
            new TableIndex({
                name: 'IDX_USERS_API_KEY',
                columnNames: ['api_key'],
            }),
        );

        await queryRunner.createIndex(
            'users',
            new TableIndex({
                name: 'IDX_USERS_ORG_ID',
                columnNames: ['organization_id'],
            }),
        );

        await queryRunner.createIndex(
            'users',
            new TableIndex({
                name: 'IDX_USERS_NAME',
                columnNames: ['name'],
            }),
        );

        await queryRunner.createIndex(
            'users',
            new TableIndex({
                name: 'IDX_USERS_IS_ACTIVE',
                columnNames: ['is_active'],
            }),
        );

        await queryRunner.createIndex(
            'users',
            new TableIndex({
                name: 'IDX_USERS_LAST_LOGIN',
                columnNames: ['last_login'],
            }),
        );

        // Add foreign key for organization_id
        await queryRunner.createForeignKey(
            'users',
            new TableForeignKey({
                columnNames: ['organization_id'],
                referencedTableName: 'organizations',
                referencedColumnNames: ['id'],
                onDelete: 'SET NULL',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Retrieve the users table
        const table = await queryRunner.getTable('users');

        if (table) {
            // Drop foreign keys
            const foreignKeys = table.foreignKeys.filter(
                (fk) => fk.columnNames.includes('organization_id'),
            );

            for (const fk of foreignKeys) {
                await queryRunner.dropForeignKey('users', fk);
            }

            // Drop indexes
            const indexes = table.indices.filter((idx) =>
                [
                    'IDX_USERS_EMAIL_UNIQUE',
                    'IDX_USERS_EMAIL_UNIQUE_LOWER',
                    'IDX_USERS_API_KEY',
                    'IDX_USERS_ORG_ID',
                    'IDX_USERS_NAME',
                    'IDX_USERS_IS_ACTIVE',
                    'IDX_USERS_LAST_LOGIN',
                ].includes(idx.name),
            );

            for (const index of indexes) {
                await queryRunner.dropIndex('users', index);
            }
        }

        // Drop the users table
        await queryRunner.dropTable('users');

        // Optionally, drop the uuid-ossp extension if it was created by this migration
        // Be cautious with this in shared databases
        // await queryRunner.query(`DROP EXTENSION IF EXISTS "uuid-ossp"`);
    }
}

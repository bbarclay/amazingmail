import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateUsersTable1660000000001 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create the Users table
        await queryRunner.createTable(new Table({
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
                    isUnique: true,
                },
                {
                    name: 'name',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'password',
                    type: 'varchar',
                },
                {
                    name: 'api_key',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'settings',
                    type: 'json',
                    isNullable: true,
                },
                {
                    name: 'team_id',
                    type: 'uuid',
                    isNullable: true,
                },
                {
                    name: 'organization_id',
                    type: 'uuid',
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
            ],
        }));

        // Create indexes for the 'email', 'team_id', and 'organization_id' columns
        await queryRunner.createIndex('users', new TableIndex({
            name: 'IDX_USERS_EMAIL',
            columnNames: ['email'],
        }));

        await queryRunner.createIndex('users', new TableIndex({
            name: 'IDX_USERS_TEAM_ID',
            columnNames: ['team_id'],
        }));

        await queryRunner.createIndex('users', new TableIndex({
            name: 'IDX_USERS_ORG_ID',
            columnNames: ['organization_id'],
        }));

        // Add foreign key for team_id
        await queryRunner.createForeignKey('users', new TableForeignKey({
            columnNames: ['team_id'],
            referencedTableName: 'teams',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
        }));

        // Add foreign key for organization_id
        await queryRunner.createForeignKey('users', new TableForeignKey({
            columnNames: ['organization_id'],
            referencedTableName: 'organizations',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Retrieve the users table
        const table = await queryRunner.getTable('users');

        // Drop foreign keys if they exist
        if (table) {
            const teamForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('team_id') !== -1);
            if (teamForeignKey) {
                await queryRunner.dropForeignKey('users', teamForeignKey);
            }

            const orgForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('organization_id') !== -1);
            if (orgForeignKey) {
                await queryRunner.dropForeignKey('users', orgForeignKey);
            }
        }

        // Drop indexes
        await queryRunner.dropIndex('users', 'IDX_USERS_EMAIL');
        await queryRunner.dropIndex('users', 'IDX_USERS_TEAM_ID');
        await queryRunner.dropIndex('users', 'IDX_USERS_ORG_ID');

        // Drop the users table
        await queryRunner.dropTable('users');
    }
}

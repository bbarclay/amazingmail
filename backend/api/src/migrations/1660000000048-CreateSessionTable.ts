import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateSessionTable1660000000048 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Ensure uuid-ossp extension is enabled
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

        // Create the sessions table with additional fields
        await queryRunner.createTable(
            new Table({
                name: 'sessions',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'user_id',
                        type: 'uuid',
                        isNullable: false,
                    },
                    {
                        name: 'token',
                        type: 'varchar',
                        isUnique: true,
                        length: '255',
                        isNullable: false,
                    },
                    {
                        name: 'expires_at',
                        type: 'timestamp',
                        isNullable: false,
                    },
                    {
                        name: 'ip_address',
                        type: 'varchar',
                        length: '45', // Supports IPv6
                        isNullable: true,
                    },
                    {
                        name: 'user_agent',
                        type: 'varchar',
                        length: '512',
                        isNullable: true,
                    },
                    {
                        name: 'is_revoked',
                        type: 'boolean',
                        default: false,
                        isNullable: false,
                    },
                    {
                        name: 'last_accessed_at',
                        type: 'timestamp',
                        isNullable: true,
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'now()',
                        isNullable: false,
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        default: 'now()',
                        isNullable: false,
                    },
                ],
            }),
            true // Indicates that the table should be created if it doesn't exist
        );

        // Add foreign key for user_id
        await queryRunner.createForeignKey(
            'sessions',
            new TableForeignKey({
                columnNames: ['user_id'],
                referencedTableName: 'users',
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
            })
        );

        // Create indexes for foreign keys and expires_at
        await queryRunner.createIndex(
            'sessions',
            new TableIndex({
                name: 'IDX_SESSIONS_USER_ID',
                columnNames: ['user_id'],
            })
        );

        await queryRunner.createIndex(
            'sessions',
            new TableIndex({
                name: 'IDX_SESSIONS_EXPIRES_AT',
                columnNames: ['expires_at'],
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop indexes
        await queryRunner.dropIndex('sessions', 'IDX_SESSIONS_EXPIRES_AT');
        await queryRunner.dropIndex('sessions', 'IDX_SESSIONS_USER_ID');

        // Drop foreign key from sessions
        const table = await queryRunner.getTable('sessions');
        if (table) {
            const foreignKeys = table.foreignKeys;

            const userForeignKey = foreignKeys.find(
                (fk) => fk.columnNames.indexOf('user_id') !== -1
            );
            if (userForeignKey) {
                await queryRunner.dropForeignKey('sessions', userForeignKey);
            }
        }

        // Drop the sessions table
        await queryRunner.dropTable('sessions');

        // Optionally, drop the uuid-ossp extension if it was created by this migration
        // Be cautious with this in environments where other tables might use it
        // await queryRunner.query(`DROP EXTENSION IF EXISTS "uuid-ossp"`);
    }
}

import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateEmailDeliveriesTable1660000000046 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Ensure uuid-ossp extension is enabled
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

        // Optionally, create ENUM type for status if not already present
        await queryRunner.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'email_delivery_status') THEN
                    CREATE TYPE email_delivery_status AS ENUM ('pending', 'delivered', 'failed');
                END IF;
            END$$;
        `);

        // Create the email_deliveries table with additional fields
        await queryRunner.createTable(
            new Table({
                name: 'email_deliveries',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'email_id',
                        type: 'uuid',
                        isNullable: false,
                    },
                    {
                        name: 'recipient',
                        type: 'varchar',
                        length: '255',
                        isNullable: false,
                    },
                    {
                        name: 'subject',
                        type: 'varchar',
                        length: '255',
                        isNullable: false,
                    },
                    {
                        name: 'template_id',
                        type: 'uuid',
                        isNullable: true,
                    },
                    {
                        name: 'status',
                        type: 'email_delivery_status',
                        isNullable: false,
                        default: `'pending'`,
                    },
                    {
                        name: 'delivered_at',
                        type: 'timestamp',
                        isNullable: true,
                    },
                    {
                        name: 'error_message',
                        type: 'text',
                        isNullable: true,
                    },
                    {
                        name: 'provider_response',
                        type: 'json',
                        isNullable: true,
                    },
                    {
                        name: 'provider',
                        type: 'varchar',
                        length: '100',
                        isNullable: true,
                    },
                    {
                        name: 'attempts',
                        type: 'integer',
                        default: 0,
                        isNullable: false,
                    },
                    {
                        name: 'last_attempted_at',
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
            true // Ensures the table is created only if it doesn't exist
        );

        // Add foreign key for email_id
        await queryRunner.createForeignKey(
            'email_deliveries',
            new TableForeignKey({
                columnNames: ['email_id'],
                referencedTableName: 'emails',
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
            })
        );

        // Create indexes for email_id and status
        await queryRunner.createIndex(
            'email_deliveries',
            new TableIndex({
                name: 'IDX_EMAIL_DELIVERIES_EMAIL_ID',
                columnNames: ['email_id'],
            })
        );

        await queryRunner.createIndex(
            'email_deliveries',
            new TableIndex({
                name: 'IDX_EMAIL_DELIVERIES_STATUS',
                columnNames: ['status'],
            })
        );

        // Optionally, create index on provider for quicker lookups by provider
        await queryRunner.createIndex(
            'email_deliveries',
            new TableIndex({
                name: 'IDX_EMAIL_DELIVERIES_PROVIDER',
                columnNames: ['provider'],
            })
        );

        // Optionally, create index on recipient for faster searches
        await queryRunner.createIndex(
            'email_deliveries',
            new TableIndex({
                name: 'IDX_EMAIL_DELIVERIES_RECIPIENT',
                columnNames: ['recipient'],
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop indexes
        await queryRunner.dropIndex('email_deliveries', 'IDX_EMAIL_DELIVERIES_RECIPIENT');
        await queryRunner.dropIndex('email_deliveries', 'IDX_EMAIL_DELIVERIES_PROVIDER');
        await queryRunner.dropIndex('email_deliveries', 'IDX_EMAIL_DELIVERIES_STATUS');
        await queryRunner.dropIndex('email_deliveries', 'IDX_EMAIL_DELIVERIES_EMAIL_ID');

        // Drop foreign key from email_deliveries
        const table = await queryRunner.getTable('email_deliveries');
        if (table) {
            const foreignKeys = table.foreignKeys;

            const emailForeignKey = foreignKeys.find(
                (fk) => fk.columnNames.indexOf('email_id') !== -1
            );
            if (emailForeignKey) {
                await queryRunner.dropForeignKey('email_deliveries', emailForeignKey);
            }
        }

        // Drop the email_delivery_status ENUM type if desired
        await queryRunner.query(`
            DROP TYPE IF EXISTS email_delivery_status;
        `);

        // Drop email_deliveries table
        await queryRunner.dropTable('email_deliveries');

        // Optionally, drop the uuid-ossp extension if it was created by this migration
        // Be cautious with this in environments where other tables might use it
        // await queryRunner.query(`DROP EXTENSION IF EXISTS "uuid-ossp"`);
    }
}

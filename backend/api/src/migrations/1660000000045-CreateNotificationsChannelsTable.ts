import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateNotificationsChannelsTable1660000000045 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Ensure uuid-ossp extension is enabled
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

        // Optionally, create ENUM types for status and type if not already present
        await queryRunner.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'channel_status') THEN
                    CREATE TYPE channel_status AS ENUM ('active', 'inactive');
                END IF;
            END$$;
        `);

        await queryRunner.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'channel_type') THEN
                    CREATE TYPE channel_type AS ENUM ('email', 'sms', 'push', 'webhook');
                END IF;
            END$$;
        `);

        // Create the notifications_channels table with additional fields
        await queryRunner.createTable(
            new Table({
                name: 'notifications_channels',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'channel_name',
                        type: 'varchar',
                        length: '100',
                        isUnique: true,
                        isNullable: false,
                    },
                    {
                        name: 'type',
                        type: 'channel_type',
                        isNullable: false,
                        default: `'email'`,
                    },
                    {
                        name: 'description',
                        type: 'text',
                        isNullable: true,
                    },
                    {
                        name: 'config',
                        type: 'json',
                        isNullable: true,
                    },
                    {
                        name: 'status',
                        type: 'channel_status',
                        isNullable: false,
                        default: `'active'`,
                    },
                    {
                        name: 'priority',
                        type: 'integer',
                        isNullable: true,
                        default: 1,
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

        // Since `channel_name` is unique, TypeORM already creates a unique index.
        // Therefore, creating an additional index on `channel_name` is redundant.

        // Optionally, create indexes on other fields if necessary
        await queryRunner.createIndex(
            'notifications_channels',
            new TableIndex({
                name: 'IDX_NOTIFICATIONS_CHANNELS_TYPE',
                columnNames: ['type'],
            })
        );

        await queryRunner.createIndex(
            'notifications_channels',
            new TableIndex({
                name: 'IDX_NOTIFICATIONS_CHANNELS_STATUS',
                columnNames: ['status'],
            })
        );

        await queryRunner.createIndex(
            'notifications_channels',
            new TableIndex({
                name: 'IDX_NOTIFICATIONS_CHANNELS_PRIORITY',
                columnNames: ['priority'],
            })
        );

        // Create trigger function for updating updated_at
        await queryRunner.query(`
            CREATE OR REPLACE FUNCTION update_notifications_channels_updated_at()
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.updated_at = now();
                RETURN NEW;
            END;
            $$ language 'plpgsql';
        `);

        // Create trigger for updating updated_at on row update
        await queryRunner.query(`
            CREATE TRIGGER trg_update_notifications_channels_updated_at
            BEFORE UPDATE ON notifications_channels
            FOR EACH ROW
            EXECUTE PROCEDURE update_notifications_channels_updated_at();
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop trigger and function
        await queryRunner.query(`DROP TRIGGER IF EXISTS trg_update_notifications_channels_updated_at ON notifications_channels`);
        await queryRunner.query(`DROP FUNCTION IF EXISTS update_notifications_channels_updated_at`);

        // Drop indexes
        await queryRunner.dropIndex('notifications_channels', 'IDX_NOTIFICATIONS_CHANNELS_PRIORITY');
        await queryRunner.dropIndex('notifications_channels', 'IDX_NOTIFICATIONS_CHANNELS_STATUS');
        await queryRunner.dropIndex('notifications_channels', 'IDX_NOTIFICATIONS_CHANNELS_TYPE');
        // Note: No need to drop the unique index on channel_name as dropping the table will remove it.

        // Drop ENUM types if desired
        await queryRunner.query(`
            DROP TYPE IF EXISTS channel_status;
        `);

        await queryRunner.query(`
            DROP TYPE IF EXISTS channel_type;
        `);

        // Drop notifications_channels table
        await queryRunner.dropTable('notifications_channels');

        // Optionally, drop the uuid-ossp extension if it was created by this migration
        // Be cautious with this in environments where other tables might use it
        // await queryRunner.query(`DROP EXTENSION IF EXISTS "uuid-ossp"`);
    }
}

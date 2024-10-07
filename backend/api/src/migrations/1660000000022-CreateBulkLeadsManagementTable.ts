import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateBulkLeadsManagementTable1660000000022 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Ensure uuid-ossp extension is enabled
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

        // Optionally, create ENUM type for lead_status if you have predefined statuses
        // Uncomment and modify the following block if ENUM types are desired
        /*
        await queryRunner.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'lead_status') THEN
                    CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'qualified', 'converted', 'closed');
                END IF;
            END$$;
        `);
        */

        // Create the bulk_leads_management table
        await queryRunner.createTable(
            new Table({
                name: 'bulk_leads_management',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'bulk_data',
                        type: 'jsonb',
                        isNullable: false,
                        comment: 'Stores bulk lead data in JSONB format',
                    },
                    {
                        name: 'campaign_id',
                        type: 'uuid',
                        isNullable: false,
                    },
                    {
                        name: 'team_id',
                        type: 'uuid',
                        isNullable: false,
                    },
                    {
                        name: 'user_id',
                        type: 'uuid',
                        isNullable: false,
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
            true // Indicates that the table should be created only if it doesn't exist
        );

        // Add foreign keys
        // Foreign Key for campaign_id
        await queryRunner.createForeignKey(
            'bulk_leads_management',
            new TableForeignKey({
                columnNames: ['campaign_id'],
                referencedTableName: 'campaigns',
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
            })
        );

        // Foreign Key for team_id
        await queryRunner.createForeignKey(
            'bulk_leads_management',
            new TableForeignKey({
                columnNames: ['team_id'],
                referencedTableName: 'teams',
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
            })
        );

        // Foreign Key for user_id
        await queryRunner.createForeignKey(
            'bulk_leads_management',
            new TableForeignKey({
                columnNames: ['user_id'],
                referencedTableName: 'users',
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
            })
        );

        // Create indexes
        // GIN Index on bulk_data for efficient JSONB querying
        await queryRunner.query(`
            CREATE INDEX "IDX_BULK_LEADS_BULK_DATA_GIN" 
            ON "bulk_leads_management" 
            USING GIN ("bulk_data");
        `);

        // Since TypeORM's TableIndex doesn't support specifying index type (like GIN) directly,
        // we'll create the GIN index using raw SQL
        await queryRunner.query(`
            CREATE INDEX "IDX_BULK_LEADS_BULK_DATA_GIN" 
            ON "bulk_leads_management" 
            USING GIN ("bulk_data");
        `);

        // Expression Indexes on specific JSONB fields
        await queryRunner.query(`
            CREATE INDEX "IDX_BULK_LEADS_FIRST_NAME" 
            ON "bulk_leads_management" 
            USING BTREE ((bulk_data->>'first_name'));
        `);

        await queryRunner.query(`
            CREATE INDEX "IDX_BULK_LEADS_LAST_NAME" 
            ON "bulk_leads_management" 
            USING BTREE ((bulk_data->>'last_name'));
        `);

        await queryRunner.query(`
            CREATE INDEX "IDX_BULK_LEADS_EMAIL" 
            ON "bulk_leads_management" 
            USING BTREE ((bulk_data->>'email'));
        `);

        // Indexes on relational fields
        await queryRunner.createIndex(
            'bulk_leads_management',
            new TableIndex({
                name: 'IDX_BULK_LEADS_CAMPAIGN_ID',
                columnNames: ['campaign_id'],
            })
        );

        await queryRunner.createIndex(
            'bulk_leads_management',
            new TableIndex({
                name: 'IDX_BULK_LEADS_TEAM_ID',
                columnNames: ['team_id'],
            })
        );

        await queryRunner.createIndex(
            'bulk_leads_management',
            new TableIndex({
                name: 'IDX_BULK_LEADS_USER_ID',
                columnNames: ['user_id'],
            })
        );

        // Create trigger function for updating updated_at
        await queryRunner.query(`
            CREATE OR REPLACE FUNCTION update_bulk_leads_management_updated_at()
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.updated_at = now();
                RETURN NEW;
            END;
            $$ language 'plpgsql';
        `);

        // Create trigger for updating updated_at on row update
        await queryRunner.query(`
            CREATE TRIGGER trg_update_bulk_leads_management_updated_at
            BEFORE UPDATE ON bulk_leads_management
            FOR EACH ROW
            EXECUTE PROCEDURE update_bulk_leads_management_updated_at();
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop trigger and function
        await queryRunner.query(`DROP TRIGGER IF EXISTS trg_update_bulk_leads_management_updated_at ON bulk_leads_management`);
        await queryRunner.query(`DROP FUNCTION IF EXISTS update_bulk_leads_management_updated_at`);

        // Drop indexes created via raw SQL first
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_BULK_LEADS_BULK_DATA_GIN"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_BULK_LEADS_FIRST_NAME"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_BULK_LEADS_LAST_NAME"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_BULK_LEADS_EMAIL"`);

        // Drop indexes on relational fields
        await queryRunner.dropIndex('bulk_leads_management', 'IDX_BULK_LEADS_USER_ID');
        await queryRunner.dropIndex('bulk_leads_management', 'IDX_BULK_LEADS_TEAM_ID');
        await queryRunner.dropIndex('bulk_leads_management', 'IDX_BULK_LEADS_CAMPAIGN_ID');

        // Drop the bulk_leads_management table
        await queryRunner.dropTable('bulk_leads_management');

        // Optionally, drop the ENUM type for lead_status if it was created by this migration
        // Uncomment if you created ENUM types in the up migration
        /*
        await queryRunner.query(`
            DROP TYPE IF EXISTS lead_status;
        `);
        */

        // Optionally, drop the uuid-ossp extension if it was created by this migration
        // Be cautious with this in environments where other tables might use it
        // await queryRunner.query(`DROP EXTENSION IF EXISTS "uuid-ossp"`);
    }
}

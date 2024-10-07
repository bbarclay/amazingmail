import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateLeadsTable1660000000018 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Ensure uuid-ossp extension is enabled
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

        // Create ENUM type for lead_status if not exists
        await queryRunner.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'lead_status') THEN
                    CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'qualified', 'converted', 'closed');
                END IF;
            END$$;
        `);

        // Create the leads table with separate first and last name fields
        await queryRunner.createTable(
            new Table({
                name: 'leads',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'first_name',
                        type: 'varchar',
                        length: '100',
                        isNullable: false,
                    },
                    {
                        name: 'last_name',
                        type: 'varchar',
                        length: '100',
                        isNullable: false,
                    },
                    {
                        name: 'email',
                        type: 'varchar',
                        length: '255',
                        isUnique: true,
                        isNullable: false,
                    },
                    {
                        name: 'company',
                        type: 'varchar',
                        length: '255',
                        isNullable: true,
                    },
                    {
                        name: 'job_title',
                        type: 'varchar',
                        length: '255',
                        isNullable: true,
                    },
                    {
                        name: 'phone',
                        type: 'varchar',
                        length: '20',
                        isNullable: true,
                    },
                    {
                        name: 'status',
                        type: 'lead_status',
                        isNullable: false,
                        default: `'new'`,
                    },
                    {
                        name: 'source',
                        type: 'varchar',
                        length: '100',
                        isNullable: true,
                    },
                    {
                        name: 'notes',
                        type: 'text',
                        isNullable: true,
                    },
                    {
                        name: 'last_contacted',
                        type: 'timestamp',
                        isNullable: true,
                    },
                    {
                        name: 'priority',
                        type: 'integer',
                        isNullable: true,
                        default: 1,
                    },
                    {
                        name: 'additional_data',
                        type: 'json',
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

        // Create indexes on status and company
        await queryRunner.createIndex(
            'leads',
            new TableIndex({
                name: 'IDX_LEADS_STATUS',
                columnNames: ['status'],
            })
        );

        await queryRunner.createIndex(
            'leads',
            new TableIndex({
                name: 'IDX_LEADS_COMPANY',
                columnNames: ['company'],
            })
        );

        // Create trigger function for updating updated_at
        await queryRunner.query(`
            CREATE OR REPLACE FUNCTION update_leads_updated_at()
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.updated_at = now();
                RETURN NEW;
            END;
            $$ language 'plpgsql';
        `);

        // Create trigger for updating updated_at on row update
        await queryRunner.query(`
            CREATE TRIGGER trg_update_leads_updated_at
            BEFORE UPDATE ON leads
            FOR EACH ROW
            EXECUTE PROCEDURE update_leads_updated_at();
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop trigger and function
        await queryRunner.query(`DROP TRIGGER IF EXISTS trg_update_leads_updated_at ON leads`);
        await queryRunner.query(`DROP FUNCTION IF EXISTS update_leads_updated_at`);

        // Drop indexes
        await queryRunner.dropIndex('leads', 'IDX_LEADS_COMPANY');
        await queryRunner.dropIndex('leads', 'IDX_LEADS_STATUS');
        // Note: No need to drop the unique index on email as dropping the table will remove it.

        // Drop ENUM type for lead_status if desired
        await queryRunner.query(`
            DROP TYPE IF EXISTS lead_status;
        `);

        // Drop leads table
        await queryRunner.dropTable('leads');

        // Optionally, drop the uuid-ossp extension if it was created by this migration
        // Be cautious with this in environments where other tables might use it
        // await queryRunner.query(`DROP EXTENSION IF EXISTS "uuid-ossp"`);
    }
}

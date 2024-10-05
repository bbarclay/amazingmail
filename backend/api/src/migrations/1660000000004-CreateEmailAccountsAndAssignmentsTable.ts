import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex, TableUnique } from 'typeorm';

export class CreateEmailAccountsAndAssignmentsTable1660000000004 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Ensure uuid-ossp extension is enabled
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

        // Create the email_accounts table
        await queryRunner.createTable(
            new Table({
                name: 'email_accounts',
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
                        length: '255',
                        isUnique: true,
                        isNullable: false,
                    },
                    {
                        name: 'password', // Consider storing hashed passwords
                        type: 'varchar',
                        length: '255',
                        isNullable: false,
                    },
                    {
                        name: 'daily_limit',
                        type: 'integer',
                        isNullable: false,
                        default: 1000,
                    },
                    {
                        name: 'status',
                        type: 'varchar',
                        length: '50',
                        isNullable: false,
                        default: `'active'`, // Possible values: 'active', 'inactive'
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
            true
        );

        // Create indexes on email and status
        await queryRunner.createIndex('email_accounts', new TableIndex({
            name: 'IDX_EMAIL_ACCOUNTS_EMAIL',
            columnNames: ['email'],
        }));

        await queryRunner.createIndex('email_accounts', new TableIndex({
            name: 'IDX_EMAIL_ACCOUNTS_STATUS',
            columnNames: ['status'],
        }));

        // Create the email_account_campaigns join table
        await queryRunner.createTable(
            new Table({
                name: 'email_account_campaigns',
                columns: [
                    {
                        name: 'email_account_id',
                        type: 'uuid',
                        isPrimary: true,
                    },
                    {
                        name: 'campaign_id',
                        type: 'uuid',
                        isPrimary: true,
                    },
                ],
            }),
            true
        );

        // Add foreign keys to email_account_campaigns table
        await queryRunner.createForeignKey('email_account_campaigns', new TableForeignKey({
            name: 'FK_EMAIL_ACCOUNT_CAMPAIGN_EMAIL_ACCOUNT',
            columnNames: ['email_account_id'],
            referencedTableName: 'email_accounts',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
        }));

        await queryRunner.createForeignKey('email_account_campaigns', new TableForeignKey({
            name: 'FK_EMAIL_ACCOUNT_CAMPAIGN_CAMPAIGN',
            columnNames: ['campaign_id'],
            referencedTableName: 'campaigns', // Ensure the campaigns table exists
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
        }));

        // Create unique constraint to prevent duplicate assignments
        await queryRunner.createUniqueConstraint('email_account_campaigns', new TableUnique({
            name: 'UQ_EMAIL_ACCOUNT_CAMPAIGN',
            columnNames: ['email_account_id', 'campaign_id'],
        }));

        // Optionally, create indexes on join table for performance
        await queryRunner.createIndex('email_account_campaigns', new TableIndex({
            name: 'IDX_EMAIL_ACCOUNT_CAMPAIGN_EMAIL_ACCOUNT_ID',
            columnNames: ['email_account_id'],
        }));

        await queryRunner.createIndex('email_account_campaigns', new TableIndex({
            name: 'IDX_EMAIL_ACCOUNT_CAMPAIGN_CAMPAIGN_ID',
            columnNames: ['campaign_id'],
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop indexes on email_account_campaigns
        await queryRunner.dropIndex('email_account_campaigns', 'IDX_EMAIL_ACCOUNT_CAMPAIGN_CAMPAIGN_ID');
        await queryRunner.dropIndex('email_account_campaigns', 'IDX_EMAIL_ACCOUNT_CAMPAIGN_EMAIL_ACCOUNT_ID');

        // Drop unique constraint
        await queryRunner.dropUniqueConstraint('email_account_campaigns', 'UQ_EMAIL_ACCOUNT_CAMPAIGN');

        // Drop foreign keys from email_account_campaigns
        const emailAccountCampaignsTable = await queryRunner.getTable('email_account_campaigns');
        if (emailAccountCampaignsTable) {
            const foreignKeys = emailAccountCampaignsTable.foreignKeys;
            for (const fk of foreignKeys) {
                await queryRunner.dropForeignKey('email_account_campaigns', fk);
            }
        }

        // Drop email_account_campaigns table
        await queryRunner.dropTable('email_account_campaigns');

        // Drop indexes on email_accounts
        await queryRunner.dropIndex('email_accounts', 'IDX_EMAIL_ACCOUNTS_STATUS');
        await queryRunner.dropIndex('email_accounts', 'IDX_EMAIL_ACCOUNTS_EMAIL');

        // Drop email_accounts table
        await queryRunner.dropTable('email_accounts');
    }
}

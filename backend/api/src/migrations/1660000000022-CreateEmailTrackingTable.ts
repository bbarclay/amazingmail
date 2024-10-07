import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateEmailTrackingTable1660000000022 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'email_tracking',
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
                    name: 'campaign_id',
                    type: 'uuid',
                    isNullable: false,
                },
                {
                    name: 'user_id',
                    type: 'uuid',
                    isNullable: false,
                },
                {
                    name: 'recipient_email',
                    type: 'varchar',
                    isNullable: false,
                },
                {
                    name: 'sent_at',
                    type: 'timestamp',
                    isNullable: false,
                    default: 'CURRENT_TIMESTAMP',
                },
                {
                    name: 'opened_at',
                    type: 'timestamp',
                    isNullable: true,
                },
                {
                    name: 'clicked_at',
                    type: 'timestamp',
                    isNullable: true,
                },
                {
                    name: 'bounced_at',
                    type: 'timestamp',
                    isNullable: true,
                },
                {
                    name: 'unsubscribed_at',
                    type: 'timestamp',
                    isNullable: true,
                },
                {
                    name: 'ip_address',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'user_agent',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'status',
                    type: 'varchar',
                    isNullable: false,
                    default: "'sent'",
                },
                {
                    name: 'created_at',
                    type: 'timestamp',
                    isNullable: false,
                    default: 'CURRENT_TIMESTAMP',
                },
                {
                    name: 'updated_at',
                    type: 'timestamp',
                    isNullable: false,
                    default: 'CURRENT_TIMESTAMP',
                    onUpdate: 'CURRENT_TIMESTAMP',
                },
            ],
        }));

        // Add foreign key for email_id
        await queryRunner.createForeignKey('email_tracking', new TableForeignKey({
            columnNames: ['email_id'],
            referencedTableName: 'emails',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
        }));

        // Add foreign key for campaign_id
        await queryRunner.createForeignKey('email_tracking', new TableForeignKey({
            columnNames: ['campaign_id'],
            referencedTableName: 'campaigns',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
        }));

        // Add foreign key for user_id
        await queryRunner.createForeignKey('email_tracking', new TableForeignKey({
            columnNames: ['user_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
        }));

        // Add indexes
        await queryRunner.createIndex('email_tracking', new TableIndex({
            name: 'IDX_EMAIL_TRACKING_EMAIL_ID',
            columnNames: ['email_id'],
        }));

        await queryRunner.createIndex('email_tracking', new TableIndex({
            name: 'IDX_EMAIL_TRACKING_CAMPAIGN_ID',
            columnNames: ['campaign_id'],
        }));

        await queryRunner.createIndex('email_tracking', new TableIndex({
            name: 'IDX_EMAIL_TRACKING_USER_ID',
            columnNames: ['user_id'],
        }));

        await queryRunner.createIndex('email_tracking', new TableIndex({
            name: 'IDX_EMAIL_TRACKING_RECIPIENT_EMAIL',
            columnNames: ['recipient_email'],
        }));

        await queryRunner.createIndex('email_tracking', new TableIndex({
            name: 'IDX_EMAIL_TRACKING_STATUS',
            columnNames: ['status'],
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop indexes
        await queryRunner.dropIndex('email_tracking', 'IDX_EMAIL_TRACKING_EMAIL_ID');
        await queryRunner.dropIndex('email_tracking', 'IDX_EMAIL_TRACKING_CAMPAIGN_ID');
        await queryRunner.dropIndex('email_tracking', 'IDX_EMAIL_TRACKING_USER_ID');
        await queryRunner.dropIndex('email_tracking', 'IDX_EMAIL_TRACKING_RECIPIENT_EMAIL');
        await queryRunner.dropIndex('email_tracking', 'IDX_EMAIL_TRACKING_STATUS');

        // Drop foreign keys from email_tracking
        const table = await queryRunner.getTable('email_tracking');
        const emailForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('email_id') !== -1);
        if (emailForeignKey) {
            await queryRunner.dropForeignKey('email_tracking', emailForeignKey);
        }

        const campaignForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('campaign_id') !== -1);
        if (campaignForeignKey) {
            await queryRunner.dropForeignKey('email_tracking', campaignForeignKey);
        }

        const userForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('user_id') !== -1);
        if (userForeignKey) {
            await queryRunner.dropForeignKey('email_tracking', userForeignKey);
        }

        // Drop email_tracking table
        await queryRunner.dropTable('email_tracking');
    }
}

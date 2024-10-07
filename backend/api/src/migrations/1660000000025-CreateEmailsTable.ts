import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateEmailsTable1660000000025 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'emails',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()',
                },
                {
                    name: 'subject',
                    type: 'varchar',
                    isNullable: false,
                },
                {
                    name: 'body',
                    type: 'text',
                    isNullable: false,
                },
                {
                    name: 'recipient',
                    type: 'varchar',
                    isNullable: false,
                },
                {
                    name: 'sender',
                    type: 'varchar',
                    isNullable: false,
                },
                {
                    name: 'status',
                    type: 'varchar',
                    isNullable: false,
                    default: "'pending'",
                },
                {
                    name: 'sent_at',
                    type: 'timestamp',
                    isNullable: true,
                },
                {
                    name: 'campaign_id',
                    type: 'uuid',
                    isNullable: true,
                },
                {
                    name: 'template_id',
                    type: 'uuid',
                    isNullable: true,
                },
                {
                    name: 'user_id',
                    type: 'uuid',
                    isNullable: false,
                },
                {
                    name: 'created_at',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
                    isNullable: false,
                },
                {
                    name: 'updated_at',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
                    onUpdate: 'CURRENT_TIMESTAMP',
                    isNullable: false,
                },
            ],
        }));

        // Add foreign key for campaign_id
        await queryRunner.createForeignKey('emails', new TableForeignKey({
            columnNames: ['campaign_id'],
            referencedTableName: 'campaigns',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
        }));

        // Add foreign key for template_id
        await queryRunner.createForeignKey('emails', new TableForeignKey({
            columnNames: ['template_id'],
            referencedTableName: 'templates',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
        }));

        // Add foreign key for user_id
        await queryRunner.createForeignKey('emails', new TableForeignKey({
            columnNames: ['user_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
        }));

        // Add indexes
        await queryRunner.createIndex('emails', new TableIndex({
            name: 'IDX_EMAILS_RECIPIENT',
            columnNames: ['recipient'],
        }));

        await queryRunner.createIndex('emails', new TableIndex({
            name: 'IDX_EMAILS_STATUS',
            columnNames: ['status'],
        }));

        await queryRunner.createIndex('emails', new TableIndex({
            name: 'IDX_EMAILS_CAMPAIGN_ID',
            columnNames: ['campaign_id'],
        }));

        await queryRunner.createIndex('emails', new TableIndex({
            name: 'IDX_EMAILS_USER_ID',
            columnNames: ['user_id'],
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop indexes
        await queryRunner.dropIndex('emails', 'IDX_EMAILS_RECIPIENT');
        await queryRunner.dropIndex('emails', 'IDX_EMAILS_STATUS');
        await queryRunner.dropIndex('emails', 'IDX_EMAILS_CAMPAIGN_ID');
        await queryRunner.dropIndex('emails', 'IDX_EMAILS_USER_ID');

        // Drop foreign keys from emails
        const table = await queryRunner.getTable('emails');
        const campaignForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('campaign_id') !== -1);
        if (campaignForeignKey) {
            await queryRunner.dropForeignKey('emails', campaignForeignKey);
        }
        const templateForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('template_id') !== -1);
        if (templateForeignKey) {
            await queryRunner.dropForeignKey('emails', templateForeignKey);
        }
        const userForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('user_id') !== -1);
        if (userForeignKey) {
            await queryRunner.dropForeignKey('emails', userForeignKey);
        }

        // Drop emails table
        await queryRunner.dropTable('emails');
    }
}

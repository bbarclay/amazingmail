import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

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
        },
        {
            name: 'body',
            type: 'text',
        },
        {
            name: 'recipient',
            type: 'varchar',
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
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
        },
    ],
}));

// # Add foreign key for campaign_id
await queryRunner.createForeignKey('emails', new TableForeignKey({
    columnNames: ['campaign_id'],
    referencedTableName: 'campaigns',
    referencedColumnNames: ['id'],
    onDelete: 'SET NULL',
}));

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
// # Drop foreign key from emails
const table = await queryRunner.getTable('emails');
const campaignForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('campaign_id') !== -1);
if (campaignForeignKey) {
    await queryRunner.dropForeignKey('emails', campaignForeignKey);
}

// # Drop emails table
await queryRunner.dropTable('emails');

    }
}

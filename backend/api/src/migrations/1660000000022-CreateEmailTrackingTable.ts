import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

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
        },
        {
            name: 'campaign_id',
            type: 'uuid',
        },
        {
            name: 'user_id',
            type: 'uuid',
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
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
        },
    ],
}));

// # Add foreign key for email_id
await queryRunner.createForeignKey('email_tracking', new TableForeignKey({
    columnNames: ['email_id'],
    referencedTableName: 'emails',
    referencedColumnNames: ['id'],
    onDelete: 'CASCADE',
}));

// # Add foreign key for campaign_id
await queryRunner.createForeignKey('email_tracking', new TableForeignKey({
    columnNames: ['campaign_id'],
    referencedTableName: 'campaigns',
    referencedColumnNames: ['id'],
    onDelete: 'SET NULL',
}));

// # Add foreign key for user_id
await queryRunner.createForeignKey('email_tracking', new TableForeignKey({
    columnNames: ['user_id'],
    referencedTableName: 'users',
    referencedColumnNames: ['id'],
    onDelete: 'CASCADE',
}));

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
// # Drop foreign keys from email_tracking
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

// # Drop email_tracking table
await queryRunner.dropTable('email_tracking');

    }
}

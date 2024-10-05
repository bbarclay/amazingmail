import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateAnalyticsTable1660000000028 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        
await queryRunner.createTable(new Table({
    name: 'analytics',
    columns: [
        {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
        },
        {
            name: 'metric',
            type: 'varchar',
        },
        {
            name: 'value',
            type: 'decimal',
        },
        {
            name: 'campaign_id',
            type: 'uuid',
            isNullable: true,
        },
        {
            name: 'user_id',
            type: 'uuid',
        },
        {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
        },
    ],
}));

// # Add foreign key for campaign_id
await queryRunner.createForeignKey('analytics', new TableForeignKey({
    columnNames: ['campaign_id'],
    referencedTableName: 'campaigns',
    referencedColumnNames: ['id'],
    onDelete: 'SET NULL',
}));

// # Add foreign key for user_id
await queryRunner.createForeignKey('analytics', new TableForeignKey({
    columnNames: ['user_id'],
    referencedTableName: 'users',
    referencedColumnNames: ['id'],
    onDelete: 'CASCADE',
}));

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
// # Drop foreign keys from analytics
const table = await queryRunner.getTable('analytics');
const campaignForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('campaign_id') !== -1);
if (campaignForeignKey) {
    await queryRunner.dropForeignKey('analytics', campaignForeignKey);
}

const userForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('user_id') !== -1);
if (userForeignKey) {
    await queryRunner.dropForeignKey('analytics', userForeignKey);
}

// # Drop analytics table
await queryRunner.dropTable('analytics');

    }
}

import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateReportsTable1660000000021 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        
await queryRunner.createTable(new Table({
    name: 'reports',
    columns: [
        {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
        },
        {
            name: 'name',
            type: 'varchar',
        },
        {
            name: 'data',
            type: 'json',
        },
        {
            name: 'user_id',
            type: 'uuid',
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

// # Add foreign key for user_id
await queryRunner.createForeignKey('reports', new TableForeignKey({
    columnNames: ['user_id'],
    referencedTableName: 'users',
    referencedColumnNames: ['id'],
    onDelete: 'CASCADE',
}));

// # Add foreign key for campaign_id
await queryRunner.createForeignKey('reports', new TableForeignKey({
    columnNames: ['campaign_id'],
    referencedTableName: 'campaigns',
    referencedColumnNames: ['id'],
    onDelete: 'SET NULL',
}));

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
// # Drop foreign keys from reports
const table = await queryRunner.getTable('reports');
const userForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('user_id') !== -1);
if (userForeignKey) {
    await queryRunner.dropForeignKey('reports', userForeignKey);
}

const campaignForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('campaign_id') !== -1);
if (campaignForeignKey) {
    await queryRunner.dropForeignKey('reports', campaignForeignKey);
}

// # Drop reports table
await queryRunner.dropTable('reports');

    }
}

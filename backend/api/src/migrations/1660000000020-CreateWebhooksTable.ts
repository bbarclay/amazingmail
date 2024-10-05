import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateWebhooksTable1660000000020 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        
await queryRunner.createTable(new Table({
    name: 'webhooks',
    columns: [
        {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
        },
        {
            name: 'url',
            type: 'varchar',
        },
        {
            name: 'event',
            type: 'varchar',
        },
        {
            name: 'payload',
            type: 'json',
            isNullable: true,
        },
        {
            name: 'organization_id',
            type: 'uuid',
        },
        {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
        },
    ],
}));

// # Add foreign key for organization_id
await queryRunner.createForeignKey('webhooks', new TableForeignKey({
    columnNames: ['organization_id'],
    referencedTableName: 'organizations',
    referencedColumnNames: ['id'],
    onDelete: 'CASCADE',
}));

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
// # Drop foreign key from webhooks
const table = await queryRunner.getTable('webhooks');
const orgForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('organization_id') !== -1);
if (orgForeignKey) {
    await queryRunner.dropForeignKey('webhooks', orgForeignKey);
}

// # Drop webhooks table
await queryRunner.dropTable('webhooks');

    }
}

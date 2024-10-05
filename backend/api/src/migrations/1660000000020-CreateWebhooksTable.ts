import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

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
                    isNullable: false,
                },
                {
                    name: 'event',
                    type: 'varchar',
                    isNullable: false,
                },
                {
                    name: 'payload',
                    type: 'json',
                    isNullable: true,
                },
                {
                    name: 'status',
                    type: 'varchar',
                    isNullable: false,
                    default: "'active'",
                },
                {
                    name: 'secret',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'last_triggered',
                    type: 'timestamp',
                    isNullable: true,
                },
                {
                    name: 'organization_id',
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

        // Add foreign key for organization_id
        await queryRunner.createForeignKey('webhooks', new TableForeignKey({
            columnNames: ['organization_id'],
            referencedTableName: 'organizations',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
        }));

        // Add indexes
        await queryRunner.createIndex('webhooks', new TableIndex({
            name: 'IDX_WEBHOOKS_EVENT',
            columnNames: ['event'],
        }));

        await queryRunner.createIndex('webhooks', new TableIndex({
            name: 'IDX_WEBHOOKS_STATUS',
            columnNames: ['status'],
        }));

        await queryRunner.createIndex('webhooks', new TableIndex({
            name: 'IDX_WEBHOOKS_ORGANIZATION_ID',
            columnNames: ['organization_id'],
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop indexes
        await queryRunner.dropIndex('webhooks', 'IDX_WEBHOOKS_EVENT');
        await queryRunner.dropIndex('webhooks', 'IDX_WEBHOOKS_STATUS');
        await queryRunner.dropIndex('webhooks', 'IDX_WEBHOOKS_ORGANIZATION_ID');

        // Drop foreign key from webhooks
        const table = await queryRunner.getTable('webhooks');
        const orgForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('organization_id') !== -1);
        if (orgForeignKey) {
            await queryRunner.dropForeignKey('webhooks', orgForeignKey);
        }

        // Drop webhooks table
        await queryRunner.dropTable('webhooks');
    }
}

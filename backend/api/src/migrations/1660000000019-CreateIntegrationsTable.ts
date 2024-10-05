import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateIntegrationsTable1660000000019 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'integrations',
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
                    isUnique: true,
                    isNullable: false,
                },
                {
                    name: 'type',
                    type: 'varchar',
                    isNullable: false,
                },
                {
                    name: 'config',
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
                    name: 'last_sync',
                    type: 'timestamp',
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

        // Add foreign key for user_id
        await queryRunner.createForeignKey('integrations', new TableForeignKey({
            columnNames: ['user_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
        }));

        // Add indexes
        await queryRunner.createIndex('integrations', new TableIndex({
            name: 'IDX_INTEGRATIONS_NAME',
            columnNames: ['name'],
        }));

        await queryRunner.createIndex('integrations', new TableIndex({
            name: 'IDX_INTEGRATIONS_TYPE',
            columnNames: ['type'],
        }));

        await queryRunner.createIndex('integrations', new TableIndex({
            name: 'IDX_INTEGRATIONS_USER_ID',
            columnNames: ['user_id'],
        }));

        await queryRunner.createIndex('integrations', new TableIndex({
            name: 'IDX_INTEGRATIONS_STATUS',
            columnNames: ['status'],
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop indexes
        await queryRunner.dropIndex('integrations', 'IDX_INTEGRATIONS_NAME');
        await queryRunner.dropIndex('integrations', 'IDX_INTEGRATIONS_TYPE');
        await queryRunner.dropIndex('integrations', 'IDX_INTEGRATIONS_USER_ID');
        await queryRunner.dropIndex('integrations', 'IDX_INTEGRATIONS_STATUS');

        // Drop foreign key from integrations
        const table = await queryRunner.getTable('integrations');
        const userForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('user_id') !== -1);
        if (userForeignKey) {
            await queryRunner.dropForeignKey('integrations', userForeignKey);
        }

        // Drop integrations table
        await queryRunner.dropTable('integrations');
    }
}

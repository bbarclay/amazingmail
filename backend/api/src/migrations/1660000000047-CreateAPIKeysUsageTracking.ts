import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateAPIKeysUsageTracking1660000000047 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'api_keys_usage',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()',
                },
                {
                    name: 'api_key_id',
                    type: 'uuid',
                },
                {
                    name: 'endpoint',
                    type: 'varchar',
                },
                {
                    name: 'request_count',
                    type: 'integer',
                    default: 0,
                },
                {
                    name: 'timestamp',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
                },
                {
                    name: 'updated_at',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
                    onUpdate: 'CURRENT_TIMESTAMP',
                },
            ],
        }));

        // Add foreign key for api_key_id
        await queryRunner.createForeignKey('api_keys_usage', new TableForeignKey({
            columnNames: ['api_key_id'],
            referencedTableName: 'api_keys',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
        }));

        // Add index for api_key_id
        await queryRunner.createIndex('api_keys_usage', new TableIndex({
            name: 'IDX_API_KEYS_USAGE_API_KEY_ID',
            columnNames: ['api_key_id'],
        }));

        // Add index for endpoint
        await queryRunner.createIndex('api_keys_usage', new TableIndex({
            name: 'IDX_API_KEYS_USAGE_ENDPOINT',
            columnNames: ['endpoint'],
        }));

        // Add index for timestamp
        await queryRunner.createIndex('api_keys_usage', new TableIndex({
            name: 'IDX_API_KEYS_USAGE_TIMESTAMP',
            columnNames: ['timestamp'],
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop indexes
        await queryRunner.dropIndex('api_keys_usage', 'IDX_API_KEYS_USAGE_TIMESTAMP');
        await queryRunner.dropIndex('api_keys_usage', 'IDX_API_KEYS_USAGE_ENDPOINT');
        await queryRunner.dropIndex('api_keys_usage', 'IDX_API_KEYS_USAGE_API_KEY_ID');

        // Drop foreign key from api_keys_usage
        const table = await queryRunner.getTable('api_keys_usage');
        const apiKeyForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('api_key_id') !== -1);
        if (apiKeyForeignKey) {
            await queryRunner.dropForeignKey('api_keys_usage', apiKeyForeignKey);
        }

        // Drop api_keys_usage table
        await queryRunner.dropTable('api_keys_usage');
    }
}

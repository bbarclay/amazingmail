import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

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
    ],
}));

// # Add foreign key for api_key_id
await queryRunner.createForeignKey('api_keys_usage', new TableForeignKey({
    columnNames: ['api_key_id'],
    referencedTableName: 'api_keys',
    referencedColumnNames: ['id'],
    onDelete: 'CASCADE',
}));

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
// # Drop foreign key from api_keys_usage
const table = await queryRunner.getTable('api_keys_usage');
const apiKeyForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('api_key_id') !== -1);
if (apiKeyForeignKey) {
    await queryRunner.dropForeignKey('api_keys_usage', apiKeyForeignKey);
}

// # Drop api_keys_usage table
await queryRunner.dropTable('api_keys_usage');

    }
}

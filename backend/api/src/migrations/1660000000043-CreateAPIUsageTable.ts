import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateAPIUsageTable1660000000043 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'api_usage',
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
                    name: 'method',
                    type: 'varchar',
                },
                {
                    name: 'request_count',
                    type: 'integer',
                    default: 0,
                },
                {
                    name: 'response_time',
                    type: 'integer',
                    comment: 'Average response time in milliseconds',
                },
                {
                    name: 'status_code',
                    type: 'integer',
                },
                {
                    name: 'ip_address',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'user_agent',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'timestamp',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
                },
                {
                    name: 'created_at',
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
            indices: [
                {
                    name: 'IDX_api_usage_api_key_id',
                    columnNames: ['api_key_id'],
                },
                {
                    name: 'IDX_api_usage_endpoint',
                    columnNames: ['endpoint'],
                },
                {
                    name: 'IDX_api_usage_timestamp',
                    columnNames: ['timestamp'],
                },
            ],
        }));

        // Add foreign key for api_key_id
        await queryRunner.createForeignKey('api_usage', new TableForeignKey({
            columnNames: ['api_key_id'],
            referencedTableName: 'api_keys',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable('api_usage');
        const foreignKeys = table.foreignKeys;

        for (const foreignKey of foreignKeys) {
            await queryRunner.dropForeignKey('api_usage', foreignKey);
        }

        await queryRunner.dropTable('api_usage');
    }
}

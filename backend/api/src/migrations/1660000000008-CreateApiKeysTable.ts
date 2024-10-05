import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateApiKeysTable1660000000008 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'api_keys',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()',
                },
                {
                    name: 'key',
                    type: 'varchar',
                    isUnique: true,
                },
                {
                    name: 'description',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'user_id',
                    type: 'uuid',
                },
                {
                    name: 'is_active',
                    type: 'boolean',
                    default: true,
                },
                {
                    name: 'expires_at',
                    type: 'timestamp',
                    isNullable: true,
                },
                {
                    name: 'last_used_at',
                    type: 'timestamp',
                    isNullable: true,
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
                },
            ],
        }));

        // Add foreign key for user_id
        await queryRunner.createForeignKey('api_keys', new TableForeignKey({
            columnNames: ['user_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
        }));

        // Create index for the 'key' column
        await queryRunner.createIndex('api_keys', new TableIndex({
            name: 'IDX_API_KEYS_KEY',
            columnNames: ['key'],
        }));

        // Create index for the 'user_id' column
        await queryRunner.createIndex('api_keys', new TableIndex({
            name: 'IDX_API_KEYS_USER_ID',
            columnNames: ['user_id'],
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop indexes
        await queryRunner.dropIndex('api_keys', 'IDX_API_KEYS_KEY');
        await queryRunner.dropIndex('api_keys', 'IDX_API_KEYS_USER_ID');

        // Drop foreign key from api_keys
        const table = await queryRunner.getTable('api_keys');
        const userForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('user_id') !== -1);
        if (userForeignKey) {
            await queryRunner.dropForeignKey('api_keys', userForeignKey);
        }

        // Drop api_keys table
        await queryRunner.dropTable('api_keys');
    }
}

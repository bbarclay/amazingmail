import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateConnectedAccountsTable1660000000009 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'connected_accounts',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()',
                },
                {
                    name: 'user_id',
                    type: 'uuid',
                },
                {
                    name: 'account_type',
                    type: 'varchar',
                },
                {
                    name: 'account_id',
                    type: 'varchar',
                },
                {
                    name: 'access_token',
                    type: 'varchar',
                },
                {
                    name: 'refresh_token',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'account_details',
                    type: 'json',
                    isNullable: true,
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
        await queryRunner.createForeignKey('connected_accounts', new TableForeignKey({
            columnNames: ['user_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
        }));

        // Add index for user_id
        await queryRunner.createIndex('connected_accounts', new TableIndex({
            name: 'IDX_CONNECTED_ACCOUNTS_USER_ID',
            columnNames: ['user_id'],
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop foreign key from connected_accounts
        const table = await queryRunner.getTable('connected_accounts');
        const userForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('user_id') !== -1);
        if (userForeignKey) {
            await queryRunner.dropForeignKey('connected_accounts', userForeignKey);
        }

        // Drop connected_accounts table
        await queryRunner.dropTable('connected_accounts');
    }
}

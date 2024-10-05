import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateOAuthTokensTable1660000000039 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'oauth_tokens',
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
                    name: 'provider_id',
                    type: 'uuid',
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
                    name: 'scope',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'expires_at',
                    type: 'timestamp',
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
                    name: 'IDX_oauth_tokens_user_id',
                    columnNames: ['user_id'],
                },
                {
                    name: 'IDX_oauth_tokens_provider_id',
                    columnNames: ['provider_id'],
                },
            ],
        }));

        // Add foreign key for user_id
        await queryRunner.createForeignKey('oauth_tokens', new TableForeignKey({
            columnNames: ['user_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
        }));

        // Add foreign key for provider_id
        await queryRunner.createForeignKey('oauth_tokens', new TableForeignKey({
            columnNames: ['provider_id'],
            referencedTableName: 'sso_providers',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable('oauth_tokens');
        const foreignKeys = table.foreignKeys;

        for (const foreignKey of foreignKeys) {
            await queryRunner.dropForeignKey('oauth_tokens', foreignKey);
        }

        await queryRunner.dropTable('oauth_tokens');
    }
}

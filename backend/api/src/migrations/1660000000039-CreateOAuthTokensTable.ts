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
            name: 'expires_at',
            type: 'timestamp',
        },
        {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
        },
    ],
}));

// # Add foreign key for user_id
await queryRunner.createForeignKey('oauth_tokens', new TableForeignKey({
    columnNames: ['user_id'],
    referencedTableName: 'users',
    referencedColumnNames: ['id'],
    onDelete: 'CASCADE',
}));

// # Add foreign key for provider_id
await queryRunner.createForeignKey('oauth_tokens', new TableForeignKey({
    columnNames: ['provider_id'],
    referencedTableName: 'sso_providers',
    referencedColumnNames: ['id'],
    onDelete: 'CASCADE',
}));

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
// # Drop foreign keys from oauth_tokens
const table = await queryRunner.getTable('oauth_tokens');
const userForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('user_id') !== -1);
if (userForeignKey) {
    await queryRunner.dropForeignKey('oauth_tokens', userForeignKey);
}

const providerForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('provider_id') !== -1);
if (providerForeignKey) {
    await queryRunner.dropForeignKey('oauth_tokens', providerForeignKey);
}

// # Drop oauth_tokens table and sso_providers table if needed
await queryRunner.dropTable('oauth_tokens');
// # Optionally, drop sso_providers table if not needed elsewhere
// # await queryRunner.dropTable('sso_providers');

    }
}

import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateSSOProvidersTable1660000000038 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'sso_providers',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()',
                },
                {
                    name: 'provider_name',
                    type: 'varchar',
                    isUnique: true,
                },
                {
                    name: 'client_id',
                    type: 'varchar',
                },
                {
                    name: 'client_secret',
                    type: 'varchar',
                },
                {
                    name: 'redirect_uri',
                    type: 'varchar',
                },
                {
                    name: 'scopes',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'auth_url',
                    type: 'varchar',
                },
                {
                    name: 'token_url',
                    type: 'varchar',
                },
                {
                    name: 'user_info_url',
                    type: 'varchar',
                },
                {
                    name: 'is_active',
                    type: 'boolean',
                    default: true,
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
                    name: 'IDX_sso_providers_provider_name',
                    columnNames: ['provider_name'],
                },
            ],
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('sso_providers');
    }
}

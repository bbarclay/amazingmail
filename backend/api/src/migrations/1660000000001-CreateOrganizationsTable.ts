import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateOrganizationsTable1660000000001 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'organizations',
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
                },
                {
                    name: 'description',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'logo_url',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'website',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'industry',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'owner_id',
                    type: 'uuid',
                    isNullable: true,
                },
                {
                    name: 'status',
                    type: 'varchar',
                    default: "'active'",
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
        }));

        // Create index for the 'name' column
        await queryRunner.createIndex('organizations', new TableIndex({
            name: 'IDX_ORGANIZATIONS_NAME',
            columnNames: ['name'],
        }));

        // Create index for the 'industry' column
        await queryRunner.createIndex('organizations', new TableIndex({
            name: 'IDX_ORGANIZATIONS_INDUSTRY',
            columnNames: ['industry'],
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop indices
        await queryRunner.dropIndex('organizations', 'IDX_ORGANIZATIONS_NAME');
        await queryRunner.dropIndex('organizations', 'IDX_ORGANIZATIONS_INDUSTRY');

        // Drop organizations table
        await queryRunner.dropTable('organizations');
    }
}

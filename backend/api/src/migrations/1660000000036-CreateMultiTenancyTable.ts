import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateMultiTenancyTable1660000000036 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        
await queryRunner.createTable(new Table({
    name: 'multi_tenancy',
    columns: [
        {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
        },
        {
            name: 'tenant_id',
            type: 'uuid',
            isUnique: true,
        },
        {
            name: 'config',
            type: 'json',
            isNullable: true,
        },
        {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
        },
    ],
}));

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
// # Drop multi_tenancy table
await queryRunner.dropTable('multi_tenancy');

    }
}

import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateLeadsTable1660000000018 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        
await queryRunner.createTable(new Table({
    name: 'leads',
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
        },
        {
            name: 'email',
            type: 'varchar',
            isUnique: true,
        },
        {
            name: 'company',
            type: 'varchar',
        },
        {
            name: 'status',
            type: 'varchar',
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

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
// # Drop leads table
await queryRunner.dropTable('leads');

    }
}

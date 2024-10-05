import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateBackupTable1660000000044 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        
await queryRunner.createTable(new Table({
    name: 'backup',
    columns: [
        {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
        },
        {
            name: 'table_name',
            type: 'varchar',
        },
        {
            name: 'backup_data',
            type: 'json',
        },
        {
            name: 'backup_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
        },
    ],
}));

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
// # Drop backup table
await queryRunner.dropTable('backup');

    }
}

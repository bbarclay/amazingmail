import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateLogsTable1660000000030 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        
await queryRunner.createTable(new Table({
    name: 'logs',
    columns: [
        {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
        },
        {
            name: 'level',
            type: 'varchar',
        },
        {
            name: 'message',
            type: 'text',
        },
        {
            name: 'meta',
            type: 'json',
            isNullable: true,
        },
        {
            name: 'timestamp',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
        },
    ],
}));

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
// # Drop logs table
await queryRunner.dropTable('logs');

    }
}

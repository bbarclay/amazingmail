import { MigrationInterface, QueryRunner, Table } from 'typeorm';

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
                    name: 'backup_type',
                    type: 'varchar',
                    comment: 'full, incremental, differential',
                },
                {
                    name: 'file_path',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'file_size',
                    type: 'bigint',
                    isNullable: true,
                },
                {
                    name: 'checksum',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'status',
                    type: 'varchar',
                    default: "'pending'",
                },
                {
                    name: 'backup_started_at',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
                },
                {
                    name: 'backup_completed_at',
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
                    onUpdate: 'CURRENT_TIMESTAMP',
                },
            ],
            indices: [
                {
                    name: 'IDX_backup_table_name',
                    columnNames: ['table_name'],
                },
                {
                    name: 'IDX_backup_backup_type',
                    columnNames: ['backup_type'],
                },
                {
                    name: 'IDX_backup_status',
                    columnNames: ['status'],
                },
                {
                    name: 'IDX_backup_backup_started_at',
                    columnNames: ['backup_started_at'],
                },
            ],
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('backup');
    }
}

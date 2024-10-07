import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

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
                    isNullable: false,
                },
                {
                    name: 'message',
                    type: 'text',
                    isNullable: false,
                },
                {
                    name: 'source',
                    type: 'varchar',
                    isNullable: false,
                },
                {
                    name: 'meta',
                    type: 'json',
                    isNullable: true,
                },
                {
                    name: 'user_id',
                    type: 'uuid',
                    isNullable: true,
                },
                {
                    name: 'ip_address',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'user_agent',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'timestamp',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
                    isNullable: false,
                },
            ],
        }));

        // Add indexes
        await queryRunner.createIndex('logs', new TableIndex({
            name: 'IDX_LOGS_LEVEL',
            columnNames: ['level'],
        }));

        await queryRunner.createIndex('logs', new TableIndex({
            name: 'IDX_LOGS_SOURCE',
            columnNames: ['source'],
        }));

        await queryRunner.createIndex('logs', new TableIndex({
            name: 'IDX_LOGS_USER_ID',
            columnNames: ['user_id'],
        }));

        await queryRunner.createIndex('logs', new TableIndex({
            name: 'IDX_LOGS_TIMESTAMP',
            columnNames: ['timestamp'],
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop indexes
        await queryRunner.dropIndex('logs', 'IDX_LOGS_LEVEL');
        await queryRunner.dropIndex('logs', 'IDX_LOGS_SOURCE');
        await queryRunner.dropIndex('logs', 'IDX_LOGS_USER_ID');
        await queryRunner.dropIndex('logs', 'IDX_LOGS_TIMESTAMP');

        // Drop logs table
        await queryRunner.dropTable('logs');
    }
}

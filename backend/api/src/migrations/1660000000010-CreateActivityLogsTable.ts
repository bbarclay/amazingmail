import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateActivityLogsTable1660000000010 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'activity_logs',
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
                    isNullable: true,
                },
                {
                    name: 'action',
                    type: 'varchar',
                },
                {
                    name: 'entity_type',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'entity_id',
                    type: 'uuid',
                    isNullable: true,
                },
                {
                    name: 'metadata',
                    type: 'json',
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
                },
            ],
        }));

        // Add foreign key for user_id
        await queryRunner.createForeignKey('activity_logs', new TableForeignKey({
            columnNames: ['user_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
        }));

        // Create index for user_id
        await queryRunner.createIndex('activity_logs', new TableIndex({
            name: 'IDX_ACTIVITY_LOGS_USER_ID',
            columnNames: ['user_id'],
        }));

        // Create index for action
        await queryRunner.createIndex('activity_logs', new TableIndex({
            name: 'IDX_ACTIVITY_LOGS_ACTION',
            columnNames: ['action'],
        }));

        // Create index for timestamp
        await queryRunner.createIndex('activity_logs', new TableIndex({
            name: 'IDX_ACTIVITY_LOGS_TIMESTAMP',
            columnNames: ['timestamp'],
        }));

        // Create index for entity_type and entity_id
        await queryRunner.createIndex('activity_logs', new TableIndex({
            name: 'IDX_ACTIVITY_LOGS_ENTITY',
            columnNames: ['entity_type', 'entity_id'],
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop indexes
        await queryRunner.dropIndex('activity_logs', 'IDX_ACTIVITY_LOGS_USER_ID');
        await queryRunner.dropIndex('activity_logs', 'IDX_ACTIVITY_LOGS_ACTION');
        await queryRunner.dropIndex('activity_logs', 'IDX_ACTIVITY_LOGS_TIMESTAMP');
        await queryRunner.dropIndex('activity_logs', 'IDX_ACTIVITY_LOGS_ENTITY');

        // Drop foreign key from activity_logs
        const table = await queryRunner.getTable('activity_logs');
        const userForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('user_id') !== -1);
        if (userForeignKey) {
            await queryRunner.dropForeignKey('activity_logs', userForeignKey);
        }

        // Drop activity_logs table
        await queryRunner.dropTable('activity_logs');
    }
}

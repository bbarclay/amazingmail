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
                    name: 'metadata',
                    type: 'json',
                    isNullable: true,
                },
                {
                    name: 'timestamp',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
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
                    name: 'is_successful',
                    type: 'boolean',
                    default: true,
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

        // Add index for user_id
        await queryRunner.createIndex('activity_logs', new TableIndex({
            name: 'IDX_ACTIVITY_LOGS_USER_ID',
            columnNames: ['user_id'],
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
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

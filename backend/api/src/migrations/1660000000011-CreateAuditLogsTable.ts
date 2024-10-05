import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateAuditLogsTable1660000000011 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'audit_logs',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()',
                },
                {
                    name: 'action',
                    type: 'varchar',
                },
                {
                    name: 'performed_by',
                    type: 'uuid',
                    isNullable: true,
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
                    name: 'previous_state',
                    type: 'json',
                    isNullable: true,
                },
                {
                    name: 'new_state',
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

        // Add foreign key for performed_by
        await queryRunner.createForeignKey('audit_logs', new TableForeignKey({
            columnNames: ['performed_by'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
        }));

        // Create index for performed_by
        await queryRunner.createIndex('audit_logs', new TableIndex({
            name: 'IDX_AUDIT_LOGS_PERFORMED_BY',
            columnNames: ['performed_by'],
        }));

        // Create index for action
        await queryRunner.createIndex('audit_logs', new TableIndex({
            name: 'IDX_AUDIT_LOGS_ACTION',
            columnNames: ['action'],
        }));

        // Create index for timestamp
        await queryRunner.createIndex('audit_logs', new TableIndex({
            name: 'IDX_AUDIT_LOGS_TIMESTAMP',
            columnNames: ['timestamp'],
        }));

        // Create index for entity_type and entity_id
        await queryRunner.createIndex('audit_logs', new TableIndex({
            name: 'IDX_AUDIT_LOGS_ENTITY',
            columnNames: ['entity_type', 'entity_id'],
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop indexes
        await queryRunner.dropIndex('audit_logs', 'IDX_AUDIT_LOGS_PERFORMED_BY');
        await queryRunner.dropIndex('audit_logs', 'IDX_AUDIT_LOGS_ACTION');
        await queryRunner.dropIndex('audit_logs', 'IDX_AUDIT_LOGS_TIMESTAMP');
        await queryRunner.dropIndex('audit_logs', 'IDX_AUDIT_LOGS_ENTITY');

        // Drop foreign key from audit_logs
        const table = await queryRunner.getTable('audit_logs');
        const performedByForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('performed_by') !== -1);
        if (performedByForeignKey) {
            await queryRunner.dropForeignKey('audit_logs', performedByForeignKey);
        }

        // Drop audit_logs table
        await queryRunner.dropTable('audit_logs');
    }
}

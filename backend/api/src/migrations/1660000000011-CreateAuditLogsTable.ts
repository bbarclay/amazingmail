import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

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
            name: 'details',
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

// # Add foreign key for performed_by
await queryRunner.createForeignKey('audit_logs', new TableForeignKey({
    columnNames: ['performed_by'],
    referencedTableName: 'users',
    referencedColumnNames: ['id'],
    onDelete: 'SET NULL',
}));

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
// # Drop foreign key from audit_logs
const table = await queryRunner.getTable('audit_logs');
const performedByForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('performed_by') !== -1);
if (performedByForeignKey) {
    await queryRunner.dropForeignKey('audit_logs', performedByForeignKey);
}

// # Drop audit_logs table
await queryRunner.dropTable('audit_logs');

    }
}

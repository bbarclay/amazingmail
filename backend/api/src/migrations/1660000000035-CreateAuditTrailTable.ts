import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateAuditTrailTable1660000000035 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        
await queryRunner.createTable(new Table({
    name: 'audit_trail',
    columns: [
        {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
        },
        {
            name: 'entity',
            type: 'varchar',
        },
        {
            name: 'entity_id',
            type: 'uuid',
        },
        {
            name: 'action',
            type: 'varchar',
        },
        {
            name: 'description',
            type: 'text',
            isNullable: true,
        },
        {
            name: 'changes',
            type: 'json',
            isNullable: true,
        },
        {
            name: 'performed_by',
            type: 'uuid',
            isNullable: true,
        },
        {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
        },
    ],
    indices: [
        {
            name: 'IDX_audit_trail_entity',
            columnNames: ['entity'],
        },
        {
            name: 'IDX_audit_trail_entity_id',
            columnNames: ['entity_id'],
        },
        {
            name: 'IDX_audit_trail_action',
            columnNames: ['action'],
        },
        {
            name: 'IDX_audit_trail_performed_by',
            columnNames: ['performed_by'],
        },
        {
            name: 'IDX_audit_trail_created_at',
            columnNames: ['created_at'],
        },
    ],
}));

// # Add foreign key for performed_by
await queryRunner.createForeignKey('audit_trail', new TableForeignKey({
    columnNames: ['performed_by'],
    referencedTableName: 'users',
    referencedColumnNames: ['id'],
    onDelete: 'SET NULL',
}));

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
// # Drop foreign key from audit_trail
const table = await queryRunner.getTable('audit_trail');
const performedByForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('performed_by') !== -1);
if (performedByForeignKey) {
    await queryRunner.dropForeignKey('audit_trail', performedByForeignKey);
}

// # Drop audit_trail table
await queryRunner.dropTable('audit_trail');

    }
}

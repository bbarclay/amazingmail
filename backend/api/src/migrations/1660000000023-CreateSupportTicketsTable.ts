import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateSupportTicketsTable1660000000023 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        
await queryRunner.createTable(new Table({
    name: 'support_tickets',
    columns: [
        {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
        },
        {
            name: 'subject',
            type: 'varchar',
        },
        {
            name: 'description',
            type: 'text',
        },
        {
            name: 'status',
            type: 'varchar',
            default: open,
        },
        {
            name: 'priority',
            type: 'varchar',
            default: normal,
        },
        {
            name: 'user_id',
            type: 'uuid',
        },
        {
            name: 'assigned_to',
            type: 'uuid',
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
        },
    ],
}));

// # Add foreign key for user_id
await queryRunner.createForeignKey('support_tickets', new TableForeignKey({
    columnNames: ['user_id'],
    referencedTableName: 'users',
    referencedColumnNames: ['id'],
    onDelete: 'CASCADE',
}));

// # Add foreign key for assigned_to
await queryRunner.createForeignKey('support_tickets', new TableForeignKey({
    columnNames: ['assigned_to'],
    referencedTableName: 'users',
    referencedColumnNames: ['id'],
    onDelete: 'SET NULL',
}));

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
// # Drop foreign keys from support_tickets
const table = await queryRunner.getTable('support_tickets');
const userForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('user_id') !== -1);
if (userForeignKey) {
    await queryRunner.dropForeignKey('support_tickets', userForeignKey);
}

const assignedForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('assigned_to') !== -1);
if (assignedForeignKey) {
    await queryRunner.dropForeignKey('support_tickets', assignedForeignKey);
}

// # Drop support_tickets table
await queryRunner.dropTable('support_tickets');

    }
}

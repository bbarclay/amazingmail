import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateAttachmentsTable1660000000024 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        
await queryRunner.createTable(new Table({
    name: 'attachments',
    columns: [
        {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
        },
        {
            name: 'file_name',
            type: 'varchar',
        },
        {
            name: 'file_path',
            type: 'varchar',
        },
        {
            name: 'support_ticket_id',
            type: 'uuid',
            isNullable: true,
        },
        {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
        },
    ],
}));

// # Add foreign key for support_ticket_id
await queryRunner.createForeignKey('attachments', new TableForeignKey({
    columnNames: ['support_ticket_id'],
    referencedTableName: 'support_tickets',
    referencedColumnNames: ['id'],
    onDelete: 'CASCADE',
}));

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
// # Drop foreign key from attachments
const table = await queryRunner.getTable('attachments');
const ticketForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('support_ticket_id') !== -1);
if (ticketForeignKey) {
    await queryRunner.dropForeignKey('attachments', ticketForeignKey);
}

// # Drop attachments table
await queryRunner.dropTable('attachments');

    }
}

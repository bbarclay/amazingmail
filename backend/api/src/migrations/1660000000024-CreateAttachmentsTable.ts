import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

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
                    isNullable: false,
                },
                {
                    name: 'file_path',
                    type: 'varchar',
                    isNullable: false,
                },
                {
                    name: 'file_size',
                    type: 'integer',
                    isNullable: false,
                },
                {
                    name: 'file_type',
                    type: 'varchar',
                    isNullable: false,
                },
                {
                    name: 'support_ticket_id',
                    type: 'uuid',
                    isNullable: true,
                },
                {
                    name: 'user_id',
                    type: 'uuid',
                    isNullable: false,
                },
                {
                    name: 'created_at',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
                    isNullable: false,
                },
                {
                    name: 'updated_at',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
                    onUpdate: 'CURRENT_TIMESTAMP',
                    isNullable: false,
                },
            ],
        }));

        // Add foreign key for support_ticket_id
        await queryRunner.createForeignKey('attachments', new TableForeignKey({
            columnNames: ['support_ticket_id'],
            referencedTableName: 'support_tickets',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
        }));

        // Add foreign key for user_id
        await queryRunner.createForeignKey('attachments', new TableForeignKey({
            columnNames: ['user_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
        }));

        // Add indexes
        await queryRunner.createIndex('attachments', new TableIndex({
            name: 'IDX_ATTACHMENTS_SUPPORT_TICKET_ID',
            columnNames: ['support_ticket_id'],
        }));

        await queryRunner.createIndex('attachments', new TableIndex({
            name: 'IDX_ATTACHMENTS_USER_ID',
            columnNames: ['user_id'],
        }));

        await queryRunner.createIndex('attachments', new TableIndex({
            name: 'IDX_ATTACHMENTS_FILE_TYPE',
            columnNames: ['file_type'],
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop indexes
        await queryRunner.dropIndex('attachments', 'IDX_ATTACHMENTS_SUPPORT_TICKET_ID');
        await queryRunner.dropIndex('attachments', 'IDX_ATTACHMENTS_USER_ID');
        await queryRunner.dropIndex('attachments', 'IDX_ATTACHMENTS_FILE_TYPE');

        // Drop foreign keys from attachments
        const table = await queryRunner.getTable('attachments');
        const ticketForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('support_ticket_id') !== -1);
        if (ticketForeignKey) {
            await queryRunner.dropForeignKey('attachments', ticketForeignKey);
        }
        const userForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('user_id') !== -1);
        if (userForeignKey) {
            await queryRunner.dropForeignKey('attachments', userForeignKey);
        }

        // Drop attachments table
        await queryRunner.dropTable('attachments');
    }
}

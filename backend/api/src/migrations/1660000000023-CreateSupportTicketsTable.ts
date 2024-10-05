import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

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
                    isNullable: false,
                },
                {
                    name: 'description',
                    type: 'text',
                    isNullable: false,
                },
                {
                    name: 'status',
                    type: 'varchar',
                    isNullable: false,
                    default: "'open'",
                },
                {
                    name: 'priority',
                    type: 'varchar',
                    isNullable: false,
                    default: "'normal'",
                },
                {
                    name: 'category',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'user_id',
                    type: 'uuid',
                    isNullable: false,
                },
                {
                    name: 'assigned_to',
                    type: 'uuid',
                    isNullable: true,
                },
                {
                    name: 'resolution',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'resolved_at',
                    type: 'timestamp',
                    isNullable: true,
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

        // Add foreign key for user_id
        await queryRunner.createForeignKey('support_tickets', new TableForeignKey({
            columnNames: ['user_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
        }));

        // Add foreign key for assigned_to
        await queryRunner.createForeignKey('support_tickets', new TableForeignKey({
            columnNames: ['assigned_to'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
        }));

        // Add indexes
        await queryRunner.createIndex('support_tickets', new TableIndex({
            name: 'IDX_SUPPORT_TICKETS_STATUS',
            columnNames: ['status'],
        }));

        await queryRunner.createIndex('support_tickets', new TableIndex({
            name: 'IDX_SUPPORT_TICKETS_PRIORITY',
            columnNames: ['priority'],
        }));

        await queryRunner.createIndex('support_tickets', new TableIndex({
            name: 'IDX_SUPPORT_TICKETS_USER_ID',
            columnNames: ['user_id'],
        }));

        await queryRunner.createIndex('support_tickets', new TableIndex({
            name: 'IDX_SUPPORT_TICKETS_ASSIGNED_TO',
            columnNames: ['assigned_to'],
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop indexes
        await queryRunner.dropIndex('support_tickets', 'IDX_SUPPORT_TICKETS_STATUS');
        await queryRunner.dropIndex('support_tickets', 'IDX_SUPPORT_TICKETS_PRIORITY');
        await queryRunner.dropIndex('support_tickets', 'IDX_SUPPORT_TICKETS_USER_ID');
        await queryRunner.dropIndex('support_tickets', 'IDX_SUPPORT_TICKETS_ASSIGNED_TO');

        // Drop foreign keys from support_tickets
        const table = await queryRunner.getTable('support_tickets');
        const userForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('user_id') !== -1);
        if (userForeignKey) {
            await queryRunner.dropForeignKey('support_tickets', userForeignKey);
        }

        const assignedForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('assigned_to') !== -1);
        if (assignedForeignKey) {
            await queryRunner.dropForeignKey('support_tickets', assignedForeignKey);
        }

        // Drop support_tickets table
        await queryRunner.dropTable('support_tickets');
    }
}

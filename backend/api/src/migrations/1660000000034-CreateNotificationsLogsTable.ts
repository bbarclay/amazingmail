import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateNotificationsLogsTable1660000000034 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        
await queryRunner.createTable(new Table({
    name: 'notifications_logs',
    columns: [
        {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
        },
        {
            name: 'notification_id',
            type: 'uuid',
        },
        {
            name: 'status',
            type: 'varchar',
        },
        {
            name: 'sent_at',
            type: 'timestamp',
            isNullable: true,
        },
        {
            name: 'delivered_at',
            type: 'timestamp',
            isNullable: true,
        },
        {
            name: 'read_at',
            type: 'timestamp',
            isNullable: true,
        },
        {
            name: 'error',
            type: 'text',
            isNullable: true,
        },
        {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
        },
    ],
}));

// # Add foreign key for notification_id
await queryRunner.createForeignKey('notifications_logs', new TableForeignKey({
    columnNames: ['notification_id'],
    referencedTableName: 'notifications',
    referencedColumnNames: ['id'],
    onDelete: 'CASCADE',
}));

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
// # Drop foreign key from notifications_logs
const table = await queryRunner.getTable('notifications_logs');
const notificationForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('notification_id') !== -1);
if (notificationForeignKey) {
    await queryRunner.dropForeignKey('notifications_logs', notificationForeignKey);
}

// # Drop notifications_logs table
await queryRunner.dropTable('notifications_logs');

    }
}

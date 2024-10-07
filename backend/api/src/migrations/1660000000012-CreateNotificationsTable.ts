import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateNotificationsTable1660000000012 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'notifications',
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
                },
                {
                    name: 'type',
                    type: 'varchar',
                },
                {
                    name: 'message',
                    type: 'text',
                },
                {
                    name: 'is_read',
                    type: 'boolean',
                    default: false,
                },
                {
                    name: 'action_url',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'metadata',
                    type: 'json',
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
                {
                    name: 'read_at',
                    type: 'timestamp',
                    isNullable: true,
                },
            ],
        }));

        // Add foreign key for user_id
        await queryRunner.createForeignKey('notifications', new TableForeignKey({
            columnNames: ['user_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
        }));

        // Create index for user_id
        await queryRunner.createIndex('notifications', new TableIndex({
            name: 'IDX_NOTIFICATIONS_USER_ID',
            columnNames: ['user_id'],
        }));

        // Create index for type
        await queryRunner.createIndex('notifications', new TableIndex({
            name: 'IDX_NOTIFICATIONS_TYPE',
            columnNames: ['type'],
        }));

        // Create index for is_read
        await queryRunner.createIndex('notifications', new TableIndex({
            name: 'IDX_NOTIFICATIONS_IS_READ',
            columnNames: ['is_read'],
        }));

        // Create index for created_at
        await queryRunner.createIndex('notifications', new TableIndex({
            name: 'IDX_NOTIFICATIONS_CREATED_AT',
            columnNames: ['created_at'],
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop indexes
        await queryRunner.dropIndex('notifications', 'IDX_NOTIFICATIONS_USER_ID');
        await queryRunner.dropIndex('notifications', 'IDX_NOTIFICATIONS_TYPE');
        await queryRunner.dropIndex('notifications', 'IDX_NOTIFICATIONS_IS_READ');
        await queryRunner.dropIndex('notifications', 'IDX_NOTIFICATIONS_CREATED_AT');

        // Drop foreign key from notifications
        const table = await queryRunner.getTable('notifications');
        const userForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('user_id') !== -1);
        if (userForeignKey) {
            await queryRunner.dropForeignKey('notifications', userForeignKey);
        }

        // Drop notifications table
        await queryRunner.dropTable('notifications');
    }
}

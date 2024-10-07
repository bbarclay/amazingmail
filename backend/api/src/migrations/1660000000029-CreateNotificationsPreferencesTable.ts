import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateNotificationsPreferencesTable1660000000029 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'notifications_preferences',
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
                    isNullable: false,
                },
                {
                    name: 'notification_type',
                    type: 'varchar',
                    isNullable: false,
                },
                {
                    name: 'channel',
                    type: 'varchar',
                    isNullable: false,
                },
                {
                    name: 'enabled',
                    type: 'boolean',
                    default: true,
                    isNullable: false,
                },
                {
                    name: 'frequency',
                    type: 'varchar',
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
        await queryRunner.createForeignKey('notifications_preferences', new TableForeignKey({
            columnNames: ['user_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
        }));

        // Add indexes
        await queryRunner.createIndex('notifications_preferences', new TableIndex({
            name: 'IDX_NOTIFICATIONS_PREFERENCES_USER_ID',
            columnNames: ['user_id'],
        }));

        await queryRunner.createIndex('notifications_preferences', new TableIndex({
            name: 'IDX_NOTIFICATIONS_PREFERENCES_TYPE',
            columnNames: ['notification_type'],
        }));

        await queryRunner.createIndex('notifications_preferences', new TableIndex({
            name: 'IDX_NOTIFICATIONS_PREFERENCES_CHANNEL',
            columnNames: ['channel'],
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop indexes
        await queryRunner.dropIndex('notifications_preferences', 'IDX_NOTIFICATIONS_PREFERENCES_USER_ID');
        await queryRunner.dropIndex('notifications_preferences', 'IDX_NOTIFICATIONS_PREFERENCES_TYPE');
        await queryRunner.dropIndex('notifications_preferences', 'IDX_NOTIFICATIONS_PREFERENCES_CHANNEL');

        // Drop foreign key from notifications_preferences
        const table = await queryRunner.getTable('notifications_preferences');
        const userForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('user_id') !== -1);
        if (userForeignKey) {
            await queryRunner.dropForeignKey('notifications_preferences', userForeignKey);
        }

        // Drop notifications_preferences table
        await queryRunner.dropTable('notifications_preferences');
    }
}

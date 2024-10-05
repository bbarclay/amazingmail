import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

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
        },
        {
            name: 'preference',
            type: 'varchar',
        },
        {
            name: 'enabled',
            type: 'boolean',
            default: true,
        },
        {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
        },
    ],
}));

// # Add foreign key for user_id
await queryRunner.createForeignKey('notifications_preferences', new TableForeignKey({
    columnNames: ['user_id'],
    referencedTableName: 'users',
    referencedColumnNames: ['id'],
    onDelete: 'CASCADE',
}));

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
// # Drop foreign key from notifications_preferences
const table = await queryRunner.getTable('notifications_preferences');
const userForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('user_id') !== -1);
if (userForeignKey) {
    await queryRunner.dropForeignKey('notifications_preferences', userForeignKey);
}

// # Drop notifications_preferences table
await queryRunner.dropTable('notifications_preferences');

    }
}

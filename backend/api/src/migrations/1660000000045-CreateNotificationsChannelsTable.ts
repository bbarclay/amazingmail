import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateNotificationsChannelsTable1660000000045 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        
await queryRunner.createTable(new Table({
    name: 'notifications_channels',
    columns: [
        {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
        },
        {
            name: 'channel_name',
            type: 'varchar',
            isUnique: true,
        },
        {
            name: 'config',
            type: 'json',
            isNullable: true,
        },
        {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
        },
    ],
}));

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
// # Drop notifications_channels table
await queryRunner.dropTable('notifications_channels');

    }
}

import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateSettingsTable1660000000026 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        
await queryRunner.createTable(new Table({
    name: 'settings',
    columns: [
        {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
        },
        {
            name: 'key',
            type: 'varchar',
            isUnique: true,
        },
        {
            name: 'value',
            type: 'json',
            isNullable: true,
        },
        {
            name: 'user_id',
            type: 'uuid',
            isNullable: true,
        },
        {
            name: 'organization_id',
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
await queryRunner.createForeignKey('settings', new TableForeignKey({
    columnNames: ['user_id'],
    referencedTableName: 'users',
    referencedColumnNames: ['id'],
    onDelete: 'CASCADE',
}));

// # Add foreign key for organization_id
await queryRunner.createForeignKey('settings', new TableForeignKey({
    columnNames: ['organization_id'],
    referencedTableName: 'organizations',
    referencedColumnNames: ['id'],
    onDelete: 'CASCADE',
}));

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
// # Drop foreign keys from settings
const table = await queryRunner.getTable('settings');
const userForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('user_id') !== -1);
if (userForeignKey) {
    await queryRunner.dropForeignKey('settings', userForeignKey);
}

const orgForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('organization_id') !== -1);
if (orgForeignKey) {
    await queryRunner.dropForeignKey('settings', orgForeignKey);
}

// # Drop settings table
await queryRunner.dropTable('settings');

    }
}

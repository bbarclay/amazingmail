import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateRateLimitsTable1660000000037 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        
await queryRunner.createTable(new Table({
    name: 'rate_limits',
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
            isNullable: true,
        },
        {
            name: 'ip_address',
            type: 'varchar',
            isNullable: true,
        },
        {
            name: 'endpoint',
            type: 'varchar',
            isNullable: true,
        },
        {
            name: 'limit',
            type: 'integer',
        },
        {
            name: 'window',
            type: 'varchar', // # e.g., 'hour', 'day'
        },
        {
            name: 'remaining',
            type: 'integer',
            default: 0,
        },
        {
            name: 'reset_at',
            type: 'timestamp',
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
            onUpdate: 'CURRENT_TIMESTAMP',
        },
    ],
    indices: [
        {
            name: 'IDX_rate_limits_user_id',
            columnNames: ['user_id'],
        },
        {
            name: 'IDX_rate_limits_ip_address',
            columnNames: ['ip_address'],
        },
        {
            name: 'IDX_rate_limits_endpoint',
            columnNames: ['endpoint'],
        },
    ],
}));

// # Add foreign key for user_id
await queryRunner.createForeignKey('rate_limits', new TableForeignKey({
    columnNames: ['user_id'],
    referencedTableName: 'users',
    referencedColumnNames: ['id'],
    onDelete: 'SET NULL',
}));

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
// # Drop foreign key from rate_limits
const table = await queryRunner.getTable('rate_limits');
const userForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('user_id') !== -1);
if (userForeignKey) {
    await queryRunner.dropForeignKey('rate_limits', userForeignKey);
}

// # Drop rate_limits table
await queryRunner.dropTable('rate_limits');

    }
}

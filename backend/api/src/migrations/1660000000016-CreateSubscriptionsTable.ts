import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateSubscriptionsTable1660000000016 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'subscriptions',
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
                    name: 'plan',
                    type: 'varchar',
                    isNullable: false,
                },
                {
                    name: 'status',
                    type: 'varchar',
                    isNullable: false,
                },
                {
                    name: 'start_date',
                    type: 'timestamp',
                    isNullable: false,
                },
                {
                    name: 'end_date',
                    type: 'timestamp',
                    isNullable: true,
                },
                {
                    name: 'billing_cycle',
                    type: 'varchar',
                    isNullable: false,
                },
                {
                    name: 'price',
                    type: 'decimal',
                    precision: 10,
                    scale: 2,
                    isNullable: false,
                },
                {
                    name: 'currency',
                    type: 'varchar',
                    length: '3',
                    isNullable: false,
                },
                {
                    name: 'auto_renew',
                    type: 'boolean',
                    default: true,
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

        // Add foreign key for user_id
        await queryRunner.createForeignKey('subscriptions', new TableForeignKey({
            columnNames: ['user_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
        }));

        // Add indexes
        await queryRunner.createIndex('subscriptions', new TableIndex({
            name: 'IDX_SUBSCRIPTIONS_USER_ID',
            columnNames: ['user_id'],
        }));

        await queryRunner.createIndex('subscriptions', new TableIndex({
            name: 'IDX_SUBSCRIPTIONS_PLAN',
            columnNames: ['plan'],
        }));

        await queryRunner.createIndex('subscriptions', new TableIndex({
            name: 'IDX_SUBSCRIPTIONS_STATUS',
            columnNames: ['status'],
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop indexes
        await queryRunner.dropIndex('subscriptions', 'IDX_SUBSCRIPTIONS_USER_ID');
        await queryRunner.dropIndex('subscriptions', 'IDX_SUBSCRIPTIONS_PLAN');
        await queryRunner.dropIndex('subscriptions', 'IDX_SUBSCRIPTIONS_STATUS');

        // Drop foreign key from subscriptions
        const table = await queryRunner.getTable('subscriptions');
        const userForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('user_id') !== -1);
        if (userForeignKey) {
            await queryRunner.dropForeignKey('subscriptions', userForeignKey);
        }

        // Drop subscriptions table
        await queryRunner.dropTable('subscriptions');
    }
}

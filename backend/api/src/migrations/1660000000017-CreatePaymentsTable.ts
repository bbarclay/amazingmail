import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreatePaymentsTable1660000000017 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'payments',
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
                    name: 'subscription_id',
                    type: 'uuid',
                    isNullable: true,
                },
                {
                    name: 'amount',
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
                    name: 'payment_date',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
                    isNullable: false,
                },
                {
                    name: 'payment_method',
                    type: 'varchar',
                    isNullable: false,
                },
                {
                    name: 'status',
                    type: 'varchar',
                    isNullable: false,
                },
                {
                    name: 'transaction_id',
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
        await queryRunner.createForeignKey('payments', new TableForeignKey({
            columnNames: ['user_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
        }));

        // Add foreign key for subscription_id
        await queryRunner.createForeignKey('payments', new TableForeignKey({
            columnNames: ['subscription_id'],
            referencedTableName: 'subscriptions',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
        }));

        // Add indexes
        await queryRunner.createIndex('payments', new TableIndex({
            name: 'IDX_PAYMENTS_USER_ID',
            columnNames: ['user_id'],
        }));

        await queryRunner.createIndex('payments', new TableIndex({
            name: 'IDX_PAYMENTS_SUBSCRIPTION_ID',
            columnNames: ['subscription_id'],
        }));

        await queryRunner.createIndex('payments', new TableIndex({
            name: 'IDX_PAYMENTS_STATUS',
            columnNames: ['status'],
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop indexes
        await queryRunner.dropIndex('payments', 'IDX_PAYMENTS_USER_ID');
        await queryRunner.dropIndex('payments', 'IDX_PAYMENTS_SUBSCRIPTION_ID');
        await queryRunner.dropIndex('payments', 'IDX_PAYMENTS_STATUS');

        // Drop foreign keys from payments
        const table = await queryRunner.getTable('payments');
        const userForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('user_id') !== -1);
        if (userForeignKey) {
            await queryRunner.dropForeignKey('payments', userForeignKey);
        }
        const subscriptionForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('subscription_id') !== -1);
        if (subscriptionForeignKey) {
            await queryRunner.dropForeignKey('payments', subscriptionForeignKey);
        }

        // Drop payments table
        await queryRunner.dropTable('payments');
    }
}

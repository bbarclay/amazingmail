import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateBillingHistoryTable1660000000041 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'billing_history',
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
                    name: 'subscription_id',
                    type: 'uuid',
                    isNullable: true,
                },
                {
                    name: 'amount',
                    type: 'decimal',
                    precision: 10,
                    scale: 2,
                },
                {
                    name: 'currency',
                    type: 'varchar',
                    length: '3',
                },
                {
                    name: 'billing_date',
                    type: 'timestamp',
                },
                {
                    name: 'status',
                    type: 'varchar',
                },
                {
                    name: 'transaction_id',
                    type: 'varchar',
                    isUnique: true,
                },
                {
                    name: 'payment_method',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'description',
                    type: 'text',
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
                    onUpdate: 'CURRENT_TIMESTAMP',
                },
            ],
            indices: [
                {
                    name: 'IDX_billing_history_user_id',
                    columnNames: ['user_id'],
                },
                {
                    name: 'IDX_billing_history_subscription_id',
                    columnNames: ['subscription_id'],
                },
                {
                    name: 'IDX_billing_history_status',
                    columnNames: ['status'],
                },
                {
                    name: 'IDX_billing_history_billing_date',
                    columnNames: ['billing_date'],
                },
            ],
        }));

        // Add foreign key for user_id
        await queryRunner.createForeignKey('billing_history', new TableForeignKey({
            columnNames: ['user_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
        }));

        // Add foreign key for subscription_id
        await queryRunner.createForeignKey('billing_history', new TableForeignKey({
            columnNames: ['subscription_id'],
            referencedTableName: 'subscriptions',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable('billing_history');
        const foreignKeys = table.foreignKeys;

        for (const foreignKey of foreignKeys) {
            await queryRunner.dropForeignKey('billing_history', foreignKey);
        }

        await queryRunner.dropTable('billing_history');
    }
}

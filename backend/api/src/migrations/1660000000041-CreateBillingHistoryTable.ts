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
        },
        {
            name: 'amount',
            type: 'decimal',
        },
        {
            name: 'currency',
            type: 'varchar',
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
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
        },
    ],
}));

// # Add foreign key for user_id
await queryRunner.createForeignKey('billing_history', new TableForeignKey({
    columnNames: ['user_id'],
    referencedTableName: 'users',
    referencedColumnNames: ['id'],
    onDelete: 'CASCADE',
}));

// # Add foreign key for subscription_id
await queryRunner.createForeignKey('billing_history', new TableForeignKey({
    columnNames: ['subscription_id'],
    referencedTableName: 'subscriptions',
    referencedColumnNames: ['id'],
    onDelete: 'SET NULL',
}));

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
// # Drop foreign keys from billing_history
const table = await queryRunner.getTable('billing_history');
const userForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('user_id') !== -1);
if (userForeignKey) {
    await queryRunner.dropForeignKey('billing_history', userForeignKey);
}

const subscriptionForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('subscription_id') !== -1);
if (subscriptionForeignKey) {
    await queryRunner.dropForeignKey('billing_history', subscriptionForeignKey);
}

// # Drop billing_history table
await queryRunner.dropTable('billing_history');

    }
}

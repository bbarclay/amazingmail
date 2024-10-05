
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class BillingManagementMigration2024 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create the Subscriptions table
        await queryRunner.createTable(new Table({
            name: 'subscriptions',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                },
                {
                    name: 'userId',
                    type: 'uuid',
                },
                {
                    name: 'plan',
                    type: 'varchar',
                },
                {
                    name: 'status',
                    type: 'varchar',
                },
                {
                    name: 'startDate',
                    type: 'timestamp',
                },
                {
                    name: 'endDate',
                    type: 'timestamp',
                },
            ],
            foreignKeys: [
                {
                    columnNames: ['userId'],
                    referencedTableName: 'user',
                    referencedColumnNames: ['id'],
                    onDelete: 'CASCADE',
                },
            ],
        }));

        // Create the Payments table
        await queryRunner.createTable(new Table({
            name: 'payments',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                },
                {
                    name: 'userId',
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
                    name: 'paymentDate',
                    type: 'timestamp',
                },
            ],
            foreignKeys: [
                {
                    columnNames: ['userId'],
                    referencedTableName: 'user',
                    referencedColumnNames: ['id'],
                    onDelete: 'SET NULL',
                },
            ],
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop the Subscriptions and Payments tables
        await queryRunner.dropTable('subscriptions');
        await queryRunner.dropTable('payments');
    }
}

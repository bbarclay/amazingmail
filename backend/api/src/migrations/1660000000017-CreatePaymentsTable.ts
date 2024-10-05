import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

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
            name: 'amount',
            type: 'decimal',
        },
        {
            name: 'currency',
            type: 'varchar',
        },
        {
            name: 'payment_date',
            type: 'timestamp',
        },
    ],
}));

// # Add foreign key for user_id
await queryRunner.createForeignKey('payments', new TableForeignKey({
    columnNames: ['user_id'],
    referencedTableName: 'users',
    referencedColumnNames: ['id'],
    onDelete: 'SET NULL',
}));

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
// # Drop foreign key from payments
const table = await queryRunner.getTable('payments');
const userForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('user_id') !== -1);
if (userForeignKey) {
    await queryRunner.dropForeignKey('payments', userForeignKey);
}

// # Drop payments table
await queryRunner.dropTable('payments');

    }
}

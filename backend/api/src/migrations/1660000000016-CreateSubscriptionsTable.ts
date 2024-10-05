import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

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
            name: 'start_date',
            type: 'timestamp',
        },
        {
            name: 'end_date',
            type: 'timestamp',
        },
    ],
}));

// # Add foreign key for user_id
await queryRunner.createForeignKey('subscriptions', new TableForeignKey({
    columnNames: ['user_id'],
    referencedTableName: 'users',
    referencedColumnNames: ['id'],
    onDelete: 'CASCADE',
}));

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
// # Drop foreign key from subscriptions
const table = await queryRunner.getTable('subscriptions');
const userForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('user_id') !== -1);
if (userForeignKey) {
    await queryRunner.dropForeignKey('subscriptions', userForeignKey);
}

// # Drop subscriptions table
await queryRunner.dropTable('subscriptions');

    }
}

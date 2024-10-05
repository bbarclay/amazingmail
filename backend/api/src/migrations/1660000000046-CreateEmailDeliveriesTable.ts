import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateEmailDeliveriesTable1660000000046 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        
await queryRunner.createTable(new Table({
    name: 'email_deliveries',
    columns: [
        {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
        },
        {
            name: 'email_id',
            type: 'uuid',
        },
        {
            name: 'status',
            type: 'varchar',
        },
        {
            name: 'delivered_at',
            type: 'timestamp',
            isNullable: true,
        },
        {
            name: 'error_message',
            type: 'text',
            isNullable: true,
        },
        {
            name: 'provider_response',
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

// # Add foreign key for email_id
await queryRunner.createForeignKey('email_deliveries', new TableForeignKey({
    columnNames: ['email_id'],
    referencedTableName: 'emails',
    referencedColumnNames: ['id'],
    onDelete: 'CASCADE',
}));

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
// # Drop foreign key from email_deliveries
const table = await queryRunner.getTable('email_deliveries');
const emailForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('email_id') !== -1);
if (emailForeignKey) {
    await queryRunner.dropForeignKey('email_deliveries', emailForeignKey);
}

// # Drop email_deliveries table
await queryRunner.dropTable('email_deliveries');

    }
}

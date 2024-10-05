import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateFeedbackTable1660000000040 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        
await queryRunner.createTable(new Table({
    name: 'feedback',
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
            name: 'message',
            type: 'text',
        },
        {
            name: 'rating',
            type: 'integer',
            isNullable: true,
        },
        {
            name: 'source',
            type: 'varchar',
            isNullable: true,
        },
        {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
        },
    ],
}));

// # Add foreign key for user_id
await queryRunner.createForeignKey('feedback', new TableForeignKey({
    columnNames: ['user_id'],
    referencedTableName: 'users',
    referencedColumnNames: ['id'],
    onDelete: 'SET NULL',
}));

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
// # Drop foreign key from feedback
const table = await queryRunner.getTable('feedback');
const userForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('user_id') !== -1);
if (userForeignKey) {
    await queryRunner.dropForeignKey('feedback', userForeignKey);
}

// # Drop feedback table
await queryRunner.dropTable('feedback');

    }
}

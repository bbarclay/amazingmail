import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateEmailTemplatesTable1660000000033 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        
await queryRunner.createTable(new Table({
    name: 'email_templates',
    columns: [
        {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
        },
        {
            name: 'name',
            type: 'varchar',
        },
        {
            name: 'description',
            type: 'text',
            isNullable: true,
        },
        {
            name: 'subject',
            type: 'varchar',
        },
        {
            name: 'body',
            type: 'text',
        },
        {
            name: 'variables',
            type: 'json',
            isNullable: true,
        },
        {
            name: 'user_id',
            type: 'uuid',
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
            name: 'IDX_email_templates_name',
            columnNames: ['name'],
        },
    ],
}));

// # Add foreign key for user_id
await queryRunner.createForeignKey('email_templates', new TableForeignKey({
    columnNames: ['user_id'],
    referencedTableName: 'users',
    referencedColumnNames: ['id'],
    onDelete: 'CASCADE',
}));

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
// # Drop foreign key from email_templates
const table = await queryRunner.getTable('email_templates');
const userForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('user_id') !== -1);
if (userForeignKey) {
    await queryRunner.dropForeignKey('email_templates', userForeignKey);
}

// # Drop email_templates table
await queryRunner.dropTable('email_templates');

    }
}

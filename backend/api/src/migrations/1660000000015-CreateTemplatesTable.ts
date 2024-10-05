import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateTemplatesTable1660000000015 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'templates',
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
                    isNullable: false,
                },
                {
                    name: 'description',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'content',
                    type: 'json',
                    isNullable: false,
                },
                {
                    name: 'type',
                    type: 'varchar',
                    isNullable: false,
                },
                {
                    name: 'version',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'is_active',
                    type: 'boolean',
                    default: true,
                    isNullable: false,
                },
                {
                    name: 'user_id',
                    type: 'uuid',
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
        await queryRunner.createForeignKey('templates', new TableForeignKey({
            columnNames: ['user_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
        }));

        // Add indexes
        await queryRunner.createIndex('templates', new TableIndex({
            name: 'IDX_TEMPLATES_NAME',
            columnNames: ['name'],
        }));

        await queryRunner.createIndex('templates', new TableIndex({
            name: 'IDX_TEMPLATES_TYPE',
            columnNames: ['type'],
        }));

        await queryRunner.createIndex('templates', new TableIndex({
            name: 'IDX_TEMPLATES_USER_ID',
            columnNames: ['user_id'],
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop indexes
        await queryRunner.dropIndex('templates', 'IDX_TEMPLATES_NAME');
        await queryRunner.dropIndex('templates', 'IDX_TEMPLATES_TYPE');
        await queryRunner.dropIndex('templates', 'IDX_TEMPLATES_USER_ID');

        // Drop foreign key from templates
        const table = await queryRunner.getTable('templates');
        const userForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('user_id') !== -1);
        if (userForeignKey) {
            await queryRunner.dropForeignKey('templates', userForeignKey);
        }

        // Drop templates table
        await queryRunner.dropTable('templates');
    }
}

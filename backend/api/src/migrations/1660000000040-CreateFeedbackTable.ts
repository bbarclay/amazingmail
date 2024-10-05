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
                    name: 'category',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'status',
                    type: 'varchar',
                    default: "'pending'",
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
                    name: 'IDX_feedback_user_id',
                    columnNames: ['user_id'],
                },
                {
                    name: 'IDX_feedback_rating',
                    columnNames: ['rating'],
                },
                {
                    name: 'IDX_feedback_source',
                    columnNames: ['source'],
                },
                {
                    name: 'IDX_feedback_category',
                    columnNames: ['category'],
                },
                {
                    name: 'IDX_feedback_status',
                    columnNames: ['status'],
                },
            ],
        }));

        // Add foreign key for user_id
        await queryRunner.createForeignKey('feedback', new TableForeignKey({
            columnNames: ['user_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable('feedback');
        const foreignKeys = table.foreignKeys;

        for (const foreignKey of foreignKeys) {
            await queryRunner.dropForeignKey('feedback', foreignKey);
        }

        await queryRunner.dropTable('feedback');
    }
}

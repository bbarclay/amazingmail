import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateReportsTable1660000000021 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'reports',
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
                    name: 'type',
                    type: 'varchar',
                    isNullable: false,
                },
                {
                    name: 'data',
                    type: 'json',
                    isNullable: false,
                },
                {
                    name: 'user_id',
                    type: 'uuid',
                    isNullable: false,
                },
                {
                    name: 'campaign_id',
                    type: 'uuid',
                    isNullable: true,
                },
                {
                    name: 'status',
                    type: 'varchar',
                    isNullable: false,
                    default: "'completed'",
                },
                {
                    name: 'generated_at',
                    type: 'timestamp',
                    isNullable: false,
                    default: 'CURRENT_TIMESTAMP',
                },
                {
                    name: 'created_at',
                    type: 'timestamp',
                    isNullable: false,
                    default: 'CURRENT_TIMESTAMP',
                },
                {
                    name: 'updated_at',
                    type: 'timestamp',
                    isNullable: false,
                    default: 'CURRENT_TIMESTAMP',
                    onUpdate: 'CURRENT_TIMESTAMP',
                },
            ],
        }));

        // Add foreign key for user_id
        await queryRunner.createForeignKey('reports', new TableForeignKey({
            columnNames: ['user_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
        }));

        // Add foreign key for campaign_id
        await queryRunner.createForeignKey('reports', new TableForeignKey({
            columnNames: ['campaign_id'],
            referencedTableName: 'campaigns',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
        }));

        // Add indexes
        await queryRunner.createIndex('reports', new TableIndex({
            name: 'IDX_REPORTS_NAME',
            columnNames: ['name'],
        }));

        await queryRunner.createIndex('reports', new TableIndex({
            name: 'IDX_REPORTS_TYPE',
            columnNames: ['type'],
        }));

        await queryRunner.createIndex('reports', new TableIndex({
            name: 'IDX_REPORTS_USER_ID',
            columnNames: ['user_id'],
        }));

        await queryRunner.createIndex('reports', new TableIndex({
            name: 'IDX_REPORTS_CAMPAIGN_ID',
            columnNames: ['campaign_id'],
        }));

        await queryRunner.createIndex('reports', new TableIndex({
            name: 'IDX_REPORTS_STATUS',
            columnNames: ['status'],
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop indexes
        await queryRunner.dropIndex('reports', 'IDX_REPORTS_NAME');
        await queryRunner.dropIndex('reports', 'IDX_REPORTS_TYPE');
        await queryRunner.dropIndex('reports', 'IDX_REPORTS_USER_ID');
        await queryRunner.dropIndex('reports', 'IDX_REPORTS_CAMPAIGN_ID');
        await queryRunner.dropIndex('reports', 'IDX_REPORTS_STATUS');

        // Drop foreign keys from reports
        const table = await queryRunner.getTable('reports');
        const userForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('user_id') !== -1);
        if (userForeignKey) {
            await queryRunner.dropForeignKey('reports', userForeignKey);
        }

        const campaignForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('campaign_id') !== -1);
        if (campaignForeignKey) {
            await queryRunner.dropForeignKey('reports', campaignForeignKey);
        }

        // Drop reports table
        await queryRunner.dropTable('reports');
    }
}

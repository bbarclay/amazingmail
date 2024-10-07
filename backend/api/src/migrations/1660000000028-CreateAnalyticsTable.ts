import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateAnalyticsTable1660000000028 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'analytics',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()',
                },
                {
                    name: 'metric',
                    type: 'varchar',
                    isNullable: false,
                },
                {
                    name: 'value',
                    type: 'decimal',
                    precision: 10,
                    scale: 2,
                    isNullable: false,
                },
                {
                    name: 'date',
                    type: 'date',
                    isNullable: false,
                },
                {
                    name: 'campaign_id',
                    type: 'uuid',
                    isNullable: true,
                },
                {
                    name: 'user_id',
                    type: 'uuid',
                    isNullable: false,
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

        // Add foreign key for campaign_id
        await queryRunner.createForeignKey('analytics', new TableForeignKey({
            columnNames: ['campaign_id'],
            referencedTableName: 'campaigns',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
        }));

        // Add foreign key for user_id
        await queryRunner.createForeignKey('analytics', new TableForeignKey({
            columnNames: ['user_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
        }));

        // Add indexes
        await queryRunner.createIndex('analytics', new TableIndex({
            name: 'IDX_ANALYTICS_METRIC',
            columnNames: ['metric'],
        }));

        await queryRunner.createIndex('analytics', new TableIndex({
            name: 'IDX_ANALYTICS_DATE',
            columnNames: ['date'],
        }));

        await queryRunner.createIndex('analytics', new TableIndex({
            name: 'IDX_ANALYTICS_CAMPAIGN_ID',
            columnNames: ['campaign_id'],
        }));

        await queryRunner.createIndex('analytics', new TableIndex({
            name: 'IDX_ANALYTICS_USER_ID',
            columnNames: ['user_id'],
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop indexes
        await queryRunner.dropIndex('analytics', 'IDX_ANALYTICS_METRIC');
        await queryRunner.dropIndex('analytics', 'IDX_ANALYTICS_DATE');
        await queryRunner.dropIndex('analytics', 'IDX_ANALYTICS_CAMPAIGN_ID');
        await queryRunner.dropIndex('analytics', 'IDX_ANALYTICS_USER_ID');

        // Drop foreign keys from analytics
        const table = await queryRunner.getTable('analytics');
        const campaignForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('campaign_id') !== -1);
        if (campaignForeignKey) {
            await queryRunner.dropForeignKey('analytics', campaignForeignKey);
        }

        const userForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('user_id') !== -1);
        if (userForeignKey) {
            await queryRunner.dropForeignKey('analytics', userForeignKey);
        }

        // Drop analytics table
        await queryRunner.dropTable('analytics');
    }
}

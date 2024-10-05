import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateCampaignsTable1660000000014 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'campaigns',
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
                    name: 'status',
                    type: 'varchar',
                    isNullable: false,
                },
                {
                    name: 'start_date',
                    type: 'timestamp',
                    isNullable: true,
                },
                {
                    name: 'end_date',
                    type: 'timestamp',
                    isNullable: true,
                },
                {
                    name: 'budget',
                    type: 'decimal',
                    precision: 10,
                    scale: 2,
                    isNullable: true,
                },
                {
                    name: 'date_created',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
                    isNullable: false,
                },
                {
                    name: 'date_updated',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
                    onUpdate: 'CURRENT_TIMESTAMP',
                    isNullable: false,
                },
                {
                    name: 'user_id',
                    type: 'uuid',
                    isNullable: false,
                },
            ],
        }));

        // Add foreign key for user_id
        await queryRunner.createForeignKey('campaigns', new TableForeignKey({
            columnNames: ['user_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
        }));

        // Add indexes
        await queryRunner.createIndex('campaigns', new TableIndex({
            name: 'IDX_CAMPAIGNS_NAME',
            columnNames: ['name'],
        }));

        await queryRunner.createIndex('campaigns', new TableIndex({
            name: 'IDX_CAMPAIGNS_STATUS',
            columnNames: ['status'],
        }));

        await queryRunner.createIndex('campaigns', new TableIndex({
            name: 'IDX_CAMPAIGNS_USER_ID',
            columnNames: ['user_id'],
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop indexes
        await queryRunner.dropIndex('campaigns', 'IDX_CAMPAIGNS_NAME');
        await queryRunner.dropIndex('campaigns', 'IDX_CAMPAIGNS_STATUS');
        await queryRunner.dropIndex('campaigns', 'IDX_CAMPAIGNS_USER_ID');

        // Drop foreign key from campaigns
        const table = await queryRunner.getTable('campaigns');
        const userForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('user_id') !== -1);
        if (userForeignKey) {
            await queryRunner.dropForeignKey('campaigns', userForeignKey);
        }

        // Drop campaigns table
        await queryRunner.dropTable('campaigns');
    }
}

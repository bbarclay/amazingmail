import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateCampaignsTable1660000000003 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
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
                    },
                    {
                        name: 'description',
                        type: 'text',
                        isNullable: true,
                    },
                    {
                        name: 'status',
                        type: 'varchar',
                        default: "'active'",
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
            }),
            true
        );

        await queryRunner.createIndex(
            'campaigns',
            new TableIndex({
                name: 'IDX_CAMPAIGNS_NAME',
                columnNames: ['name'],
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropIndex('campaigns', 'IDX_CAMPAIGNS_NAME');
        await queryRunner.dropTable('campaigns');
    }
}

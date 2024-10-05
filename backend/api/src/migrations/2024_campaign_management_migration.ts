
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CampaignManagementMigration2024 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create the Campaigns table
        await queryRunner.createTable(new Table({
            name: 'campaigns',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                },
                {
                    name: 'name',
                    type: 'varchar',
                },
                {
                    name: 'status',
                    type: 'varchar',
                },
                {
                    name: 'dateCreated',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
                },
                {
                    name: 'userId',
                    type: 'uuid',
                },
            ],
            foreignKeys: [
                {
                    columnNames: ['userId'],
                    referencedTableName: 'user',
                    referencedColumnNames: ['id'],
                    onDelete: 'CASCADE',
                },
            ],
        }));

        // Create the Templates table
        await queryRunner.createTable(new Table({
            name: 'templates',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                },
                {
                    name: 'name',
                    type: 'varchar',
                },
                {
                    name: 'content',
                    type: 'text',
                },
                {
                    name: 'userId',
                    type: 'uuid',
                },
            ],
            foreignKeys: [
                {
                    columnNames: ['userId'],
                    referencedTableName: 'user',
                    referencedColumnNames: ['id'],
                    onDelete: 'CASCADE',
                },
            ],
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop the Campaigns and Templates tables
        await queryRunner.dropTable('campaigns');
        await queryRunner.dropTable('templates');
    }
}


import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class LeadManagementMigration2024 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create the Leads table
        await queryRunner.createTable(new Table({
            name: 'leads',
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
                    name: 'email',
                    type: 'varchar',
                    isUnique: true,
                },
                {
                    name: 'company',
                    type: 'varchar',
                },
                {
                    name: 'status',
                    type: 'varchar',
                },
                {
                    name: 'createdAt',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
                },
                {
                    name: 'updatedAt',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
                },
            ],
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop the Leads table
        await queryRunner.dropTable('leads');
    }
}


import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class DomainManagementMigration2024 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create the Domains table
        await queryRunner.createTable(new Table({
            name: 'domains',
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
                    isUnique: true,
                },
                {
                    name: 'userId',
                    type: 'uuid',
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
        // Drop the Domains table
        await queryRunner.dropTable('domains');
    }
}


import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class UserManagementMigration2024 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add new columns to the User table
        await queryRunner.addColumn('user', new TableColumn({
            name: 'apiKey',
            type: 'varchar',
            isNullable: true,
        }));

        // Create the ApiKey table
        await queryRunner.createTable(new Table({
            name: 'api_key',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                },
                {
                    name: 'key',
                    type: 'varchar',
                    isUnique: true,
                },
                {
                    name: 'description',
                    type: 'varchar',
                    isNullable: true,
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

        // Create the ConnectedAccounts table
        await queryRunner.createTable(new Table({
            name: 'connected_accounts',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                },
                {
                    name: 'userId',
                    type: 'uuid',
                },
                {
                    name: 'accountType',
                    type: 'varchar',
                },
                {
                    name: 'accountDetails',
                    type: 'json',
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
        // Drop the ApiKey and ConnectedAccounts tables
        await queryRunner.dropTable('api_key');
        await queryRunner.dropTable('connected_accounts');

        // Remove the new column from the User table
        await queryRunner.dropColumn('user', 'apiKey');
    }
}

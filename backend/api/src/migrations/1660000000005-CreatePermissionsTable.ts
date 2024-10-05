import { MigrationInterface, QueryRunner, Table, TableIndex, TableUnique } from 'typeorm';

export class CreatePermissionsTable1660000000005 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'permissions',
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
                    isUnique: true,
                },
                {
                    name: 'description',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'resource',
                    type: 'varchar',
                },
                {
                    name: 'action',
                    type: 'varchar',
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
            uniques: [
                new TableUnique({
                    name: 'UQ_PERMISSION_RESOURCE_ACTION',
                    columnNames: ['resource', 'action'],
                }),
            ],
        }));

        // Create index for the 'name' column
        await queryRunner.createIndex('permissions', new TableIndex({
            name: 'IDX_PERMISSIONS_NAME',
            columnNames: ['name'],
        }));

        // Create index for the 'resource' column
        await queryRunner.createIndex('permissions', new TableIndex({
            name: 'IDX_PERMISSIONS_RESOURCE',
            columnNames: ['resource'],
        }));

        // Create index for the 'action' column
        await queryRunner.createIndex('permissions', new TableIndex({
            name: 'IDX_PERMISSIONS_ACTION',
            columnNames: ['action'],
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop indexes
        await queryRunner.dropIndex('permissions', 'IDX_PERMISSIONS_NAME');
        await queryRunner.dropIndex('permissions', 'IDX_PERMISSIONS_RESOURCE');
        await queryRunner.dropIndex('permissions', 'IDX_PERMISSIONS_ACTION');

        // Drop unique constraint
        await queryRunner.dropUniqueConstraint('permissions', 'UQ_PERMISSION_RESOURCE_ACTION');

        // Drop permissions table
        await queryRunner.dropTable('permissions');
    }
}

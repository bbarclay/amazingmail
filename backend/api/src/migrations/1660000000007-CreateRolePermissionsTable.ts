import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex, TableUnique } from 'typeorm';

export class CreateRolePermissionsTable1660000000007 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'role_permissions',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()',
                },
                {
                    name: 'role_id',
                    type: 'uuid',
                },
                {
                    name: 'permission_id',
                    type: 'uuid',
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
                    name: 'UQ_ROLE_PERMISSION',
                    columnNames: ['role_id', 'permission_id'],
                }),
            ],
        }));

        // Add foreign key for role_id
        await queryRunner.createForeignKey('role_permissions', new TableForeignKey({
            columnNames: ['role_id'],
            referencedTableName: 'roles',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
        }));

        // Add foreign key for permission_id
        await queryRunner.createForeignKey('role_permissions', new TableForeignKey({
            columnNames: ['permission_id'],
            referencedTableName: 'permissions',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
        }));

        // Create index for role_id
        await queryRunner.createIndex('role_permissions', new TableIndex({
            name: 'IDX_ROLE_PERMISSIONS_ROLE_ID',
            columnNames: ['role_id'],
        }));

        // Create index for permission_id
        await queryRunner.createIndex('role_permissions', new TableIndex({
            name: 'IDX_ROLE_PERMISSIONS_PERMISSION_ID',
            columnNames: ['permission_id'],
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop indexes
        await queryRunner.dropIndex('role_permissions', 'IDX_ROLE_PERMISSIONS_ROLE_ID');
        await queryRunner.dropIndex('role_permissions', 'IDX_ROLE_PERMISSIONS_PERMISSION_ID');

        // Drop foreign keys from role_permissions
        const table = await queryRunner.getTable('role_permissions');
        const foreignKeys = table.foreignKeys;
        for (const foreignKey of foreignKeys) {
            await queryRunner.dropForeignKey('role_permissions', foreignKey);
        }

        // Drop unique constraint
        await queryRunner.dropUniqueConstraint('role_permissions', 'UQ_ROLE_PERMISSION');

        // Drop role_permissions table
        await queryRunner.dropTable('role_permissions');
    }
}

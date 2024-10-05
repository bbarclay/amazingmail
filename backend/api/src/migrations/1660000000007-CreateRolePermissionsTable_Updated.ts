import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateRolePermissionsTable1660000000007 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'role_permissions',
            columns: [
                {
                    name: 'role_id',
                    type: 'uuid',
                    isPrimary: true,
                },
                {
                    name: 'permission_id',
                    type: 'uuid',
                    isPrimary: true,
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
                },
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

        // Add index for role_id
        await queryRunner.createIndex('role_permissions', new TableIndex({
            name: 'IDX_ROLE_PERMISSIONS_ROLE_ID',
            columnNames: ['role_id'],
        }));

        // Add index for permission_id
        await queryRunner.createIndex('role_permissions', new TableIndex({
            name: 'IDX_ROLE_PERMISSIONS_PERMISSION_ID',
            columnNames: ['permission_id'],
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop foreign keys from role_permissions
        const table = await queryRunner.getTable('role_permissions');
        const roleForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('role_id') !== -1);
        if (roleForeignKey) {
            await queryRunner.dropForeignKey('role_permissions', roleForeignKey);
        }

        const permissionForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('permission_id') !== -1);
        if (permissionForeignKey) {
            await queryRunner.dropForeignKey('role_permissions', permissionForeignKey);
        }

        // Drop role_permissions table
        await queryRunner.dropTable('role_permissions');
    }
}

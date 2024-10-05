import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateUserRolesTable1660000000006 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'user_roles',
            columns: [
                {
                    name: 'user_id',
                    type: 'uuid',
                    isPrimary: true,
                },
                {
                    name: 'role_id',
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

        // Add foreign key for user_id
        await queryRunner.createForeignKey('user_roles', new TableForeignKey({
            columnNames: ['user_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
        }));

        // Add foreign key for role_id
        await queryRunner.createForeignKey('user_roles', new TableForeignKey({
            columnNames: ['role_id'],
            referencedTableName: 'roles',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
        }));

        // Add index for user_id
        await queryRunner.createIndex('user_roles', new TableIndex({
            name: 'IDX_USER_ROLES_USER_ID',
            columnNames: ['user_id'],
        }));

        // Add index for role_id
        await queryRunner.createIndex('user_roles', new TableIndex({
            name: 'IDX_USER_ROLES_ROLE_ID',
            columnNames: ['role_id'],
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop foreign keys from user_roles
        const table = await queryRunner.getTable('user_roles');
        const userForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('user_id') !== -1);
        if (userForeignKey) {
            await queryRunner.dropForeignKey('user_roles', userForeignKey);
        }

        const roleForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('role_id') !== -1);
        if (roleForeignKey) {
            await queryRunner.dropForeignKey('user_roles', roleForeignKey);
        }

        // Drop user_roles table
        await queryRunner.dropTable('user_roles');
    }
}

import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex, TableUnique } from 'typeorm';

export class CreateUserRolesTable1660000000006 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'user_roles',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()',
                },
                {
                    name: 'user_id',
                    type: 'uuid',
                },
                {
                    name: 'role_id',
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
                    name: 'UQ_USER_ROLE',
                    columnNames: ['user_id', 'role_id'],
                }),
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

        // Create index for user_id
        await queryRunner.createIndex('user_roles', new TableIndex({
            name: 'IDX_USER_ROLES_USER_ID',
            columnNames: ['user_id'],
        }));

        // Create index for role_id
        await queryRunner.createIndex('user_roles', new TableIndex({
            name: 'IDX_USER_ROLES_ROLE_ID',
            columnNames: ['role_id'],
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop indexes
        await queryRunner.dropIndex('user_roles', 'IDX_USER_ROLES_USER_ID');
        await queryRunner.dropIndex('user_roles', 'IDX_USER_ROLES_ROLE_ID');

        // Drop foreign keys from user_roles
        const table = await queryRunner.getTable('user_roles');
        const foreignKeys = table.foreignKeys;
        for (const foreignKey of foreignKeys) {
            await queryRunner.dropForeignKey('user_roles', foreignKey);
        }

        // Drop unique constraint
        await queryRunner.dropUniqueConstraint('user_roles', 'UQ_USER_ROLE');

        // Drop user_roles table
        await queryRunner.dropTable('user_roles');
    }
}

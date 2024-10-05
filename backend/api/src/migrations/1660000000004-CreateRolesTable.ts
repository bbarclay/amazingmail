import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey, TableUnique } from 'typeorm';

export class CreateRolesTable1660000000004 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'roles',
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
                    name: 'permissions',
                    type: 'json',
                    isNullable: true,
                },
                {
                    name: 'organization_id',
                    type: 'uuid',
                    isNullable: true,
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
                    name: 'UQ_ROLE_NAME_ORGANIZATION',
                    columnNames: ['name', 'organization_id'],
                }),
            ],
        }));

        // Create index for the 'name' column
        await queryRunner.createIndex('roles', new TableIndex({
            name: 'IDX_ROLES_NAME',
            columnNames: ['name'],
        }));

        // Create index for the 'organization_id' column
        await queryRunner.createIndex('roles', new TableIndex({
            name: 'IDX_ROLES_ORGANIZATION_ID',
            columnNames: ['organization_id'],
        }));

        // Add foreign key for organization_id
        await queryRunner.createForeignKey('roles', new TableForeignKey({
            columnNames: ['organization_id'],
            referencedTableName: 'organizations',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop foreign key
        const table = await queryRunner.getTable('roles');
        const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('organization_id') !== -1);
        if (foreignKey) {
            await queryRunner.dropForeignKey('roles', foreignKey);
        }

        // Drop indexes
        await queryRunner.dropIndex('roles', 'IDX_ROLES_NAME');
        await queryRunner.dropIndex('roles', 'IDX_ROLES_ORGANIZATION_ID');

        // Drop unique constraint
        await queryRunner.dropUniqueConstraint('roles', 'UQ_ROLE_NAME_ORGANIZATION');

        // Drop roles table
        await queryRunner.dropTable('roles');
    }
}

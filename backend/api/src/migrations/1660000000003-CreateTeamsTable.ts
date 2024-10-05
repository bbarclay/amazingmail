import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey, TableUnique } from 'typeorm';

export class CreateTeamsTable1660000000003 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'teams',
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
                    name: 'organization_id',
                    type: 'uuid',
                },
                {
                    name: 'created_by',
                    type: 'uuid',
                    isNullable: true,
                },
                {
                    name: 'status',
                    type: 'varchar',
                    default: "'active'",
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
                    name: 'UQ_TEAM_NAME_ORGANIZATION',
                    columnNames: ['name', 'organization_id'],
                }),
            ],
        }));

        // Add foreign key for organization_id
        await queryRunner.createForeignKey('teams', new TableForeignKey({
            columnNames: ['organization_id'],
            referencedTableName: 'organizations',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
        }));

        // Add foreign key for created_by
        await queryRunner.createForeignKey('teams', new TableForeignKey({
            columnNames: ['created_by'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
        }));

        // Create index for the 'name' column
        await queryRunner.createIndex('teams', new TableIndex({
            name: 'IDX_TEAMS_NAME',
            columnNames: ['name'],
        }));

        // Create index for the 'organization_id' column
        await queryRunner.createIndex('teams', new TableIndex({
            name: 'IDX_TEAMS_ORGANIZATION_ID',
            columnNames: ['organization_id'],
        }));

        // Create index for the 'status' column
        await queryRunner.createIndex('teams', new TableIndex({
            name: 'IDX_TEAMS_STATUS',
            columnNames: ['status'],
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop indexes
        await queryRunner.dropIndex('teams', 'IDX_TEAMS_NAME');
        await queryRunner.dropIndex('teams', 'IDX_TEAMS_ORGANIZATION_ID');
        await queryRunner.dropIndex('teams', 'IDX_TEAMS_STATUS');

        // Drop foreign keys
        const table = await queryRunner.getTable('teams');
        const foreignKeys = table.foreignKeys;
        for (const foreignKey of foreignKeys) {
            await queryRunner.dropForeignKey('teams', foreignKey);
        }

        // Drop unique constraint
        await queryRunner.dropUniqueConstraint('teams', 'UQ_TEAM_NAME_ORGANIZATION');

        // Drop teams table
        await queryRunner.dropTable('teams');
    }
}

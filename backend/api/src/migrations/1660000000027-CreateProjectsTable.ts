import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateProjectsTable1660000000027 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        
await queryRunner.createTable(new Table({
    name: 'projects',
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
            name: 'user_id',
            type: 'uuid',
        },
        {
            name: 'team_id',
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
        },
    ],
}));

// # Add foreign key for user_id
await queryRunner.createForeignKey('projects', new TableForeignKey({
    columnNames: ['user_id'],
    referencedTableName: 'users',
    referencedColumnNames: ['id'],
    onDelete: 'CASCADE',
}));

// # Add foreign key for team_id
await queryRunner.createForeignKey('projects', new TableForeignKey({
    columnNames: ['team_id'],
    referencedTableName: 'teams',
    referencedColumnNames: ['id'],
    onDelete: 'SET NULL',
}));

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
// # Drop foreign keys from projects
const table = await queryRunner.getTable('projects');
const userForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('user_id') !== -1);
if (userForeignKey) {
    await queryRunner.dropForeignKey('projects', userForeignKey);
}

const teamForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('team_id') !== -1);
if (teamForeignKey) {
    await queryRunner.dropForeignKey('projects', teamForeignKey);
}

// # Drop projects table
await queryRunner.dropTable('projects');

    }
}

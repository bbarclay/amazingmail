import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateFileStorageTable1660000000031 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        
await queryRunner.createTable(new Table({
    name: 'file_storage',
    columns: [
        {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
        },
        {
            name: 'file_name',
            type: 'varchar',
        },
        {
            name: 'file_path',
            type: 'varchar',
        },
        {
            name: 'uploaded_by',
            type: 'uuid',
            isNullable: true,
        },
        {
            name: 'project_id',
            type: 'uuid',
            isNullable: true,
        },
        {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
        },
    ],
}));

// # Add foreign key for uploaded_by
await queryRunner.createForeignKey('file_storage', new TableForeignKey({
    columnNames: ['uploaded_by'],
    referencedTableName: 'users',
    referencedColumnNames: ['id'],
    onDelete: 'SET NULL',
}));

// # Add foreign key for project_id
await queryRunner.createForeignKey('file_storage', new TableForeignKey({
    columnNames: ['project_id'],
    referencedTableName: 'projects',
    referencedColumnNames: ['id'],
    onDelete: 'SET NULL',
}));

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
// # Drop foreign keys from file_storage
const table = await queryRunner.getTable('file_storage');
const uploadedByForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('uploaded_by') !== -1);
if (uploadedByForeignKey) {
    await queryRunner.dropForeignKey('file_storage', uploadedByForeignKey);
}

const projectForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('project_id') !== -1);
if (projectForeignKey) {
    await queryRunner.dropForeignKey('file_storage', projectForeignKey);
}

// # Drop file_storage table
await queryRunner.dropTable('file_storage');

    }
}

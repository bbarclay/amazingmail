import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateFileStorageTable1660000000031 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Ensure uuid-ossp extension is enabled
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

        // Create the file_storage table with additional fields
        await queryRunner.createTable(
            new Table({
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
                        isNullable: false,
                    },
                    {
                        name: 'file_path',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'mime_type',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'size',
                        type: 'bigint',
                        isNullable: true,
                    },
                    {
                        name: 'description',
                        type: 'text',
                        isNullable: true,
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
                        default: 'now()',
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        default: 'now()',
                        onUpdate: 'now()',
                    },
                ],
            }),
            true // Indicates that the table should be created if it doesn't exist
        );

        // Add foreign key for uploaded_by
        await queryRunner.createForeignKey(
            'file_storage',
            new TableForeignKey({
                columnNames: ['uploaded_by'],
                referencedTableName: 'users',
                referencedColumnNames: ['id'],
                onDelete: 'SET NULL',
            })
        );

        // Add foreign key for project_id
        await queryRunner.createForeignKey(
            'file_storage',
            new TableForeignKey({
                columnNames: ['project_id'],
                referencedTableName: 'projects',
                referencedColumnNames: ['id'],
                onDelete: 'SET NULL',
            })
        );

        // Create indexes for foreign keys to optimize queries
        await queryRunner.createIndex(
            'file_storage',
            new TableIndex({
                name: 'IDX_FILE_STORAGE_UPLOADED_BY',
                columnNames: ['uploaded_by'],
            })
        );

        await queryRunner.createIndex(
            'file_storage',
            new TableIndex({
                name: 'IDX_FILE_STORAGE_PROJECT_ID',
                columnNames: ['project_id'],
            })
        );

        // Optional: Create an index on file_name if frequent searches by file_name are expected
        await queryRunner.createIndex(
            'file_storage',
            new TableIndex({
                name: 'IDX_FILE_STORAGE_FILE_NAME',
                columnNames: ['file_name'],
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop indexes
        await queryRunner.dropIndex('file_storage', 'IDX_FILE_STORAGE_FILE_NAME');
        await queryRunner.dropIndex('file_storage', 'IDX_FILE_STORAGE_PROJECT_ID');
        await queryRunner.dropIndex('file_storage', 'IDX_FILE_STORAGE_UPLOADED_BY');

        // Drop foreign keys
        const table = await queryRunner.getTable('file_storage');
        if (table) {
            const foreignKeys = table.foreignKeys;

            const uploadedByForeignKey = foreignKeys.find(
                (fk) => fk.columnNames.indexOf('uploaded_by') !== -1
            );
            if (uploadedByForeignKey) {
                await queryRunner.dropForeignKey('file_storage', uploadedByForeignKey);
            }

            const projectForeignKey = foreignKeys.find(
                (fk) => fk.columnNames.indexOf('project_id') !== -1
            );
            if (projectForeignKey) {
                await queryRunner.dropForeignKey('file_storage', projectForeignKey);
            }
        }

        // Drop the file_storage table
        await queryRunner.dropTable('file_storage');

        // Optionally, drop the uuid-ossp extension if it was created by this migration
        // Be cautious with this in environments where other tables might use it
        // await queryRunner.query(`DROP EXTENSION IF EXISTS "uuid-ossp"`);
    }
}

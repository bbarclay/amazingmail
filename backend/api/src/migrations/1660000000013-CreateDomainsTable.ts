import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateDomainsTable1660000000013 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'domains',
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
                    name: 'user_id',
                    type: 'uuid',
                },
                {
                    name: 'status',
                    type: 'varchar',
                    default: "'pending'",
                },
                {
                    name: 'verification_token',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'verified_at',
                    type: 'timestamp',
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

        // Add foreign key for user_id
        await queryRunner.createForeignKey('domains', new TableForeignKey({
            columnNames: ['user_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
        }));

        // Create index for name
        await queryRunner.createIndex('domains', new TableIndex({
            name: 'IDX_DOMAINS_NAME',
            columnNames: ['name'],
        }));

        // Create index for user_id
        await queryRunner.createIndex('domains', new TableIndex({
            name: 'IDX_DOMAINS_USER_ID',
            columnNames: ['user_id'],
        }));

        // Create index for status
        await queryRunner.createIndex('domains', new TableIndex({
            name: 'IDX_DOMAINS_STATUS',
            columnNames: ['status'],
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop indexes
        await queryRunner.dropIndex('domains', 'IDX_DOMAINS_NAME');
        await queryRunner.dropIndex('domains', 'IDX_DOMAINS_USER_ID');
        await queryRunner.dropIndex('domains', 'IDX_DOMAINS_STATUS');

        // Drop foreign key from domains
        const table = await queryRunner.getTable('domains');
        const userForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('user_id') !== -1);
        if (userForeignKey) {
            await queryRunner.dropForeignKey('domains', userForeignKey);
        }

        // Drop domains table
        await queryRunner.dropTable('domains');
    }
}

import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

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
await queryRunner.createForeignKey('domains', new TableForeignKey({
    columnNames: ['user_id'],
    referencedTableName: 'users',
    referencedColumnNames: ['id'],
    onDelete: 'CASCADE',
}));

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
// # Drop foreign key from domains
const table = await queryRunner.getTable('domains');
const userForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('user_id') !== -1);
if (userForeignKey) {
    await queryRunner.dropForeignKey('domains', userForeignKey);
}

// # Drop domains table
await queryRunner.dropTable('domains');

    }
}

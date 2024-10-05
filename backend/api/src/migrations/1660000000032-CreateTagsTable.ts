import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateTagsTable1660000000032 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        
await queryRunner.createTable(new Table({
    name: 'tags',
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
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
        },
    ],
}));

// # Create join table for campaigns and tags
await queryRunner.createTable(new Table({
    name: 'campaign_tags',
    columns: [
        {
            name: 'campaign_id',
            type: 'uuid',
            isPrimary: true,
        },
        {
            name: 'tag_id',
            type: 'uuid',
            isPrimary: true,
        },
    ],
}));

// # Add foreign key for campaign_id
await queryRunner.createForeignKey('campaign_tags', new TableForeignKey({
    columnNames: ['campaign_id'],
    referencedTableName: 'campaigns',
    referencedColumnNames: ['id'],
    onDelete: 'CASCADE',
}));

// # Add foreign key for tag_id
await queryRunner.createForeignKey('campaign_tags', new TableForeignKey({
    columnNames: ['tag_id'],
    referencedTableName: 'tags',
    referencedColumnNames: ['id'],
    onDelete: 'CASCADE',
}));

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
// # Drop foreign keys from campaign_tags
const table = await queryRunner.getTable('campaign_tags');
const campaignForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('campaign_id') !== -1);
if (campaignForeignKey) {
    await queryRunner.dropForeignKey('campaign_tags', campaignForeignKey);
}

const tagForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('tag_id') !== -1);
if (tagForeignKey) {
    await queryRunner.dropForeignKey('campaign_tags', tagForeignKey);
}

// # Drop campaign_tags table and tags table
await queryRunner.dropTable('campaign_tags');
await queryRunner.dropTable('tags');

    }
}

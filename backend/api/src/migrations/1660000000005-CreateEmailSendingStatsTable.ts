import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex, TableUnique } from 'typeorm';

export class CreateEmailSendingStatsTable1660000000005 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create the email_sending_stats table
        await queryRunner.createTable(
            new Table({
                name: 'email_sending_stats',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'email_account_id',
                        type: 'uuid',
                        isNullable: false,
                    },
                    {
                        name: 'date',
                        type: 'date',
                        isNullable: false,
                    },
                    {
                        name: 'sent_count',
                        type: 'integer',
                        isNullable: false,
                        default: 0,
                    },
                ],
                uniques: [
                    new TableUnique({
                        name: 'UQ_EMAIL_SENDING_STATS_ACCOUNT_DATE',
                        columnNames: ['email_account_id', 'date'],
                    }),
                ],
            }),
            true
        );

        // Add foreign key for email_account_id
        await queryRunner.createForeignKey('email_sending_stats', new TableForeignKey({
            name: 'FK_EMAIL_SENDING_STATS_EMAIL_ACCOUNT',
            columnNames: ['email_account_id'],
            referencedTableName: 'email_accounts',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
        }));

        // Create indexes
        await queryRunner.createIndex('email_sending_stats', new TableIndex({
            name: 'IDX_EMAIL_SENDING_STATS_EMAIL_ACCOUNT_ID',
            columnNames: ['email_account_id'],
        }));

        await queryRunner.createIndex('email_sending_stats', new TableIndex({
            name: 'IDX_EMAIL_SENDING_STATS_DATE',
            columnNames: ['date'],
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop indexes
        await queryRunner.dropIndex('email_sending_stats', 'IDX_EMAIL_SENDING_STATS_DATE');
        await queryRunner.dropIndex('email_sending_stats', 'IDX_EMAIL_SENDING_STATS_EMAIL_ACCOUNT_ID');

        // Drop foreign key
        const table = await queryRunner.getTable('email_sending_stats');
        if (table) {
            const foreignKey = table.foreignKeys.find(fk => fk.name === 'FK_EMAIL_SENDING_STATS_EMAIL_ACCOUNT');
            if (foreignKey) {
                await queryRunner.dropForeignKey('email_sending_stats', foreignKey);
            }
        }

        // Drop unique constraint
        await queryRunner.dropUniqueConstraint('email_sending_stats', 'UQ_EMAIL_SENDING_STATS_ACCOUNT_DATE');

        // Drop email_sending_stats table
        await queryRunner.dropTable('email_sending_stats');
    }
}

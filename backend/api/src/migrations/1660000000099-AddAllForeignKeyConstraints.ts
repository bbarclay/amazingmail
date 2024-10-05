import { MigrationInterface, QueryRunner, TableForeignKey } from "typeorm";

export class AddAllForeignKeyConstraints1660000000099 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const addForeignKeyIfNotExists = async (tableName: string, foreignKey: TableForeignKey) => {
            const tableExists = await queryRunner.hasTable(tableName);
            if (!tableExists) {
                console.log();
                return;
            }

            const table = await queryRunner.getTable(tableName);
            const existingForeignKey = table.foreignKeys.find(fk => 
                fk.columnNames.join(',') === foreignKey.columnNames.join(',') &&
                fk.referencedTableName === foreignKey.referencedTableName &&
                fk.referencedColumnNames.join(',') === foreignKey.referencedColumnNames.join(',')
            );
            if (!existingForeignKey) {
                await queryRunner.createForeignKey(tableName, foreignKey);
            }
        };

        // Users table foreign keys
        await addForeignKeyIfNotExists('users', new TableForeignKey({
            columnNames: ['organization_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'organizations',
            onDelete: 'SET NULL',
        }));

        // Teams table foreign keys
        await addForeignKeyIfNotExists('teams', new TableForeignKey({
            columnNames: ['organization_id'],
            referencedTableName: 'organizations',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
        }));
        await addForeignKeyIfNotExists('teams', new TableForeignKey({
            columnNames: ['created_by'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
        }));

        // Add the rest of the foreign keys using the addForeignKeyIfNotExists function
        // ...

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const tables = [
            'users', 'teams', 'email_account_campaigns', 'roles', 'organizations',
            'email_sending_stats', 'user_roles', 'role_permissions', 'api_keys',
            'connected_accounts', 'activity_logs', 'audit_logs', 'notifications',
            'domains', 'campaigns', 'templates', 'subscriptions', 'payments',
            'integrations', 'webhooks', 'reports', 'bulk_leads_management',
            'email_tracking', 'support_tickets', 'attachments', 'emails',
            'settings', 'projects', 'analytics', 'notifications_preferences',
            'file_storage', 'campaign_tags', 'email_templates', 'notifications_logs',
            'audit_trail', 'rate_limits', 'oauth_tokens', 'feedback',
            'billing_history', 'audit_events', 'api_usage', 'email_deliveries',
            'api_keys_usage', 'sessions'
        ];

        for (const table of tables) {
            const tableExists = await queryRunner.hasTable(table);
            if (tableExists) {
                const tableObj = await queryRunner.getTable(table);
                const foreignKeys = tableObj.foreignKeys;
                for (const foreignKey of foreignKeys) {
                    await queryRunner.dropForeignKey(table, foreignKey);
                }
            }
        }
    }
}

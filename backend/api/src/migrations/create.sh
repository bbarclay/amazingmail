// #// #Instructions for AI; It's critical we keep everything below. Improve on the migrations, add proper index. make sure it's formated properly. also add other tables and fields if you think we are missing something. 

// #this is a cold email delivery system like instantly, or smartlead.ai

// #We will be uploading emails and sending out campaigns, tracking those compains etc. 

// #so now, I need you to improve on this script. and do not leave anything out. You must return in the existing format, but with all your database administrator suggestions imporvements. Notes in tables, if that's still a thing. YOu must work this in the best way possible, returning everyting plus improvements, enhancements, optmiizations, scale technics etc. 

// #now write the new bash script and do not leave anything out.

// #!/bin/bash

// # Ensure the migrations directory exists
mkdir -p migrations

// # Function to create a migration file with up and down methods
create_migration() {
  local filename=$1
  local classname=$2
  local up_content=$3
  local down_content=$4

  cat <<EOL > migrations/$filename
import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class $classname implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        $up_content
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        $down_content
    }
}
EOL
}

// # Migration 1: Create Users Table
create_migration "1660000000001-CreateUsersTable.ts" "CreateUsersTable1660000000001" "
await queryRunner.createTable(new Table({
    name: 'users',
    columns: [
        {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
        },
        {
            name: 'email',
            type: 'varchar',
            isUnique: true,
        },
        {
            name: 'name',
            type: 'varchar',
            isNullable: true,
        },
        {
            name: 'password',
            type: 'varchar',
        },
        {
            name: 'api_key',
            type: 'varchar',
            isNullable: true,
        },
        {
            name: 'settings',
            type: 'json',
            isNullable: true,
        },
        {
            name: 'team_id',
            type: 'uuid',
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
        },
    ],
}));

// # Add foreign key for team_id
await queryRunner.createForeignKey('users', new TableForeignKey({
    columnNames: ['team_id'],
    referencedTableName: 'teams',
    referencedColumnNames: ['id'],
    onDelete: 'SET NULL',
}));

// # Add foreign key for organization_id
await queryRunner.createForeignKey('users', new TableForeignKey({
    columnNames: ['organization_id'],
    referencedTableName: 'organizations',
    referencedColumnNames: ['id'],
    onDelete: 'SET NULL',
}));
" "
// # Drop foreign keys from users
const table = await queryRunner.getTable('users');
const teamForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('team_id') !== -1);
if (teamForeignKey) {
    await queryRunner.dropForeignKey('users', teamForeignKey);
}

const orgForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('organization_id') !== -1);
if (orgForeignKey) {
    await queryRunner.dropForeignKey('users', orgForeignKey);
}

// # Drop users table
await queryRunner.dropTable('users');
"

// # Migration 2: Create Organizations Table
create_migration "1660000000002-CreateOrganizationsTable.ts" "CreateOrganizationsTable1660000000002" "
await queryRunner.createTable(new Table({
    name: 'organizations',
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
        {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
        },
    ],
}));
" "
// # Drop organizations table
await queryRunner.dropTable('organizations');
"

// # Migration 3: Create Teams Table
create_migration "1660000000003-CreateTeamsTable.ts" "CreateTeamsTable1660000000003" "
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
            isUnique: true,
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
        },
    ],
}));

// # Add foreign key for organization_id
await queryRunner.createForeignKey('teams', new TableForeignKey({
    columnNames: ['organization_id'],
    referencedTableName: 'organizations',
    referencedColumnNames: ['id'],
    onDelete: 'SET NULL',
}));
" "
// # Drop foreign key from teams
const table = await queryRunner.getTable('teams');
const orgForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('organization_id') !== -1);
if (orgForeignKey) {
    await queryRunner.dropForeignKey('teams', orgForeignKey);
}

// # Drop teams table
await queryRunner.dropTable('teams');
"

// # Migration 4: Create Roles Table
create_migration "1660000000004-CreateRolesTable.ts" "CreateRolesTable1660000000004" "
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
            isUnique: true,
        },
        {
            name: 'permissions',
            type: 'json',
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
" "
// # Drop roles table
await queryRunner.dropTable('roles');
"

// # Migration 5: Create Permissions Table
create_migration "1660000000005-CreatePermissionsTable.ts" "CreatePermissionsTable1660000000005" "
await queryRunner.createTable(new Table({
    name: 'permissions',
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
            name: 'description',
            type: 'text',
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
" "
// # Drop permissions table
await queryRunner.dropTable('permissions');
"

// # Migration 6: Create UserRoles Join Table
create_migration "1660000000006-CreateUserRolesTable.ts" "CreateUserRolesTable1660000000006" "
await queryRunner.createTable(new Table({
    name: 'user_roles',
    columns: [
        {
            name: 'user_id',
            type: 'uuid',
            isPrimary: true,
        },
        {
            name: 'role_id',
            type: 'uuid',
            isPrimary: true,
        },
    ],
}));

// # Add foreign key for user_id
await queryRunner.createForeignKey('user_roles', new TableForeignKey({
    columnNames: ['user_id'],
    referencedTableName: 'users',
    referencedColumnNames: ['id'],
    onDelete: 'CASCADE',
}));

// # Add foreign key for role_id
await queryRunner.createForeignKey('user_roles', new TableForeignKey({
    columnNames: ['role_id'],
    referencedTableName: 'roles',
    referencedColumnNames: ['id'],
    onDelete: 'CASCADE',
}));
" "
// # Drop foreign keys from user_roles
const table = await queryRunner.getTable('user_roles');
const userForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('user_id') !== -1);
if (userForeignKey) {
    await queryRunner.dropForeignKey('user_roles', userForeignKey);
}

const roleForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('role_id') !== -1);
if (roleForeignKey) {
    await queryRunner.dropForeignKey('user_roles', roleForeignKey);
}

// # Drop user_roles table
await queryRunner.dropTable('user_roles');
"

// # Migration 7: Create RolePermissions Join Table
create_migration "1660000000007-CreateRolePermissionsTable.ts" "CreateRolePermissionsTable1660000000007" "
await queryRunner.createTable(new Table({
    name: 'role_permissions',
    columns: [
        {
            name: 'role_id',
            type: 'uuid',
            isPrimary: true,
        },
        {
            name: 'permission_id',
            type: 'uuid',
            isPrimary: true,
        },
    ],
}));

// # Add foreign key for role_id
await queryRunner.createForeignKey('role_permissions', new TableForeignKey({
    columnNames: ['role_id'],
    referencedTableName: 'roles',
    referencedColumnNames: ['id'],
    onDelete: 'CASCADE',
}));

// # Add foreign key for permission_id
await queryRunner.createForeignKey('role_permissions', new TableForeignKey({
    columnNames: ['permission_id'],
    referencedTableName: 'permissions',
    referencedColumnNames: ['id'],
    onDelete: 'CASCADE',
}));
" "
// # Drop foreign keys from role_permissions
const table = await queryRunner.getTable('role_permissions');
const roleForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('role_id') !== -1);
if (roleForeignKey) {
    await queryRunner.dropForeignKey('role_permissions', roleForeignKey);
}

const permissionForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('permission_id') !== -1);
if (permissionForeignKey) {
    await queryRunner.dropForeignKey('role_permissions', permissionForeignKey);
}

// # Drop role_permissions table
await queryRunner.dropTable('role_permissions');
"

// # Migration 8: Create ApiKeys Table
create_migration "1660000000008-CreateApiKeysTable.ts" "CreateApiKeysTable1660000000008" "
await queryRunner.createTable(new Table({
    name: 'api_keys',
    columns: [
        {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
        },
        {
            name: 'key',
            type: 'varchar',
            isUnique: true,
        },
        {
            name: 'description',
            type: 'varchar',
            isNullable: true,
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
await queryRunner.createForeignKey('api_keys', new TableForeignKey({
    columnNames: ['user_id'],
    referencedTableName: 'users',
    referencedColumnNames: ['id'],
    onDelete: 'CASCADE',
}));
" "
// # Drop foreign key from api_keys
const table = await queryRunner.getTable('api_keys');
const userForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('user_id') !== -1);
if (userForeignKey) {
    await queryRunner.dropForeignKey('api_keys', userForeignKey);
}

// # Drop api_keys table
await queryRunner.dropTable('api_keys');
"

// # Migration 9: Create ConnectedAccounts Table
create_migration "1660000000009-CreateConnectedAccountsTable.ts" "CreateConnectedAccountsTable1660000000009" "
await queryRunner.createTable(new Table({
    name: 'connected_accounts',
    columns: [
        {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
        },
        {
            name: 'user_id',
            type: 'uuid',
        },
        {
            name: 'account_type',
            type: 'varchar',
        },
        {
            name: 'account_id',
            type: 'varchar',
        },
        {
            name: 'access_token',
            type: 'varchar',
        },
        {
            name: 'refresh_token',
            type: 'varchar',
            isNullable: true,
        },
        {
            name: 'account_details',
            type: 'json',
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
await queryRunner.createForeignKey('connected_accounts', new TableForeignKey({
    columnNames: ['user_id'],
    referencedTableName: 'users',
    referencedColumnNames: ['id'],
    onDelete: 'CASCADE',
}));
" "
// # Drop foreign key from connected_accounts
const table = await queryRunner.getTable('connected_accounts');
const userForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('user_id') !== -1);
if (userForeignKey) {
    await queryRunner.dropForeignKey('connected_accounts', userForeignKey);
}

// # Drop connected_accounts table
await queryRunner.dropTable('connected_accounts');
"

// # Migration 10: Create ActivityLogs Table
create_migration "1660000000010-CreateActivityLogsTable.ts" "CreateActivityLogsTable1660000000010" "
await queryRunner.createTable(new Table({
    name: 'activity_logs',
    columns: [
        {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
        },
        {
            name: 'user_id',
            type: 'uuid',
            isNullable: true,
        },
        {
            name: 'action',
            type: 'varchar',
        },
        {
            name: 'metadata',
            type: 'json',
            isNullable: true,
        },
        {
            name: 'timestamp',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
        },
    ],
}));

// # Add foreign key for user_id
await queryRunner.createForeignKey('activity_logs', new TableForeignKey({
    columnNames: ['user_id'],
    referencedTableName: 'users',
    referencedColumnNames: ['id'],
    onDelete: 'SET NULL',
}));
" "
// # Drop foreign key from activity_logs
const table = await queryRunner.getTable('activity_logs');
const userForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('user_id') !== -1);
if (userForeignKey) {
    await queryRunner.dropForeignKey('activity_logs', userForeignKey);
}

// # Drop activity_logs table
await queryRunner.dropTable('activity_logs');
"

// # Migration 11: Create AuditLogs Table
create_migration "1660000000011-CreateAuditLogsTable.ts" "CreateAuditLogsTable1660000000011" "
await queryRunner.createTable(new Table({
    name: 'audit_logs',
    columns: [
        {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
        },
        {
            name: 'action',
            type: 'varchar',
        },
        {
            name: 'performed_by',
            type: 'uuid',
            isNullable: true,
        },
        {
            name: 'details',
            type: 'json',
            isNullable: true,
        },
        {
            name: 'timestamp',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
        },
    ],
}));

// # Add foreign key for performed_by
await queryRunner.createForeignKey('audit_logs', new TableForeignKey({
    columnNames: ['performed_by'],
    referencedTableName: 'users',
    referencedColumnNames: ['id'],
    onDelete: 'SET NULL',
}));
" "
// # Drop foreign key from audit_logs
const table = await queryRunner.getTable('audit_logs');
const performedByForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('performed_by') !== -1);
if (performedByForeignKey) {
    await queryRunner.dropForeignKey('audit_logs', performedByForeignKey);
}

// # Drop audit_logs table
await queryRunner.dropTable('audit_logs');
"

// # Migration 12: Create Notifications Table
create_migration "1660000000012-CreateNotificationsTable.ts" "CreateNotificationsTable1660000000012" "
await queryRunner.createTable(new Table({
    name: 'notifications',
    columns: [
        {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
        },
        {
            name: 'user_id',
            type: 'uuid',
        },
        {
            name: 'type',
            type: 'varchar',
        },
        {
            name: 'message',
            type: 'text',
        },
        {
            name: 'is_read',
            type: 'boolean',
            default: false,
        },
        {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
        },
    ],
}));

// # Add foreign key for user_id
await queryRunner.createForeignKey('notifications', new TableForeignKey({
    columnNames: ['user_id'],
    referencedTableName: 'users',
    referencedColumnNames: ['id'],
    onDelete: 'CASCADE',
}));
" "
// # Drop foreign key from notifications
const table = await queryRunner.getTable('notifications');
const userForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('user_id') !== -1);
if (userForeignKey) {
    await queryRunner.dropForeignKey('notifications', userForeignKey);
}

// # Drop notifications table
await queryRunner.dropTable('notifications');
"

// # Migration 13: Create Domains Table
create_migration "1660000000013-CreateDomainsTable.ts" "CreateDomainsTable1660000000013" "
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
" "
// # Drop foreign key from domains
const table = await queryRunner.getTable('domains');
const userForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('user_id') !== -1);
if (userForeignKey) {
    await queryRunner.dropForeignKey('domains', userForeignKey);
}

// # Drop domains table
await queryRunner.dropTable('domains');
"

// # Migration 14: Create Campaigns Table
create_migration "1660000000014-CreateCampaignsTable.ts" "CreateCampaignsTable1660000000014" "
await queryRunner.createTable(new Table({
    name: 'campaigns',
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
            name: 'status',
            type: 'varchar',
        },
        {
            name: 'date_created',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
        },
        {
            name: 'user_id',
            type: 'uuid',
        },
    ],
}));

// # Add foreign key for user_id
await queryRunner.createForeignKey('campaigns', new TableForeignKey({
    columnNames: ['user_id'],
    referencedTableName: 'users',
    referencedColumnNames: ['id'],
    onDelete: 'CASCADE',
}));
" "
// # Drop foreign key from campaigns
const table = await queryRunner.getTable('campaigns');
const userForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('user_id') !== -1);
if (userForeignKey) {
    await queryRunner.dropForeignKey('campaigns', userForeignKey);
}

// # Drop campaigns table
await queryRunner.dropTable('campaigns');
"

// # Migration 15: Create Templates Table
create_migration "1660000000015-CreateTemplatesTable.ts" "CreateTemplatesTable1660000000015" "
await queryRunner.createTable(new Table({
    name: 'templates',
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
            name: 'content',
            type: 'json',
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
await queryRunner.createForeignKey('templates', new TableForeignKey({
    columnNames: ['user_id'],
    referencedTableName: 'users',
    referencedColumnNames: ['id'],
    onDelete: 'CASCADE',
}));
" "
// # Drop foreign key from templates
const table = await queryRunner.getTable('templates');
const userForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('user_id') !== -1);
if (userForeignKey) {
    await queryRunner.dropForeignKey('templates', userForeignKey);
}

// # Drop templates table
await queryRunner.dropTable('templates');
"

// # Migration 16: Create Subscriptions Table
create_migration "1660000000016-CreateSubscriptionsTable.ts" "CreateSubscriptionsTable1660000000016" "
await queryRunner.createTable(new Table({
    name: 'subscriptions',
    columns: [
        {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
        },
        {
            name: 'user_id',
            type: 'uuid',
        },
        {
            name: 'plan',
            type: 'varchar',
        },
        {
            name: 'status',
            type: 'varchar',
        },
        {
            name: 'start_date',
            type: 'timestamp',
        },
        {
            name: 'end_date',
            type: 'timestamp',
        },
    ],
}));

// # Add foreign key for user_id
await queryRunner.createForeignKey('subscriptions', new TableForeignKey({
    columnNames: ['user_id'],
    referencedTableName: 'users',
    referencedColumnNames: ['id'],
    onDelete: 'CASCADE',
}));
" "
// # Drop foreign key from subscriptions
const table = await queryRunner.getTable('subscriptions');
const userForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('user_id') !== -1);
if (userForeignKey) {
    await queryRunner.dropForeignKey('subscriptions', userForeignKey);
}

// # Drop subscriptions table
await queryRunner.dropTable('subscriptions');
"

// # Migration 17: Create Payments Table
create_migration "1660000000017-CreatePaymentsTable.ts" "CreatePaymentsTable1660000000017" "
await queryRunner.createTable(new Table({
    name: 'payments',
    columns: [
        {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
        },
        {
            name: 'user_id',
            type: 'uuid',
            isNullable: true,
        },
        {
            name: 'amount',
            type: 'decimal',
        },
        {
            name: 'currency',
            type: 'varchar',
        },
        {
            name: 'payment_date',
            type: 'timestamp',
        },
    ],
}));

// # Add foreign key for user_id
await queryRunner.createForeignKey('payments', new TableForeignKey({
    columnNames: ['user_id'],
    referencedTableName: 'users',
    referencedColumnNames: ['id'],
    onDelete: 'SET NULL',
}));
" "
// # Drop foreign key from payments
const table = await queryRunner.getTable('payments');
const userForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('user_id') !== -1);
if (userForeignKey) {
    await queryRunner.dropForeignKey('payments', userForeignKey);
}

// # Drop payments table
await queryRunner.dropTable('payments');
"

// # Migration 18: Create Leads Table
create_migration "1660000000018-CreateLeadsTable.ts" "CreateLeadsTable1660000000018" "
await queryRunner.createTable(new Table({
    name: 'leads',
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
            name: 'email',
            type: 'varchar',
            isUnique: true,
        },
        {
            name: 'company',
            type: 'varchar',
        },
        {
            name: 'status',
            type: 'varchar',
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
" "
// # Drop leads table
await queryRunner.dropTable('leads');
"

// # Migration 19: Create Integrations Table
create_migration "1660000000019-CreateIntegrationsTable.ts" "CreateIntegrationsTable1660000000019" "
await queryRunner.createTable(new Table({
    name: 'integrations',
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
            name: 'type',
            type: 'varchar',
        },
        {
            name: 'config',
            type: 'json',
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
await queryRunner.createForeignKey('integrations', new TableForeignKey({
    columnNames: ['user_id'],
    referencedTableName: 'users',
    referencedColumnNames: ['id'],
    onDelete: 'CASCADE',
}));
" "
// # Drop foreign key from integrations
const table = await queryRunner.getTable('integrations');
const userForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('user_id') !== -1);
if (userForeignKey) {
    await queryRunner.dropForeignKey('integrations', userForeignKey);
}

// # Drop integrations table
await queryRunner.dropTable('integrations');
"

// # Migration 20: Create Webhooks Table
create_migration "1660000000020-CreateWebhooksTable.ts" "CreateWebhooksTable1660000000020" "
await queryRunner.createTable(new Table({
    name: 'webhooks',
    columns: [
        {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
        },
        {
            name: 'url',
            type: 'varchar',
        },
        {
            name: 'event',
            type: 'varchar',
        },
        {
            name: 'payload',
            type: 'json',
            isNullable: true,
        },
        {
            name: 'organization_id',
            type: 'uuid',
        },
        {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
        },
    ],
}));

// # Add foreign key for organization_id
await queryRunner.createForeignKey('webhooks', new TableForeignKey({
    columnNames: ['organization_id'],
    referencedTableName: 'organizations',
    referencedColumnNames: ['id'],
    onDelete: 'CASCADE',
}));
" "
// # Drop foreign key from webhooks
const table = await queryRunner.getTable('webhooks');
const orgForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('organization_id') !== -1);
if (orgForeignKey) {
    await queryRunner.dropForeignKey('webhooks', orgForeignKey);
}

// # Drop webhooks table
await queryRunner.dropTable('webhooks');
"

// # Migration 21: Create Reports Table
create_migration "1660000000021-CreateReportsTable.ts" "CreateReportsTable1660000000021" "
await queryRunner.createTable(new Table({
    name: 'reports',
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
            name: 'data',
            type: 'json',
        },
        {
            name: 'user_id',
            type: 'uuid',
        },
        {
            name: 'campaign_id',
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

// # Add foreign key for user_id
await queryRunner.createForeignKey('reports', new TableForeignKey({
    columnNames: ['user_id'],
    referencedTableName: 'users',
    referencedColumnNames: ['id'],
    onDelete: 'CASCADE',
}));

// # Add foreign key for campaign_id
await queryRunner.createForeignKey('reports', new TableForeignKey({
    columnNames: ['campaign_id'],
    referencedTableName: 'campaigns',
    referencedColumnNames: ['id'],
    onDelete: 'SET NULL',
}));
" "
// # Drop foreign keys from reports
const table = await queryRunner.getTable('reports');
const userForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('user_id') !== -1);
if (userForeignKey) {
    await queryRunner.dropForeignKey('reports', userForeignKey);
}

const campaignForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('campaign_id') !== -1);
if (campaignForeignKey) {
    await queryRunner.dropForeignKey('reports', campaignForeignKey);
}

// # Drop reports table
await queryRunner.dropTable('reports');
"

// # Migration 22: Create EmailTracking Table
create_migration "1660000000022-CreateEmailTrackingTable.ts" "CreateEmailTrackingTable1660000000022" "
await queryRunner.createTable(new Table({
    name: 'email_tracking',
    columns: [
        {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
        },
        {
            name: 'email_id',
            type: 'uuid',
        },
        {
            name: 'campaign_id',
            type: 'uuid',
        },
        {
            name: 'user_id',
            type: 'uuid',
        },
        {
            name: 'opened_at',
            type: 'timestamp',
            isNullable: true,
        },
        {
            name: 'clicked_at',
            type: 'timestamp',
            isNullable: true,
        },
        {
            name: 'bounced_at',
            type: 'timestamp',
            isNullable: true,
        },
        {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
        },
    ],
}));

// # Add foreign key for email_id
await queryRunner.createForeignKey('email_tracking', new TableForeignKey({
    columnNames: ['email_id'],
    referencedTableName: 'emails',
    referencedColumnNames: ['id'],
    onDelete: 'CASCADE',
}));

// # Add foreign key for campaign_id
await queryRunner.createForeignKey('email_tracking', new TableForeignKey({
    columnNames: ['campaign_id'],
    referencedTableName: 'campaigns',
    referencedColumnNames: ['id'],
    onDelete: 'SET NULL',
}));

// # Add foreign key for user_id
await queryRunner.createForeignKey('email_tracking', new TableForeignKey({
    columnNames: ['user_id'],
    referencedTableName: 'users',
    referencedColumnNames: ['id'],
    onDelete: 'CASCADE',
}));
" "
// # Drop foreign keys from email_tracking
const table = await queryRunner.getTable('email_tracking');
const emailForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('email_id') !== -1);
if (emailForeignKey) {
    await queryRunner.dropForeignKey('email_tracking', emailForeignKey);
}

const campaignForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('campaign_id') !== -1);
if (campaignForeignKey) {
    await queryRunner.dropForeignKey('email_tracking', campaignForeignKey);
}

const userForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('user_id') !== -1);
if (userForeignKey) {
    await queryRunner.dropForeignKey('email_tracking', userForeignKey);
}

// # Drop email_tracking table
await queryRunner.dropTable('email_tracking');
"

// # Migration 23: Create SupportTickets Table
create_migration "1660000000023-CreateSupportTicketsTable.ts" "CreateSupportTicketsTable1660000000023" "
await queryRunner.createTable(new Table({
    name: 'support_tickets',
    columns: [
        {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
        },
        {
            name: 'subject',
            type: 'varchar',
        },
        {
            name: 'description',
            type: 'text',
        },
        {
            name: 'status',
            type: 'varchar',
            default: "'open'",
        },
        {
            name: 'priority',
            type: 'varchar',
            default: "'normal'",
        },
        {
            name: 'user_id',
            type: 'uuid',
        },
        {
            name: 'assigned_to',
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
await queryRunner.createForeignKey('support_tickets', new TableForeignKey({
    columnNames: ['user_id'],
    referencedTableName: 'users',
    referencedColumnNames: ['id'],
    onDelete: 'CASCADE',
}));

// # Add foreign key for assigned_to
await queryRunner.createForeignKey('support_tickets', new TableForeignKey({
    columnNames: ['assigned_to'],
    referencedTableName: 'users',
    referencedColumnNames: ['id'],
    onDelete: 'SET NULL',
}));
" "
// # Drop foreign keys from support_tickets
const table = await queryRunner.getTable('support_tickets');
const userForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('user_id') !== -1);
if (userForeignKey) {
    await queryRunner.dropForeignKey('support_tickets', userForeignKey);
}

const assignedForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('assigned_to') !== -1);
if (assignedForeignKey) {
    await queryRunner.dropForeignKey('support_tickets', assignedForeignKey);
}

// # Drop support_tickets table
await queryRunner.dropTable('support_tickets');
"

// # Migration 24: Create Attachments Table
create_migration "1660000000024-CreateAttachmentsTable.ts" "CreateAttachmentsTable1660000000024" "
await queryRunner.createTable(new Table({
    name: 'attachments',
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
            name: 'support_ticket_id',
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

// # Add foreign key for support_ticket_id
await queryRunner.createForeignKey('attachments', new TableForeignKey({
    columnNames: ['support_ticket_id'],
    referencedTableName: 'support_tickets',
    referencedColumnNames: ['id'],
    onDelete: 'CASCADE',
}));
" "
// # Drop foreign key from attachments
const table = await queryRunner.getTable('attachments');
const ticketForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('support_ticket_id') !== -1);
if (ticketForeignKey) {
    await queryRunner.dropForeignKey('attachments', ticketForeignKey);
}

// # Drop attachments table
await queryRunner.dropTable('attachments');
"

// # Migration 25: Create Emails Table
create_migration "1660000000025-CreateEmailsTable.ts" "CreateEmailsTable1660000000025" "
await queryRunner.createTable(new Table({
    name: 'emails',
    columns: [
        {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
        },
        {
            name: 'subject',
            type: 'varchar',
        },
        {
            name: 'body',
            type: 'text',
        },
        {
            name: 'recipient',
            type: 'varchar',
        },
        {
            name: 'sent_at',
            type: 'timestamp',
            isNullable: true,
        },
        {
            name: 'campaign_id',
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

// # Add foreign key for campaign_id
await queryRunner.createForeignKey('emails', new TableForeignKey({
    columnNames: ['campaign_id'],
    referencedTableName: 'campaigns',
    referencedColumnNames: ['id'],
    onDelete: 'SET NULL',
}));
" "
// # Drop foreign key from emails
const table = await queryRunner.getTable('emails');
const campaignForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('campaign_id') !== -1);
if (campaignForeignKey) {
    await queryRunner.dropForeignKey('emails', campaignForeignKey);
}

// # Drop emails table
await queryRunner.dropTable('emails');
"

// # Migration 26: Create Settings Table
create_migration "1660000000026-CreateSettingsTable.ts" "CreateSettingsTable1660000000026" "
await queryRunner.createTable(new Table({
    name: 'settings',
    columns: [
        {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
        },
        {
            name: 'key',
            type: 'varchar',
            isUnique: true,
        },
        {
            name: 'value',
            type: 'json',
            isNullable: true,
        },
        {
            name: 'user_id',
            type: 'uuid',
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
        },
    ],
}));

// # Add foreign key for user_id
await queryRunner.createForeignKey('settings', new TableForeignKey({
    columnNames: ['user_id'],
    referencedTableName: 'users',
    referencedColumnNames: ['id'],
    onDelete: 'CASCADE',
}));

// # Add foreign key for organization_id
await queryRunner.createForeignKey('settings', new TableForeignKey({
    columnNames: ['organization_id'],
    referencedTableName: 'organizations',
    referencedColumnNames: ['id'],
    onDelete: 'CASCADE',
}));
" "
// # Drop foreign keys from settings
const table = await queryRunner.getTable('settings');
const userForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('user_id') !== -1);
if (userForeignKey) {
    await queryRunner.dropForeignKey('settings', userForeignKey);
}

const orgForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('organization_id') !== -1);
if (orgForeignKey) {
    await queryRunner.dropForeignKey('settings', orgForeignKey);
}

// # Drop settings table
await queryRunner.dropTable('settings');
"

// # Migration 27: Create Projects Table
create_migration "1660000000027-CreateProjectsTable.ts" "CreateProjectsTable1660000000027" "
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
" "
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
"

// # Migration 28: Create Analytics Table
create_migration "1660000000028-CreateAnalyticsTable.ts" "CreateAnalyticsTable1660000000028" "
await queryRunner.createTable(new Table({
    name: 'analytics',
    columns: [
        {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
        },
        {
            name: 'metric',
            type: 'varchar',
        },
        {
            name: 'value',
            type: 'decimal',
        },
        {
            name: 'campaign_id',
            type: 'uuid',
            isNullable: true,
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
    ],
}));

// # Add foreign key for campaign_id
await queryRunner.createForeignKey('analytics', new TableForeignKey({
    columnNames: ['campaign_id'],
    referencedTableName: 'campaigns',
    referencedColumnNames: ['id'],
    onDelete: 'SET NULL',
}));

// # Add foreign key for user_id
await queryRunner.createForeignKey('analytics', new TableForeignKey({
    columnNames: ['user_id'],
    referencedTableName: 'users',
    referencedColumnNames: ['id'],
    onDelete: 'CASCADE',
}));
" "
// # Drop foreign keys from analytics
const table = await queryRunner.getTable('analytics');
const campaignForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('campaign_id') !== -1);
if (campaignForeignKey) {
    await queryRunner.dropForeignKey('analytics', campaignForeignKey);
}

const userForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('user_id') !== -1);
if (userForeignKey) {
    await queryRunner.dropForeignKey('analytics', userForeignKey);
}

// # Drop analytics table
await queryRunner.dropTable('analytics');
"

// # Migration 29: Create NotificationsPreferences Table
create_migration "1660000000029-CreateNotificationsPreferencesTable.ts" "CreateNotificationsPreferencesTable1660000000029" "
await queryRunner.createTable(new Table({
    name: 'notifications_preferences',
    columns: [
        {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
        },
        {
            name: 'user_id',
            type: 'uuid',
        },
        {
            name: 'preference',
            type: 'varchar',
        },
        {
            name: 'enabled',
            type: 'boolean',
            default: true,
        },
        {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
        },
    ],
}));

// # Add foreign key for user_id
await queryRunner.createForeignKey('notifications_preferences', new TableForeignKey({
    columnNames: ['user_id'],
    referencedTableName: 'users',
    referencedColumnNames: ['id'],
    onDelete: 'CASCADE',
}));
" "
// # Drop foreign key from notifications_preferences
const table = await queryRunner.getTable('notifications_preferences');
const userForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('user_id') !== -1);
if (userForeignKey) {
    await queryRunner.dropForeignKey('notifications_preferences', userForeignKey);
}

// # Drop notifications_preferences table
await queryRunner.dropTable('notifications_preferences');
"

// # Migration 30: Create Logs Table
create_migration "1660000000030-CreateLogsTable.ts" "CreateLogsTable1660000000030" "
await queryRunner.createTable(new Table({
    name: 'logs',
    columns: [
        {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
        },
        {
            name: 'level',
            type: 'varchar',
        },
        {
            name: 'message',
            type: 'text',
        },
        {
            name: 'meta',
            type: 'json',
            isNullable: true,
        },
        {
            name: 'timestamp',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
        },
    ],
}));
" "
// # Drop logs table
await queryRunner.dropTable('logs');
"

// # Migration 31: Create FileStorage Table
create_migration "1660000000031-CreateFileStorageTable.ts" "CreateFileStorageTable1660000000031" "
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
" "
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
"

// # Migration 32: Create Tags Table
create_migration "1660000000032-CreateTagsTable.ts" "CreateTagsTable1660000000032" "
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
" "
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
"

// # Migration 33: Create EmailTemplates Table
create_migration "1660000000033-CreateEmailTemplatesTable.ts" "CreateEmailTemplatesTable1660000000033" "
await queryRunner.createTable(new Table({
    name: 'email_templates',
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
            name: 'subject',
            type: 'varchar',
        },
        {
            name: 'body',
            type: 'text',
        },
        {
            name: 'variables',
            type: 'json',
            isNullable: true,
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
await queryRunner.createForeignKey('email_templates', new TableForeignKey({
    columnNames: ['user_id'],
    referencedTableName: 'users',
    referencedColumnNames: ['id'],
    onDelete: 'CASCADE',
}));
" "
// # Drop foreign key from email_templates
const table = await queryRunner.getTable('email_templates');
const userForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('user_id') !== -1);
if (userForeignKey) {
    await queryRunner.dropForeignKey('email_templates', userForeignKey);
}

// # Drop email_templates table
await queryRunner.dropTable('email_templates');
"

// # Migration 34: Create NotificationsLogs Table
create_migration "1660000000034-CreateNotificationsLogsTable.ts" "CreateNotificationsLogsTable1660000000034" "
await queryRunner.createTable(new Table({
    name: 'notifications_logs',
    columns: [
        {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
        },
        {
            name: 'notification_id',
            type: 'uuid',
        },
        {
            name: 'status',
            type: 'varchar',
        },
        {
            name: 'sent_at',
            type: 'timestamp',
            isNullable: true,
        },
        {
            name: 'delivered_at',
            type: 'timestamp',
            isNullable: true,
        },
        {
            name: 'read_at',
            type: 'timestamp',
            isNullable: true,
        },
        {
            name: 'error',
            type: 'text',
            isNullable: true,
        },
        {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
        },
    ],
}));

// # Add foreign key for notification_id
await queryRunner.createForeignKey('notifications_logs', new TableForeignKey({
    columnNames: ['notification_id'],
    referencedTableName: 'notifications',
    referencedColumnNames: ['id'],
    onDelete: 'CASCADE',
}));
" "
// # Drop foreign key from notifications_logs
const table = await queryRunner.getTable('notifications_logs');
const notificationForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('notification_id') !== -1);
if (notificationForeignKey) {
    await queryRunner.dropForeignKey('notifications_logs', notificationForeignKey);
}

// # Drop notifications_logs table
await queryRunner.dropTable('notifications_logs');
"

// # Migration 35: Create AuditTrail Table
create_migration "1660000000035-CreateAuditTrailTable.ts" "CreateAuditTrailTable1660000000035" "
await queryRunner.createTable(new Table({
    name: 'audit_trail',
    columns: [
        {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
        },
        {
            name: 'entity',
            type: 'varchar',
        },
        {
            name: 'entity_id',
            type: 'uuid',
        },
        {
            name: 'action',
            type: 'varchar',
        },
        {
            name: 'changes',
            type: 'json',
            isNullable: true,
        },
        {
            name: 'performed_by',
            type: 'uuid',
            isNullable: true,
        },
        {
            name: 'timestamp',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
        },
    ],
}));

// # Add foreign key for performed_by
await queryRunner.createForeignKey('audit_trail', new TableForeignKey({
    columnNames: ['performed_by'],
    referencedTableName: 'users',
    referencedColumnNames: ['id'],
    onDelete: 'SET NULL',
}));
" "
// # Drop foreign key from audit_trail
const table = await queryRunner.getTable('audit_trail');
const performedByForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('performed_by') !== -1);
if (performedByForeignKey) {
    await queryRunner.dropForeignKey('audit_trail', performedByForeignKey);
}

// # Drop audit_trail table
await queryRunner.dropTable('audit_trail');
"

// # Migration 36: Create MultiTenancy Table
create_migration "1660000000036-CreateMultiTenancyTable.ts" "CreateMultiTenancyTable1660000000036" "
await queryRunner.createTable(new Table({
    name: 'multi_tenancy',
    columns: [
        {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
        },
        {
            name: 'tenant_id',
            type: 'uuid',
            isUnique: true,
        },
        {
            name: 'config',
            type: 'json',
            isNullable: true,
        },
        {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
        },
    ],
}));
" "
// # Drop multi_tenancy table
await queryRunner.dropTable('multi_tenancy');
"

// # Migration 37: Create RateLimits Table
create_migration "1660000000037-CreateRateLimitsTable.ts" "CreateRateLimitsTable1660000000037" "
await queryRunner.createTable(new Table({
    name: 'rate_limits',
    columns: [
        {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
        },
        {
            name: 'user_id',
            type: 'uuid',
            isNullable: true,
        },
        {
            name: 'limit',
            type: 'integer',
        },
        {
            name: 'window',
            type: 'varchar', // # e.g., 'hour', 'day'
        },
        {
            name: 'remaining',
            type: 'integer',
            default: 0,
        },
        {
            name: 'reset_at',
            type: 'timestamp',
        },
        {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
        },
    ],
}));

// # Add foreign key for user_id
await queryRunner.createForeignKey('rate_limits', new TableForeignKey({
    columnNames: ['user_id'],
    referencedTableName: 'users',
    referencedColumnNames: ['id'],
    onDelete: 'SET NULL',
}));
" "
// # Drop foreign key from rate_limits
const table = await queryRunner.getTable('rate_limits');
const userForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('user_id') !== -1);
if (userForeignKey) {
    await queryRunner.dropForeignKey('rate_limits', userForeignKey);
}

// # Drop rate_limits table
await queryRunner.dropTable('rate_limits');
"

// # Migration 38: Create SSOProviders Table
create_migration "1660000000038-CreateSSOProvidersTable.ts" "CreateSSOProvidersTable1660000000038" "
await queryRunner.createTable(new Table({
    name: 'sso_providers',
    columns: [
        {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
        },
        {
            name: 'provider_name',
            type: 'varchar',
            isUnique: true,
        },
        {
            name: 'client_id',
            type: 'varchar',
        },
        {
            name: 'client_secret',
            type: 'varchar',
        },
        {
            name: 'redirect_uri',
            type: 'varchar',
        },
        {
            name: 'scopes',
            type: 'varchar',
            isNullable: true,
        },
        {
            name
// #!/bin/bash

// # Ensure the migrations directory exists
mkdir -p migrations

// # Function to create a migration file with up and down methods
create_migration() {
  local filename=$1
  local classname=$2
  local up_content=$3
  local down_content=$4

  cat <<EOL > migrations/$filename
import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class $classname implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        $up_content
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        $down_content
    }
}
EOL
}


// # Drop sso_providers table
await queryRunner.dropTable('sso_providers');
"

// # Migration 39: Create OAuthTokens Table
create_migration "1660000000039-CreateOAuthTokensTable.ts" "CreateOAuthTokensTable1660000000039" "
await queryRunner.createTable(new Table({
    name: 'oauth_tokens',
    columns: [
        {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
        },
        {
            name: 'user_id',
            type: 'uuid',
        },
        {
            name: 'provider_id',
            type: 'uuid',
        },
        {
            name: 'access_token',
            type: 'varchar',
        },
        {
            name: 'refresh_token',
            type: 'varchar',
            isNullable: true,
        },
        {
            name: 'expires_at',
            type: 'timestamp',
        },
        {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
        },
    ],
}));

// # Add foreign key for user_id
await queryRunner.createForeignKey('oauth_tokens', new TableForeignKey({
    columnNames: ['user_id'],
    referencedTableName: 'users',
    referencedColumnNames: ['id'],
    onDelete: 'CASCADE',
}));

// # Add foreign key for provider_id
await queryRunner.createForeignKey('oauth_tokens', new TableForeignKey({
    columnNames: ['provider_id'],
    referencedTableName: 'sso_providers',
    referencedColumnNames: ['id'],
    onDelete: 'CASCADE',
}));
" "
// # Drop foreign keys from oauth_tokens
const table = await queryRunner.getTable('oauth_tokens');
const userForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('user_id') !== -1);
if (userForeignKey) {
    await queryRunner.dropForeignKey('oauth_tokens', userForeignKey);
}

const providerForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('provider_id') !== -1);
if (providerForeignKey) {
    await queryRunner.dropForeignKey('oauth_tokens', providerForeignKey);
}

// # Drop oauth_tokens table and sso_providers table if needed
await queryRunner.dropTable('oauth_tokens');
// # Optionally, drop sso_providers table if not needed elsewhere
// # await queryRunner.dropTable('sso_providers');
"

// # Migration 40: Create Feedback Table
create_migration "1660000000040-CreateFeedbackTable.ts" "CreateFeedbackTable1660000000040" "
await queryRunner.createTable(new Table({
    name: 'feedback',
    columns: [
        {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
        },
        {
            name: 'user_id',
            type: 'uuid',
            isNullable: true,
        },
        {
            name: 'message',
            type: 'text',
        },
        {
            name: 'rating',
            type: 'integer',
            isNullable: true,
        },
        {
            name: 'source',
            type: 'varchar',
            isNullable: true,
        },
        {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
        },
    ],
}));

// # Add foreign key for user_id
await queryRunner.createForeignKey('feedback', new TableForeignKey({
    columnNames: ['user_id'],
    referencedTableName: 'users',
    referencedColumnNames: ['id'],
    onDelete: 'SET NULL',
}));
" "
// # Drop foreign key from feedback
const table = await queryRunner.getTable('feedback');
const userForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('user_id') !== -1);
if (userForeignKey) {
    await queryRunner.dropForeignKey('feedback', userForeignKey);
}

// # Drop feedback table
await queryRunner.dropTable('feedback');
"

// # Migration 41: Create BillingHistory Table
create_migration "1660000000041-CreateBillingHistoryTable.ts" "CreateBillingHistoryTable1660000000041" "
await queryRunner.createTable(new Table({
    name: 'billing_history',
    columns: [
        {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
        },
        {
            name: 'user_id',
            type: 'uuid',
        },
        {
            name: 'subscription_id',
            type: 'uuid',
        },
        {
            name: 'amount',
            type: 'decimal',
        },
        {
            name: 'currency',
            type: 'varchar',
        },
        {
            name: 'billing_date',
            type: 'timestamp',
        },
        {
            name: 'status',
            type: 'varchar',
        },
        {
            name: 'transaction_id',
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

// # Add foreign key for user_id
await queryRunner.createForeignKey('billing_history', new TableForeignKey({
    columnNames: ['user_id'],
    referencedTableName: 'users',
    referencedColumnNames: ['id'],
    onDelete: 'CASCADE',
}));

// # Add foreign key for subscription_id
await queryRunner.createForeignKey('billing_history', new TableForeignKey({
    columnNames: ['subscription_id'],
    referencedTableName: 'subscriptions',
    referencedColumnNames: ['id'],
    onDelete: 'SET NULL',
}));
" "
// # Drop foreign keys from billing_history
const table = await queryRunner.getTable('billing_history');
const userForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('user_id') !== -1);
if (userForeignKey) {
    await queryRunner.dropForeignKey('billing_history', userForeignKey);
}

const subscriptionForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('subscription_id') !== -1);
if (subscriptionForeignKey) {
    await queryRunner.dropForeignKey('billing_history', subscriptionForeignKey);
}

// # Drop billing_history table
await queryRunner.dropTable('billing_history');
"

// # Migration 42: Create AuditEvents Table
create_migration "1660000000042-CreateAuditEventsTable.ts" "CreateAuditEventsTable1660000000042" "
await queryRunner.createTable(new Table({
    name: 'audit_events',
    columns: [
        {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
        },
        {
            name: 'event_type',
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
            isNullable: true,
        },
        {
            name: 'metadata',
            type: 'json',
            isNullable: true,
        },
        {
            name: 'occurred_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
        },
    ],
}));

// # Add foreign key for user_id
await queryRunner.createForeignKey('audit_events', new TableForeignKey({
    columnNames: ['user_id'],
    referencedTableName: 'users',
    referencedColumnNames: ['id'],
    onDelete: 'SET NULL',
}));
" "
// # Drop foreign key from audit_events
const table = await queryRunner.getTable('audit_events');
const userForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('user_id') !== -1);
if (userForeignKey) {
    await queryRunner.dropForeignKey('audit_events', userForeignKey);
}

// # Drop audit_events table
await queryRunner.dropTable('audit_events');
"

// # Migration 43: Create APIUsage Table
create_migration "1660000000043-CreateAPIUsageTable.ts" "CreateAPIUsageTable1660000000043" "
await queryRunner.createTable(new Table({
    name: 'api_usage',
    columns: [
        {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
        },
        {
            name: 'api_key_id',
            type: 'uuid',
        },
        {
            name: 'endpoint',
            type: 'varchar',
        },
        {
            name: 'request_count',
            type: 'integer',
            default: 0,
        },
        {
            name: 'timestamp',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
        },
    ],
}));

// # Add foreign key for api_key_id
await queryRunner.createForeignKey('api_usage', new TableForeignKey({
    columnNames: ['api_key_id'],
    referencedTableName: 'api_keys',
    referencedColumnNames: ['id'],
    onDelete: 'CASCADE',
}));
" "
// # Drop foreign key from api_usage
const table = await queryRunner.getTable('api_usage');
const apiKeyForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('api_key_id') !== -1);
if (apiKeyForeignKey) {
    await queryRunner.dropForeignKey('api_usage', apiKeyForeignKey);
}

// # Drop api_usage table
await queryRunner.dropTable('api_usage');
"

// # Migration 44: Create Backup Table
create_migration "1660000000044-CreateBackupTable.ts" "CreateBackupTable1660000000044" "
await queryRunner.createTable(new Table({
    name: 'backup',
    columns: [
        {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
        },
        {
            name: 'table_name',
            type: 'varchar',
        },
        {
            name: 'backup_data',
            type: 'json',
        },
        {
            name: 'backup_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
        },
    ],
}));
" "
// # Drop backup table
await queryRunner.dropTable('backup');
"

// # Migration 45: Create NotificationsChannels Table
create_migration "1660000000045-CreateNotificationsChannelsTable.ts" "CreateNotificationsChannelsTable1660000000045" "
await queryRunner.createTable(new Table({
    name: 'notifications_channels',
    columns: [
        {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
        },
        {
            name: 'channel_name',
            type: 'varchar',
            isUnique: true,
        },
        {
            name: 'config',
            type: 'json',
            isNullable: true,
        },
        {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
        },
    ],
}));
" "
// # Drop notifications_channels table
await queryRunner.dropTable('notifications_channels');
"

// # Migration 46: Create EmailDeliveries Table
create_migration "1660000000046-CreateEmailDeliveriesTable.ts" "CreateEmailDeliveriesTable1660000000046" "
await queryRunner.createTable(new Table({
    name: 'email_deliveries',
    columns: [
        {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
        },
        {
            name: 'email_id',
            type: 'uuid',
        },
        {
            name: 'status',
            type: 'varchar',
        },
        {
            name: 'delivered_at',
            type: 'timestamp',
            isNullable: true,
        },
        {
            name: 'error_message',
            type: 'text',
            isNullable: true,
        },
        {
            name: 'provider_response',
            type: 'json',
            isNullable: true,
        },
        {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
        },
    ],
}));

// # Add foreign key for email_id
await queryRunner.createForeignKey('email_deliveries', new TableForeignKey({
    columnNames: ['email_id'],
    referencedTableName: 'emails',
    referencedColumnNames: ['id'],
    onDelete: 'CASCADE',
}));
" "
// # Drop foreign key from email_deliveries
const table = await queryRunner.getTable('email_deliveries');
const emailForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('email_id') !== -1);
if (emailForeignKey) {
    await queryRunner.dropForeignKey('email_deliveries', emailForeignKey);
}

// # Drop email_deliveries table
await queryRunner.dropTable('email_deliveries');
"

// # Migration 47: Create APIKeys Usage Tracking
create_migration "1660000000047-CreateAPIKeysUsageTracking.ts" "CreateAPIKeysUsageTracking1660000000047" "
await queryRunner.createTable(new Table({
    name: 'api_keys_usage',
    columns: [
        {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
        },
        {
            name: 'api_key_id',
            type: 'uuid',
        },
        {
            name: 'endpoint',
            type: 'varchar',
        },
        {
            name: 'request_count',
            type: 'integer',
            default: 0,
        },
        {
            name: 'timestamp',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
        },
    ],
}));

// # Add foreign key for api_key_id
await queryRunner.createForeignKey('api_keys_usage', new TableForeignKey({
    columnNames: ['api_key_id'],
    referencedTableName: 'api_keys',
    referencedColumnNames: ['id'],
    onDelete: 'CASCADE',
}));
" "
// # Drop foreign key from api_keys_usage
const table = await queryRunner.getTable('api_keys_usage');
const apiKeyForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('api_key_id') !== -1);
if (apiKeyForeignKey) {
    await queryRunner.dropForeignKey('api_keys_usage', apiKeyForeignKey);
}

// # Drop api_keys_usage table
await queryRunner.dropTable('api_keys_usage');
"

// # Migration 48: Create Session Table
create_migration "1660000000048-CreateSessionTable.ts" "CreateSessionTable1660000000048" "
await queryRunner.createTable(new Table({
    name: 'sessions',
    columns: [
        {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
        },
        {
            name: 'user_id',
            type: 'uuid',
        },
        {
            name: 'token',
            type: 'varchar',
            isUnique: true,
        },
        {
            name: 'expires_at',
            type: 'timestamp',
        },
        {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
        },
    ],
}));

// # Add foreign key for user_id
await queryRunner.createForeignKey('sessions', new TableForeignKey({
    columnNames: ['user_id'],
    referencedTableName: 'users',
    referencedColumnNames: ['id'],
    onDelete: 'CASCADE',
}));
" "
// # Drop foreign key from sessions
const table = await queryRunner.getTable('sessions');
const userForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('user_id') !== -1);
if (userForeignKey) {
    await queryRunner.dropForeignKey('sessions', userForeignKey);
}

// # Drop sessions table
await queryRunner.dropTable('sessions');
"

echo "All migration files have been created successfully in the migrations/ directory."

import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateSSOProvidersTable1660000000038 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        
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
  local filename=
  local classname=
  local up_content=
  local down_content=

  cat <<EOL > migrations/
import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class  implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
    }
}
EOL
}


// # Drop sso_providers table
await queryRunner.dropTable('sso_providers');

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
    }
}

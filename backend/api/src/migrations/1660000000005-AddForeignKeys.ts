import { MigrationInterface, QueryRunner, TableForeignKey } from "typeorm";

export class AddForeignKeys1660000000005 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Check if the foreign key for organization_id in users table already exists
        const userTable = await queryRunner.getTable("users");
        const existingForeignKey = userTable.foreignKeys.find(fk => fk.columnNames.indexOf("organization_id") !== -1);

        if (!existingForeignKey) {
            // Add foreign key for organization_id in users table
            await queryRunner.createForeignKey(
                "users",
                new TableForeignKey({
                    columnNames: ["organization_id"],
                    referencedColumnNames: ["id"],
                    referencedTableName: "organizations",
                    onDelete: "SET NULL",
                })
            );
        }

        // Add foreign key for owner_id in organizations table
        await queryRunner.createForeignKey(
            "organizations",
            new TableForeignKey({
                columnNames: ["owner_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "users",
                onDelete: "SET NULL",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove foreign key for organization_id from users table
        const usersTable = await queryRunner.getTable("users");
        const usersForeignKey = usersTable.foreignKeys.find(
            (fk) => fk.columnNames.indexOf("organization_id") !== -1
        );
        if (usersForeignKey) {
            await queryRunner.dropForeignKey("users", usersForeignKey);
        }

        // Remove foreign key for owner_id from organizations table
        const organizationsTable = await queryRunner.getTable("organizations");
        const organizationsForeignKey = organizationsTable.foreignKeys.find(
            (fk) => fk.columnNames.indexOf("owner_id") !== -1
        );
        if (organizationsForeignKey) {
            await queryRunner.dropForeignKey("organizations", organizationsForeignKey);
        }
    }
}

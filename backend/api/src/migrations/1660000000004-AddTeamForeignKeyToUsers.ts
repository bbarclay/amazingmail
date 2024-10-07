import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";

export class AddTeamForeignKeyToUsers1660000000004 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            "users",
            new TableColumn({
                name: "team_id",
                type: "uuid",
                isNullable: true,
            })
        );

        await queryRunner.createForeignKey(
            "users",
            new TableForeignKey({
                columnNames: ["team_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "teams",
                onDelete: "SET NULL",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("users");
        const foreignKey = table.foreignKeys.find(
            (fk) => fk.columnNames.indexOf("team_id") !== -1
        );
        await queryRunner.dropForeignKey("users", foreignKey);
        await queryRunner.dropColumn("users", "team_id");
    }
}

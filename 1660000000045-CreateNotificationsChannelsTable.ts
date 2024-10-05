
import { MigrationInterface, QueryRunner, Table, TableIndex } from "typeorm";

export class CreateNotificationsChannelsTable1660000000045 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "notifications_channels",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        default: "uuid_generate_v4()",
                    },
                    {
                        name: "user_id",
                        type: "uuid",
                    },
                    {
                        name: "channel_type",
                        type: "enum",
                        enum: ["email", "sms", "push"],
                    },
                    {
                        name: "is_enabled",
                        type: "boolean",
                        default: true,
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                ],
            }),
            true
        );

        await queryRunner.createIndex(
            "notifications_channels",
            new TableIndex({
                name: "IDX_NOTIFICATIONS_CHANNELS_USER_ID",
                columnNames: ["user_id"],
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("notifications_channels");
    }
}

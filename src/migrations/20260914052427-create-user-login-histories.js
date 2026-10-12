"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("user_login_histories", {
            id: {
                type: Sequelize.BIGINT,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },

            user_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                references: {
                    model: "users",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },

            login_at: {
                type: Sequelize.DATE,
                allowNull: true,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },

            logout_at: {
                type: Sequelize.DATE,
                allowNull: true,
            },

            ip_address: {
                type: Sequelize.INET,
                allowNull: true,
            },

            user_agent: {
                type: Sequelize.TEXT,
                allowNull: true,
            },

            device_type: {
                type: Sequelize.STRING(50),
                allowNull: true,
            },

            browser: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },

            operating_system: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },

            login_status: {
                type: Sequelize.STRING(20),
                allowNull: false,
                defaultValue: "success",
            },

            failure_reason: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },

            session_id: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },

            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },

            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
        });

        // CHECK constraint
        await queryInterface.addConstraint("user_login_histories", {
            fields: ["login_status"],
            type: "check",
            name: "chk_login_status",
            where: {
                login_status: {
                    [Sequelize.Op.in]: [
                        "success",
                        "failed",
                        "logout",
                    ],
                },
            },
        });

        // Indexes
        await queryInterface.addIndex(
            "user_login_histories",
            ["user_id"],
            {
                name: "idx_user_login_histories_user_id",
            }
        );

        await queryInterface.addIndex(
            "user_login_histories",
            ["login_at"],
            {
                name: "idx_user_login_histories_login_at",
            }
        );

        await queryInterface.addIndex(
            "user_login_histories",
            ["login_status"],
            {
                name: "idx_user_login_histories_status",
            }
        );

        await queryInterface.addIndex(
            "user_login_histories",
            ["ip_address"],
            {
                name: "idx_user_login_histories_ip",
            }
        );
    },

    async down(queryInterface) {
        await queryInterface.removeIndex(
            "user_login_histories",
            "idx_user_login_histories_user_id"
        );

        await queryInterface.removeIndex(
            "user_login_histories",
            "idx_user_login_histories_login_at"
        );

        await queryInterface.removeIndex(
            "user_login_histories",
            "idx_user_login_histories_status"
        );

        await queryInterface.removeIndex(
            "user_login_histories",
            "idx_user_login_histories_ip"
        );

        await queryInterface.removeConstraint(
            "user_login_histories",
            "chk_login_status"
        );

        await queryInterface.dropTable("user_login_histories");
    },
};
"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {

        await queryInterface.createTable("modules", {

            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },

            name: {
                type: Sequelize.STRING(100),
                allowNull: false
            },

            slug: {
                type: Sequelize.STRING(100),
                allowNull: false,
                unique: true
            },

            status: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },

            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
            },

            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
            }

        });

    },

    async down(queryInterface) {

        await queryInterface.dropTable("modules");

    }
};
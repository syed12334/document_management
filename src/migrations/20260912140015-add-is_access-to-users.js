"use strict";

module.exports = {
  // Run migration: Add is_access column
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("users", "is_access", {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0,
      after: "last_login_at",
    });
  },

  // Rollback migration: Remove is_access column
  async down(queryInterface) {
    await queryInterface.removeColumn("users", "is_access");
  },
};
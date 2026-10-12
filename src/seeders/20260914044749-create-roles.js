"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert("roles", [
      {
        name: "Admin",
        created_at: now,
        updated_at: now,
      },
      {
        name: "Customer",
        created_at: now,
        updated_at: now,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      "roles",
      {
        slug: {
          [Sequelize.Op.in]: ["admin", "customer"],
        },
      }
    );
  },
};
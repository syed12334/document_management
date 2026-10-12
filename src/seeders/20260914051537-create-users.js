
"use strict";

const bcrypt = require("bcryptjs");

module.exports = {
  async up(queryInterface, Sequelize) {
    // Find Admin role
    const [roles] = await queryInterface.sequelize.query(
      `SELECT id FROM roles WHERE name = 'Admin' LIMIT 1`
    );

    if (!roles.length) {
      throw new Error(
        "Admin role not found. Please run the roles seeder first."
      );
    }

    const adminRoleId = roles[0].id;

    // Hash password
    const hashedPassword = await bcrypt.hash("Admin@123", 12);

    const now = new Date();

    await queryInterface.bulkInsert("users", [
      {
        username: "Administrator",
        email: "admin@example.com",
        password: hashedPassword,
        role_id: adminRoleId,
        status:0,
        created_at: now,
        updated_at: now,
        is_access: 0,

      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", {
      email: "admin@example.com",
    });
  },
};


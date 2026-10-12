
"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert("permissions", [
      // =========================
      // FOLDER PERMISSIONS
      // =========================
      {
        name: "add-folder",
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "edit-folder",
        createdAt: now,
        updatedAt: now,
      },
      {
         name: "view-folder",
        createdAt: now,
        updatedAt: now,
      },
      {
         name: "delete-folder",
        createdAt: now,
        updatedAt: now,
      },

      // =========================
      // DOCUMENT PERMISSIONS
      // =========================
      {
        name: "add-document",
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "edit-document",
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "view-document",
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "delete-document",
        createdAt: now,
        updatedAt: now,
      },
      //Roles
      {
        name: "add-role",
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "edit-role",
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "view-role",
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "delete-role",
        createdAt: now,
        updatedAt: now,
      },
      //Permissions
      {
        name: "add-permission",
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "edit-permission",
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "view-permission",
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "delete-permission",
        createdAt: now,
        updatedAt: now,
      },
      //Users
      {
        name: "add-user",
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "edit-user",
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "view-user",
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "delete-user",
        createdAt: now,
        updatedAt: now,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("permissions", {
      name: {
        [Sequelize.Op.in]: [
          "add-folder",
          "edit-folder",
          "view-folder",
          "delete-folder",
          "add-document",
          "edit-document",
          "view-document",
          "delete-document",
          "add-role",
          "edit-role",
          "view-role",
          "delete-role",
          "add-user",
          "edit-user",
          "view-user",
          "delete-user",
          "add-permission",
          "edit-permission",
          "view-permission",
          "delete-permission",
        ],
      },
    });
  },
};


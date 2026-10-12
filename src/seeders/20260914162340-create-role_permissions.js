
"use strict";


module.exports = {
  async up(queryInterface, Sequelize) {
   


    const now = new Date();

    await queryInterface.bulkInsert("role_permissions", [
      {
        role_id: "1",
        permission_id: "2",
        created_at: now,
      },
       {
        role_id: "1",
        permission_id: "3",
        created_at: now,
      },
       {
        role_id: "1",
        permission_id: "4",
        created_at: now,
      },
       {
        role_id: "1",
        permission_id: "5",
        created_at: now,
      },
       {
        role_id: "1",
        permission_id: "6",
        created_at: now,
      },
       {
        role_id: "1",
        permission_id: "7",
        created_at: now,
      },
       {
        role_id: "1",
        permission_id: "8",
        created_at: now,
      },
       {
        role_id: "1",
        permission_id: "9",
        created_at: now,
      },
       {
        role_id: "1",
        permission_id: "10",
        created_at: now,
      },
       {
        role_id: "1",
        permission_id: "11",
        created_at: now,
      },
       {
        role_id: "1",
        permission_id: "12",
        created_at: now,
      },
       {
        role_id: "1",
        permission_id: "13",
        created_at: now,
      },
       {
        role_id: "1",
        permission_id: "14",
        created_at: now,
      },
       {
        role_id: "1",
        permission_id: "15",
        created_at: now,
      },
      {
        role_id: "1",
        permission_id: "16",
        created_at: now,
      },
       {
        role_id: "1",
        permission_id: "17",
        created_at: now,
      },
       {
        role_id: "1",
        permission_id: "18",
        created_at: now,
      },
       {
        role_id: "1",
        permission_id: "19",
        created_at: now,
      },
       {
        role_id: "1",
        permission_id: "20",
        created_at: now,
      },
       {
        role_id: "2",
        permission_id: "3",
        created_at: now,
      },
       {
        role_id: "2",
        permission_id: "7",
        created_at: now,
      },
      {
        role_id: "1",
        permission_id: "41",
        created_at: now,
      },
      {
        role_id: "1",
        permission_id: "42",
        created_at: now,
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("role_permissions", {
      name: "users",
    });
  },
};


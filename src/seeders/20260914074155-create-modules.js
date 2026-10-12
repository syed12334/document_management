
"use strict";


module.exports = {
  async up(queryInterface, Sequelize) {
   


    const now = new Date();

    await queryInterface.bulkInsert("modules", [
      {
        name: "Folders",
        slug: "folders",
        status:true,
        created_at: now,
      },
      {
        name: "Documents",
        slug: "documents",
        status:true,
        created_at: now,
      },
      {
        name: "Users",
        slug: "users",
        status:true,
        created_at: now,
      },
      {
        name: "Role",
        slug: "role",
        status:true,
        created_at: now,
      },
      {
        name: "Permission",
        slug: "permission",
        status:true,
        created_at: now,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("modules", {
      name: "users",
    });
  },
};


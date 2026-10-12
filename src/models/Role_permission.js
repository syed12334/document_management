const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Role_permission = sequelize.define(
    "Role_permission",
    {

         id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
        role_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "roles",
                key: "id"
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE"
        },
         permission_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "permissions",
                key: "id"
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE"
        }
    },
    {
        tableName: "role_permissions",
          underscored: true,
        timestamps: false
    }
);

module.exports = Role_permission;
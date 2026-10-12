const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define(
    "User",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        username: {
            type: DataTypes.STRING,
            allowNull: false
        },

        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },

        password: {
            type: DataTypes.STRING,
            allowNull: false
        },

        role_id: {
            type: DataTypes.INTEGER,
            allowNull: false,

            references: {
                model: "roles",
                key: "id"
            },

            onUpdate: "CASCADE",
            onDelete: "RESTRICT"
        },
          status: {
            type: DataTypes.STRING,
            allowNull: true
        },
          last_login_at: {
            type: DataTypes.STRING,
            allowNull: true
        },
        is_access: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    },
    {
        tableName: "users",
          underscored: true,
        timestamps: true
    }
);

module.exports = User;
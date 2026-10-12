const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const UserLoginHistory = sequelize.define(
    "UserLoginHistory",
    {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },

        user_id: {
            type: DataTypes.BIGINT,
            allowNull: true
        },

        login_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },

        logout_at: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: null
        },

        ip_address: {
            type: DataTypes.INET,
            allowNull: true
        },

        user_agent: {
            type: DataTypes.TEXT,
            allowNull: true
        },

        device_type: {
            type: DataTypes.STRING(50),
            allowNull: true
        },

        browser: {
            type: DataTypes.STRING(100),
            allowNull: true
        },

        operating_system: {
            type: DataTypes.STRING(100),
            allowNull: true
        },

        login_status: {
            type: DataTypes.STRING(20),
            allowNull: false
        },

        failure_reason: {
            type: DataTypes.STRING(255),
            allowNull: true
        },

        session_id: {
            type: DataTypes.STRING(255),
            allowNull: true
        }
    },
    {
        tableName: "user_login_histories",

        underscored: true,

        timestamps: true
    }
);

module.exports = UserLoginHistory;
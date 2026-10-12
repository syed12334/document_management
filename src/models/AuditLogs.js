const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const AuditLog = sequelize.define("AuditLog",  {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },

      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      },

      document_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'documents',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },

      folder_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'folders',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },

      action: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },

      file_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },

      file_path: {
        type: DataTypes.STRING(1000),
        allowNull: true,
      },

      ip_address: {
        type: DataTypes.STRING(45),
        allowNull: true,
        comment: 'Supports IPv4/IPv6',
      },

      user_agent: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },

      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      },
    },
    {
      tableName: 'audit_logs',
      timestamps: false,

      indexes: [
        {
          name: 'idx_audit_logs_user_id',
          fields: ['user_id'],
        },
        {
          name: 'idx_audit_logs_document_id',
          fields: ['document_id'],
        },
        {
          name: 'idx_audit_logs_folder_id',
          fields: ['folder_id'],
        },
      ],
    }
);
  
module.exports = AuditLog;
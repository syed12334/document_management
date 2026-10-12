const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Document = sequelize.define("Document", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      folder_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      uploaded_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      original_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },

      stored_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },

      file_path: {
        type: DataTypes.STRING(1000),
        allowNull: false,
      },

      mime_type: {
        type: DataTypes.STRING(150),
        allowNull: true,
      },

      file_size: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },

      file_extension: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },

      storage_type: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },

      is_encrypted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      current_version_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      tableName: 'documents',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      underscored: true,
    }
);
  
module.exports = Document;
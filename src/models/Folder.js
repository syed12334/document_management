const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Folder = sequelize.define("Folder", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },

      parent_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'folders',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },

      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Folder name is required',
          },
          len: {
            args: [1, 255],
            msg: 'Folder name must be between 1 and 255 characters',
          },
        },
      },

      created_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      },

      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },

      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      is_permission:{
        type: DataTypes.INTEGER,
        allowNull: true,
      }
    },
    {
      tableName: 'folders',
      timestamps: true,
       underscored: true,
      
    });
  







module.exports = Folder;
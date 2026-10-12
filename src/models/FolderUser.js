const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const FolderUser = sequelize.define("FolderUser", {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },

      folder_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'folders',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
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
      }

     
    },
    {
      tableName: 'folder_users',
      timestamps: false,
       underscored: true,
      
    });
  







module.exports = FolderUser;
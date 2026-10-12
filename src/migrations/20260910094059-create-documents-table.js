'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('documents', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      folder_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'folders',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },

      uploaded_by: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      },

      original_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },

      stored_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },

      file_path: {
        type: Sequelize.STRING(1000),
        allowNull: false,
      },

      mime_type: {
        type: Sequelize.STRING(150),
        allowNull: true,
      },

      file_size: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },

      file_extension: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },

      storage_type: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },

      is_encrypted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      current_version_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('documents');
  },
};
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('document_versions', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },

      document_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'documents',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },

      version_no: {
        type: Sequelize.INTEGER,
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

      file_size: {
        type: Sequelize.BIGINT,
        allowNull: false,
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

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // CONSTRAINT uq_document_version
    // UNIQUE (document_id, version_no)
    await queryInterface.addConstraint('document_versions', {
      fields: ['document_id', 'version_no'],
      type: 'unique',
      name: 'uq_document_version',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('document_versions');
  },
};
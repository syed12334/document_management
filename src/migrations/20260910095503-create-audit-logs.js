'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('audit_logs', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },

      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      },

      document_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'documents',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },

      folder_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'folders',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },

      action: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },

      file_name: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },

      file_path: {
        type: Sequelize.STRING(1000),
        allowNull: true,
      },

      ip_address: {
        type: Sequelize.STRING(45),
        allowNull: true,
        comment: 'Supports IPv4/IPv6',
      },

      user_agent: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // Index: user_id
    await queryInterface.addIndex(
      'audit_logs',
      ['user_id'],
      {
        name: 'idx_audit_logs_user_id',
      }
    );

    // Index: document_id
    await queryInterface.addIndex(
      'audit_logs',
      ['document_id'],
      {
        name: 'idx_audit_logs_document_id',
      }
    );

    // Index: folder_id
    await queryInterface.addIndex(
      'audit_logs',
      ['folder_id'],
      {
        name: 'idx_audit_logs_folder_id',
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable('audit_logs');
  },
};
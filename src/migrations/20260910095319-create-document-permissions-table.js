'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('document_permissions', {
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

      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },

      permission_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'permissions',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // UNIQUE (document_id, user_id, permission_id)
    await queryInterface.addConstraint('document_permissions', {
      fields: ['document_id', 'user_id', 'permission_id'],
      type: 'unique',
      name: 'uq_document_user_permission',
    });

    // CREATE INDEX idx_document_permissions_document_id
    await queryInterface.addIndex(
      'document_permissions',
      ['document_id'],
      {
        name: 'idx_document_permissions_document_id',
      }
    );

    // CREATE INDEX idx_document_permissions_user_id
    await queryInterface.addIndex(
      'document_permissions',
      ['user_id'],
      {
        name: 'idx_document_permissions_user_id',
      }
    );

    // CREATE INDEX idx_document_permissions_permission_id
    await queryInterface.addIndex(
      'document_permissions',
      ['permission_id'],
      {
        name: 'idx_document_permissions_permission_id',
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable('document_permissions');
  },
};
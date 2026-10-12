'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('backups', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },

      storage_type: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'storage_locations',
          key: 'id',
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      },

      backup_location: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },

      backup_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      status: {
        type: Sequelize.STRING(50),
        allowNull: false,
        comment: "e.g. 'success', 'failed', 'in_progress'",
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // CREATE INDEX idx_backups_storage_type
    await queryInterface.addIndex(
      'backups',
      ['storage_type'],
      {
        name: 'idx_backups_storage_type',
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable('backups');
  },
};
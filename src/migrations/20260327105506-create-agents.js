'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
          await queryInterface.createTable('agents', {
              id: {
                  type: Sequelize.INTEGER,
                  primaryKey: true,
                  autoIncrement: true,
                  allowNull: false,
              },
              full_name: {
                  type: Sequelize.STRING(20),
                  allowNull: false,
              },
              email: {
                  type: Sequelize.STRING(255),
                  allowNull: false,
                  unique: true,
              },
              phone: {
                  type: Sequelize.STRING(20),
                  allowNull: true,
              },
              license_number: {
                  type: Sequelize.STRING(50),
                  allowNull: true,
              },
              is_admin: {
                  type: Sequelize.BOOLEAN,
                  allowNull: false,
                  defaultValue: false,
              },
              created_at: {
                  type: Sequelize.DATE,
                  allowNull: false,
              },
              updated_at: {
                  type: Sequelize.DATE,
                  allowNull: false,
              },
              deleted_at: {
                  type: Sequelize.DATE,
                  allowNull: true,
              },
          });

          await queryInterface.addIndex('agents', ['email'], {
              unique: true,
              name: 'agents_email',
          });
  },

  async down (queryInterface, Sequelize) {
      await queryInterface.removeIndex('agents_email');
      await queryInterface.dropTable('agents');
  }
};

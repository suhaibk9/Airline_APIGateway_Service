'use strict';
/** @type {import('sequelize-cli').Migration} */
const { ENUMS } = require('../utils/common/index');
const { USER_ROLES } = ENUMS;
const { ADMIN, CUSTOMER, FLIGHT_COMPANY } = USER_ROLES;
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Roles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.ENUM,
        values: [ADMIN, CUSTOMER, FLIGHT_COMPANY],
        allowNull: false,
        defaultValue: CUSTOMER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Roles');
  },
};

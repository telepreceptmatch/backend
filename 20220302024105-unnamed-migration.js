'use strict';
const { DataTypes } = require('sequelize');
const { USER_INFO_TABLE } = require('./../models/userInfo.model');

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn(USER_INFO_TABLE, 'availability', {
        allowNull: true,
        type: DataTypes.BOOLEAN,
        defaultValue: 'false',
      });
    await queryInterface.addColumn(USER_INFO_TABLE, 'bio', {
        allowNull: true,
        type: DataTypes.STRING,
      });
    await queryInterface.addColumn(USER_INFO_TABLE, 'specialty',{
        allowNull: true,
        type: DataTypes.STRING,
      });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};

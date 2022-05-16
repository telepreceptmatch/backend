'use strict';
const { DataTypes } = require('sequelize');
const { USER_TABLE } = require('./../models/user.model')

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable(USER_TABLE, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      email: {
          allowNull: false,
          type: DataTypes.STRING,
          unique: true
      },
      password: {
          allowNull: false,
          type: DataTypes.STRING
      },
      role: {
          allowNull: false,
          type: DataTypes.STRING,
          defaultValue: 'student'
      },
      createdAt: {
          allowNull: false,
          type: DataTypes.DATE,
          field: 'created_at',
          defaultValue: Sequelize.NOW
      },
      updatedAt: {
          allowNull: false,
          type: DataTypes.DATE,
          field: 'created_at',
          defaultValue: Sequelize.NOW
      }
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     */
    await queryInterface.dropTable(USER_TABLE);
  }
};

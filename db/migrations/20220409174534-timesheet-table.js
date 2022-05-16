'use strict';
const { DataTypes } = require('sequelize');
const { TIMESHEET_TABLE } = require('./../models/timesheet.model');
const { CONNECTION_TABLE } = require('./../models/connection.model');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(TIMESHEET_TABLE,{
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      hours: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      validated: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      connectionId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: CONNECTION_TABLE,
          key: 'id',
        },
      },
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     */
    await queryInterface.dropTable(TIMESHEET_TABLE);
  },
};
'use strict';
const { DataTypes } = require('sequelize');
const { CONVERSATION_TABLE } = require('./../models/conversation.model');
const { USER_TABLE } = require('./../models/user.model');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(CONVERSATION_TABLE,{
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      user1: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: USER_TABLE,
          key: 'id',
        },
      },
      user2: {
          allowNull: false,
          type: DataTypes.INTEGER,
          references: {
            model: USER_TABLE,
            key: 'id',
          },
        }
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     */
    await queryInterface.dropTable(CONVERSATION_TABLE);
  },
};
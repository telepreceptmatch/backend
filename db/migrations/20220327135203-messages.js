'use strict';
const { DataTypes } = require('sequelize');
const { MESSAGE_TABLE } = require('./../models/message.model');
const { USER_TABLE } = require('./../models/user.model');
const { CONVERSATION_TABLE } = require('./../models/conversation.model');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(CONVERSATION_TABLE, {
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
      },
    });
    await queryInterface.createTable(MESSAGE_TABLE, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      message: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      sender: {
        field: 'sender',
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: USER_TABLE,
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      receiver: {
        field: 'receiver',
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: USER_TABLE,
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      conversationId: {
        field: 'conversation_id',
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: CONVERSATION_TABLE,
          key: 'id',
        },
      },
      read: {
        allowNull: true,
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        field: 'created_at',
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     */
    await queryInterface.dropTable(MESSAGE_TABLE);
    await queryInterface.dropTable(CONVERSATION_TABLE);
  },
};

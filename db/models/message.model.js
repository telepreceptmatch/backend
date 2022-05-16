const { Model, DataTypes, Sequelize } = require('sequelize');
const bcrypt = require('bcrypt');
const { USER_TABLE } = require('./user.model');
const { CONVERSATION_TABLE } = require('./conversation.model');

const MESSAGE_TABLE = 'messages';
// Message Schema in the Database with all of its constrains
const MessageSchema = {
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
  senderId: {
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
  receiverId: {
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
};
// Customer class model it is used to initialize the mdoel in the sequalize instance
class Message extends Model {
  // Describes relations with other tables
  static associate(models) {
    // models
    this.belongsTo(models.Conversation, {
      foreignKey: 'id',
    });
    this.belongsTo(models.User, {
      foreignKey: 'receiverId',
      as: 'receiver',
    });
    this.belongsTo(models.User, {
      foreignKey: 'senderId',
      as: 'sender',
    });
    // this.belongsTo(models.User);
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: MESSAGE_TABLE,
      modelName: 'Message',
      timestamps: false,
    };
  }
}

module.exports = { MESSAGE_TABLE, MessageSchema, Message };

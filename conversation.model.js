const { Model, DataTypes, Sequelize } = require('sequelize');

const CONVERSATION_TABLE = 'conversations';
const USER_TABLE = 'users';

// User Schema in the Database with all of its constrains
const ConversationsSchema = {
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
};
// Customer class model it is used to initialize the mdoel in the sequalize instance
class Conversation extends Model {
  // Describes relations with other tables
  static associate(models) {
    this.hasMany(models.Message, {
      foreignKey: 'conversationId',
      as: 'messages',
    });
    this.belongsTo(models.User, {
      as: 'userOne',
      foreignKey: 'user1',
    });
    this.belongsTo(models.User, {
      as: 'userTwo',
      foreignKey: 'user2',
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: CONVERSATION_TABLE,
      modelName: 'Conversation',
      timestamps: false,
    };
  }
}

module.exports = { CONVERSATION_TABLE, ConversationsSchema, Conversation };

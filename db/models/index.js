const { User, UserSchema } = require('./user.model');
const { UserInfo, UserInfoSchema } = require('./userInfo.model');
const { Connection, ConnectionsSchema } = require('./connection.model');
const { Message, MessageSchema } = require('./message.model');
const { Conversation, ConversationsSchema } = require('./conversation.model');
const { TimeSheet, TimeSheetSchema } = require('./timesheet.model');

/**
 *  Inits all of the DB Models into the sequelize instance
 * @param sequelize sequelize instance
 */

function setupModels(sequelize) {
  // inits models and schema
  User.init(UserSchema, User.config(sequelize)); // Inits 'users' table
  UserInfo.init(UserInfoSchema, UserInfo.config(sequelize)); // Init 'customers' table
  Connection.init(ConnectionsSchema, Connection.config(sequelize)); // Init 'connections' table
  Message.init(MessageSchema, Message.config(sequelize)); // Init ''Connection.config(sequelize))
  Conversation.init(ConversationsSchema, Conversation.config(sequelize)); // Init ''Connection.config(sequelize))
  TimeSheet.init(TimeSheetSchema, TimeSheet.config(sequelize)); // Init ''Connection.config(sequelize))

  // inits relations
  User.associate(sequelize.models);
  UserInfo.associate(sequelize.models);
  Connection.associate(sequelize.models);
  Message.associate(sequelize.models);
  Conversation.associate(sequelize.models);
  TimeSheet.associate(sequelize.models);
}

module.exports = setupModels;

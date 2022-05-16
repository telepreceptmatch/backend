// @ts-nocheck
const boom = require('@hapi/boom');
const { Op, Sequelize } = require('sequelize');

const { models } = require('../libs/sequelize');

class MessagesService {
  static _messageServiceInstance = null;

  //Singleton of the user service. do not call constructor instead call getInstance method
  static getInstance() {
    if (MessagesService._messageServiceInstance === null) {
      MessagesService._messageServiceInstance = new MessagesService();
    }
    return MessagesService._messageServiceInstance;
  }
  async getMessages(id) {
    let user = await models.Message.findAll({
      include: [
        {
          model: models.User,
          as: 'receiver',
        },
        {
          model: models.User,
          as: 'sender',
        },
      ],
    });
    return user;
  }

  async getAllMessages(id) {
    let conversation = await models.Conversation.findAll({
      where: {
        [Op.or]: [{ user1: id }, { user2: id }],
      },
      attributes: { exclude: ['user1', 'user2'] },
      include: [
        {
          model: models.User,
          as: 'userOne',
          attributes: {
            exclude: ['password', 'email', 'recoveryToken', 'createdAt', 'updatedAt'],
          },
        },
        {
          model: models.User,
          as: 'userTwo',
        },
        {
          model: models.Message,
          as: 'messages',
        },
      ],
    });
    return conversation;
  }
  async getConversation(userId, connectionId) {
    let conversation = await models.Conversation.findAll({
      where: {
        [Op.or]: [{ [Op.and]: [{ user1: userId }, { user2: connectionId }] }, { [Op.and]: [{ user1: connectionId }, { user2: userId }] }],
      },
      include: [
        {
          model: models.User,
          as: 'userOne',
          attributes: {
            exclude: ['password', 'email', 'recoveryToken', 'createdAt', 'updatedAt'],
          },
        },
        {
          model: models.User,
          as: 'userTwo',
        },
        {
          model: models.Message,
          as: 'messages',
        },
      ],
    });
    return conversation;
  }
  async sendMessage(id, data) {
    let conversation = await models.Conversation.findOne({
      where: {
        [Op.or]: [{ [Op.and]: [{ user1: id }, { user2: data.receiver }] }, { [Op.and]: [{ user1: data.receiver }, { user2: id }] }],
      },
    });
    if (!conversation) {
      conversation = await models.Conversation.create({
        user1: id,
        user2: data.receiver,
      });
    }
    const newMessage = await models.Message.create({
      senderId: id,
      receiverId: data.receiver,
      message: data.message,
      conversationId: conversation.id,
    });
    return newMessage;
  }

  // Deletes the object with the given id
  async delete(id) {
    const user = await models.User.findByPk(id);
    await user.destroy();
    return id;
  }
}

module.exports = MessagesService;

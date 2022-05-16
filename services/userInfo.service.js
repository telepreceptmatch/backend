const boom = require('@hapi/boom');

const { models } = require('../libs/sequelize');

class UserInfoService {
  static _userInfoServiceInstance = null;

  //Singleton of the customer service. do not call constructor instead call getInstance method
  static getInstance() {
    if (UserInfoService._userInfoServiceInstance === null) {
      UserInfoService._userInfoServiceInstance = new UserInfoService();
    }
    return UserInfoService._userInfoServiceInstance;
  }

  constructor() {
    this.users = [];
  }
  // Create a new Customer
  async create(data) {
    const newUserInfo = await models.UserInfo.create(data);
    delete newUserInfo.dataValues.user.password;
    return newUserInfo;
  }
  // Takes an id and updates the object with the changes
  async update(id, changes) {
    const userInfo = await this.findOne(id);
    const res = await userInfo.update(changes);
    return res;
  }
  // Deletes the object with the given id
  async delete(id) {
    const userInfo = await this.findOne(id);
    await userInfo.destroy();
    return id;
  }
  async findOne(id) {
    const userInfo = await models.UserInfo.findByPk(id, {
      include: ['user'],
    });
    if (!userInfo) {
      throw boom.notFound('User not found');
    }
    return userInfo;
  }
  // Returns all customer in the database
  async findAll() {
    const res = await models.UserInfo.findAll({
      include: ['user'],
    });
    return res;
  }
}

module.exports = UserInfoService;

// @ts-nocheck
const boom = require('@hapi/boom');
const { Op, Sequelize } = require('sequelize');

const { models } = require('../libs/sequelize');

class UserService {
  static _userServiceInstance = null;

  //Singleton of the user service. do not call constructor instead call getInstance method
  static getInstance() {
    if (UserService._userServiceInstance === null) {
      UserService._userServiceInstance = new UserService();
    }
    return UserService._userServiceInstance;
  }
  // Create a new user [TO DO => how to create a user depending on the type]
  async create(data) {
    const newUser = await models.User.create(data, {
      include: ['userInfo'],
    });
    delete newUser.dataValues.password;
    return newUser;
  }
  // Takes an id and updates the object with the changes
  async update(id, changes) {
    const user = await models.User.findByPk(id);
    const res = await user.update(changes);
    if ('userInfo' in changes) {
      const userInfo = await models.UserInfo.findOne({
        where: {
          userId: id,
        },
      });
      const newUserInfo = await userInfo.update(changes.userInfo);
      res.dataValues.userInfo = newUserInfo.dataValues;
    }
    return res;
  }
  async findByEmail(email) {
    const rta = await models.User.findOne({
      where: { email },
    });
    return rta;
  }

  // Deletes the object with the given id
  async delete(id) {
    const user = await models.User.findByPk(id);
    await user.destroy();
    return id;
  }
  async findOne(id) {
    const user = await models.User.findByPk(id, {
      include: [
        {
          model: models.UserInfo,
          as: 'userInfo',
        },
        {
          model: models.User,
          as: 'connections',
          include: ['userInfo'],
          attributes: {
            exclude: ['password', 'Connection'],
          },
        },
        {
          model: models.User,
          as: 'connectedWith',
          include: ['userInfo'],
          attributes: {
            exclude: ['password', 'Connection'],
          },
        },
      ],
    });
    if (!user) {
      throw boom.notFound('User not found');
    }
    const myUser = user.toJSON();
    const res = {
      user: myUser,
      connections: [],
    };
    myUser.connections.forEach((item) => res.connections.push(item));
    myUser.connectedWith.forEach((item) => res.connections.push(item));
    delete res.user.connections;
    delete res.user.connectedWith;
    return res;
  }
  // Returns all users in the fake database once we figure it out the database we will do lookups in this function
  async findAll() {
    const res = await models.User.findAll({
      include: [
        {
          model: models.UserInfo,
          as: 'userInfo',
        },
        // {
        //   model: models.User,
        //   as: 'connections',
        //   where: {
        //     [Op.or]: [{ userId: Sequelize.col('User.id') }, { connectionId: Sequelize.col('User.id') }],
        //   },
        //   attributes: {
        //     exclude: ['password', 'Connection'],
        //   },
        // },
      ],
      attributes: {
        exclude: ['password'],
      },
    });
    return res;
  }

  async getAvailableUsersToConnect(id) {
    const idUser = await this.findOne(id);
    const idConnections = await models.Connection.findAll({
      where: {
        [Op.or]: [{ userId: id }, { connectionId: id }],
      },
    });
    const role = idUser.user.role;
    const toSearch = role == 'student' ? 'preceptor' : 'student';
    const users = await models.User.findAll({
      where: {
        role: toSearch,
      },
      include: ['userInfo'],
      attributes: {
        exclude: ['password', 'recoveryToken'],
      },
    });
    let availableUsers = [...users];
    for (let user of users) {
      for (let connection of idConnections) {
        if (connection.getDataValue('userId') == id) {
          availableUsers = availableUsers.filter((ele) => {
            return ele.id !== connection.getDataValue('connectionId');
          });
        } else if (connection.getDataValue('connectionId') == id) {
          availableUsers = availableUsers.filter((ele) => {
            return ele.id !== connection.getDataValue('userId');
          });
        }
      }
    }
    return availableUsers;
  }

  async getAcceptedConnections(id) {
    const idConnections = await models.Connection.findAll({
      where: {
        [Op.or]: [{ userId: id }, { connectionId: id }],
        accepted: true,
      },
      include: [
        {
          model: models.User,
          as: 'requester',
          attributes: {
            exclude: ['password', 'email', 'recoveryToken', 'createdAt', 'updatedAt'],
          },
        },
        {
          model: models.User,
          as: 'requestedTo',
          attributes: {
            exclude: ['password', 'email', 'recoveryToken', 'createdAt', 'updatedAt'],
          },
        },
      ],
    });
    return idConnections;
  }

  async getAllTimesheets(id) {
    const idConnections = await models.Connection.findAll({
      where: {
        [Op.or]: [{ userId: id }, { connectionId: id }],
        accepted: true,
      },
      include: [
        {
          model: models.User,
          as: 'requester',
          attributes: {
            exclude: ['password', 'email', 'recoveryToken', 'createdAt', 'updatedAt'],
          },
        },
        {
          model: models.User,
          as: 'requestedTo',
          attributes: {
            exclude: ['password', 'email', 'recoveryToken', 'createdAt', 'updatedAt'],
          },
        },
        {
          model: models.TimeSheet,
          as: 'timesheet',
          required: true,
        },
      ],
    });
    return idConnections;
  }

  async getTimeSheetConnection(connectionId) {
    const idConnections = await models.Connection.findAll({
      where: {
        id: connectionId,
        accepted: true,
      },
      include: [
        {
          model: models.User,
          as: 'requester',
          attributes: {
            exclude: ['password', 'email', 'recoveryToken', 'createdAt', 'updatedAt'],
          },
        },
        {
          model: models.User,
          as: 'requestedTo',
          attributes: {
            exclude: ['password', 'email', 'recoveryToken', 'createdAt', 'updatedAt'],
          },
        },
        {
          model: models.TimeSheet,
          as: 'timesheet',
          required: true,
        },
      ],
    });
    return idConnections;
  }

  async acceptTimesheet(timesheetId) {
    let timesheet = await models.TimeSheet.findByPk(timesheetId);
    timsheet = await timesheet.update({ validated: true });
    return timesheet;
  }

  async createTimeSheet(data) {
    const timesheet = await models.TimeSheet.create(data);
    return timesheet;
  }

  async createConnection(data) {
    const { userId, connectionId } = data;
    if (userId == connectionId) throw boom.badRequest('user cannot conneect with itself');
    const isCreated = await models.Connection.findAll({
      where: {
        [Op.or]: [{ [Op.and]: [{ userId: userId }, { connectionId: connectionId }] }, { [Op.and]: [{ connectionId: userId }, { userId: connectionId }] }],
      },
    });
    if (isCreated.length == 0) {
      const connection = await models.Connection.create({ userId, connectionId });
      return { connection };
    }
    return isCreated;
  }

  async acceptConnection(id, data) {
    const connection = await models.Connection.findByPk(id);
    console.log(connection);
    const update = connection.update({ accepted: data.accepted });
    return update;
  }
  async deleteConnection(id) {
    try {
      const connection = await models.Connection.findByPk(id);
      console.log(connection);
      const update = connection.destroy();
      return id;
    } catch (error) {
      throw new Error('there was a problem');
    }
  }
}

module.exports = UserService;

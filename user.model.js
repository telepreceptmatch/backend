const { Model, DataTypes, Sequelize } = require('sequelize');
const bcrypt = require('bcrypt');
const { Connection } = require('./connection.model');
const { Message } = require('./message.model');

const USER_TABLE = 'users';
// User Schema in the Database with all of its constrains
const UserSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  email: {
    allowNull: false,
    type: DataTypes.STRING,
    unique: true,
  },
  password: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  role: {
    allowNull: false,
    type: DataTypes.STRING,
    defaultValue: 'student',
  },
  recoveryToken: {
    field: 'recovery_token',
    allowNull: true,
    type: DataTypes.STRING,
  },
  username: {
    allowNull: false,
    type: DataTypes.STRING,
    unique: true,
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'created_at',
    defaultValue: Sequelize.NOW,
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'created_at',
    defaultValue: Sequelize.NOW,
  },
};
// Customer class model it is used to initialize the mdoel in the sequalize instance
class User extends Model {
  // Describes relations with other tables
  static associate(models) {
    // models
    this.hasOne(models.UserInfo, {
      as: 'userInfo',
      foreignKey: 'userId',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
    this.belongsToMany(models.User, {
      as: 'connections',
      foreignKey: 'userId',
      otherKey: 'connectionId',
      through: Connection,
    });
    this.belongsToMany(models.User, {
      as: 'connectedWith',
      otherKey: 'userId',
      foreignKey: 'connectionId',
      through: Connection,
    });
    this.hasMany(models.Message, {
      as: 'outgoing',
      foreignKey: 'receiverId',
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: USER_TABLE,
      modelName: 'User',
      timestamps: false,
      hooks: {
        beforeCreate: async (user, options) => {
          const password = await bcrypt.hash(user.password, 10);
          user.password = password;
        },
      },
    };
  }
}

module.exports = { USER_TABLE, UserSchema, User };

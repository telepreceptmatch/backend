const { Model, DataTypes, Sequelize } = require('sequelize');

// new comment
const { USER_TABLE } = require('./user.model');

const USER_INFO_TABLE = 'user_info';
// Customer Schema in the Database with all of its constrains
const UserInfoSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  firstName: {
    allowNull: false,
    type: DataTypes.STRING,
    field: 'first_name',
  },
  lastName: {
    allowNull: false,
    type: DataTypes.STRING,
    field: 'last_name',
  },
  location: {
    allowNull: true,
    type: DataTypes.STRING,
  },
  bio: {
    allowNull: true,
    type: DataTypes.STRING,
  },
  availability: {
    allowNull: true,
    type: DataTypes.BOOLEAN,
    defaultValue: 'false',
  },
  specialty: {
    allowNull: true,
    type: DataTypes.STRING,
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
  userId: {
    field: 'user_id',
    allowNull: true,
    unique: true,
    type: DataTypes.INTEGER,
    references: {
      model: USER_TABLE,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
};

class UserInfo extends Model {
  static associate(models) {
    // models
    this.belongsTo(models.User, { as: 'user' });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: USER_INFO_TABLE,
      modelName: 'UserInfo',
      timestamps: false,
    };
  }
}

module.exports = { USER_INFO_TABLE, UserInfoSchema, UserInfo };

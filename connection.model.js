const { Model, DataTypes, Sequelize } = require('sequelize');
const bcrypt = require('bcrypt');

const CONNECTION_TABLE = 'connections';
const USER_TABLE = 'users';

// User Schema in the Database with all of its constrains
const ConnectionsSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  userId: {
    field: 'user_id',
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: USER_TABLE,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  },
  connectionId: {
    field: 'connection_id',
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: USER_TABLE,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  },
  accepted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'created_at',
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'created_at',
  },
};
// Customer class model it is used to initialize the mdoel in the sequalize instance
class Connection extends Model {
  // Describes relations with other tables
  static associate(models) {
    this.belongsTo(models.User, {
      as: 'requester',
      foreignKey: 'userId',
    });
    this.belongsTo(models.User, {
      as: 'requestedTo',
      foreignKey: 'connectionId',
    });
    this.hasMany(models.TimeSheet, {
      as: 'timesheet',
      foreignKey: 'connectionId',
      onDelete: 'CASCADE',
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: CONNECTION_TABLE,
      modelName: 'Connection',
      timestamps: true,
    };
  }
}

module.exports = { CONNECTION_TABLE, ConnectionsSchema, Connection };

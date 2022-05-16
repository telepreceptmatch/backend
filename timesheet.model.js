const { Model, DataTypes, Sequelize } = require('sequelize');

const TIMESHEET_TABLE = 'timesheets';
const { CONNECTION_TABLE } = require('./connection.model');

// User Schema in the Database with all of its constrains
const TimeSheetSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  hours: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  validated: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  connectionId: {
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: CONNECTION_TABLE,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
};
// Customer class model it is used to initialize the mdoel in the sequalize instance
class TimeSheet extends Model {
  // Describes relations with other tables
  static associate(models) {
    this.belongsTo(models.Connection, {
      as: 'timesheet',
      foreignKey: 'id',
      onDelete: 'CASCADE',
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: TIMESHEET_TABLE,
      modelName: 'TimeSheet',
      timestamps: false,
    };
  }
}

module.exports = { TIMESHEET_TABLE, TimeSheetSchema, TimeSheet };

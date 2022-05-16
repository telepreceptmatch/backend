'use strict';

const { CONNECTION_TABLE } = require('../models/connection.model');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(CONNECTION_TABLE, 'accepted', {
      type: Sequelize.DataTypes.BOOLEAN,
      default: false,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn(CONNECTION_TABLE, 'accepted');
  },
};

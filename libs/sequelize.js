const { Sequelize } = require('sequelize');

const { config } = require('./../config/config')
const  setupModels = require('./../db/models')

 /*
    Config File for sequelize to connect to the database
 */
const options = {
    dialect: 'postgres',
    logging: config.isProd ? false: true,
}
if (config.isProd) {
    options.dialectOptions = {
        ssl: {
            rejectUnauthorized: false
        }
    }
}
const sequelize = new Sequelize(config.dbUrl, options)

setupModels(sequelize);

module.exports = sequelize
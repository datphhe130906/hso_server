const Sequelize = require('sequelize');
const config = require('../config/config');

const sequelize = new Sequelize(config.sequelize.name, config.sequelize.user, config.sequelize.password, {
  host: config.sequelize.host,
  port: config.sequelize.port,
  dialect: config.sequelize.dialect,
  logging: false,
  define: {
    timestamps: false,
  },
});

module.exports = sequelize;

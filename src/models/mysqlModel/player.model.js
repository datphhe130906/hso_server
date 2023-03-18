const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../../database/sequelize-instance');

const Player = sequelize.define(
  'player',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: Sequelize.STRING,
    body: Sequelize.STRING,
    clazz: {
      type: DataTypes.TINYINT(4),
    },
    maxbag: {
      type: DataTypes.TINYINT(4),
    },
    level: Sequelize.INTEGER(11),
    exp: Sequelize.BIGINT(20),
    item3: {
      type: DataTypes.TEXT('long'),
    },
    item4: Sequelize.STRING(1000),
    item5: Sequelize.STRING(1000),
    item7: {
      type: DataTypes.TEXT,
    },
    vang: Sequelize.BIGINT(20),
    kimcuong: Sequelize.BIGINT(20),
  },
  { tableName: 'player' }
);

module.exports = Player;

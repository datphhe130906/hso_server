const { DataTypes } = require('sequelize');
const sequelize = require('../../database/sequelize-instance');

const Account = sequelize.define(
  'account',
  {
    user: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pass: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    char: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    status: {
      type: DataTypes.TINYINT,
    },
    tongnap: {
      type: DataTypes.INTEGER(11),
    },
    tiennap: {
      type: DataTypes.INTEGER(11),
    },
    lock: {
      type: DataTypes.TINYINT,
    },
    coin: {
      type: DataTypes.NUMBER,
    },
    phone: {
      type: DataTypes.NUMBER,
    },
  },
  { tableName: 'account' }
);

module.exports = Account;

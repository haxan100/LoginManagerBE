const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Password = sequelize.define('Password', {
  site: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userid: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: DataTypes.STRING,
});

module.exports = Password;

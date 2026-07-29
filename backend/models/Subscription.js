const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Subscription = sequelize.define('Subscription', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  frequency: {
    type: DataTypes.ENUM('Weekly', 'Monthly', 'Yearly'),
    defaultValue: 'Weekly'
  },
  subscribers: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  features: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  popular: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

module.exports = Subscription;

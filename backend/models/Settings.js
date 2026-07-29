const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Settings = sequelize.define('Settings', {
  storeName: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Cream Dream'
  },
  whatsappNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '919014002314'
  },
  openingHours: {
    type: DataTypes.STRING,
    defaultValue: '10:00 AM - 11:00 PM'
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: '₹'
  }
});

module.exports = Settings;

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Addon = sequelize.define('Addon', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM('Toppings', 'Cones', 'Sauces', 'Special Mix'),
    defaultValue: 'Toppings'
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  inStock: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});

module.exports = Addon;

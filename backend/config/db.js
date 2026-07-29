const { Sequelize } = require('sequelize');
const mysql = require('mysql2/promise');

const host = process.env.DB_HOST || '127.0.0.1';
const port = process.env.DB_PORT || 3306;
const user = process.env.DB_USER || 'root';
const password = process.env.DB_PASSWORD || '';
const database = process.env.DB_NAME || 'creamdream';

const isLocal = host === '127.0.0.1' || host === 'localhost';

const sequelize = new Sequelize(
  database,
  user,
  password,
  {
    host,
    port,
    dialect: 'mysql',
    logging: false,
    dialectOptions: isLocal ? {} : {
      ssl: {
        rejectUnauthorized: false
      }
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

const connectDB = async () => {
  try {
    // Auto-create database if it doesn't exist (with conditional SSL for Aiven)
    const connectionOptions = { host, port, user, password };
    if (!isLocal) {
      connectionOptions.ssl = {
        rejectUnauthorized: false
      };
    }
    const connection = await mysql.createConnection(connectionOptions);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
    await connection.end();
    console.log(`Database '${database}' verified/created successfully.`);

    await sequelize.authenticate();
    console.log('MySQL connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the MySQL database:', error);
    console.warn('Backend server continuing to run without active database connection.');
  }
};

module.exports = { sequelize, connectDB };


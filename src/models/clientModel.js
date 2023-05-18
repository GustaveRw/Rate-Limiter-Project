require('dotenv').config();

// Implementation of the client model using a database library (e.g., Sequelize)
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(`postgres://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);

const Client = sequelize.define('Client', {
  // Define client model fields
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  monthlyRateLimit: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  monthlyUsage: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
});

module.exports = Client;

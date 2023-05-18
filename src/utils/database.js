const { Sequelize } = require('sequelize');
const config = require('./config');

const sequelize = new Sequelize(config.database);

async function connectToDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Connected to PostgreSQL database');
  } catch (error) {
    console.error('Error connecting to PostgreSQL database:', error);
  }
}

connectToDatabase();

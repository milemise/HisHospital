require('dotenv').config();
const { Sequelize } = require('sequelize');

const isProduction = process.env.NODE_ENV === 'production';

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    ssl: isProduction ? {
      require: true,
      rejectUnauthorized: false
    } : false
  },
  logging: false
});

module.exports = sequelize;
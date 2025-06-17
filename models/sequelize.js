 require('dotenv').config();
 const { Sequelize } = require('sequelize');

 const sequelize = new Sequelize(
   process.env.DB_NAME || 'neondb',
   process.env.DB_USER || 'neondb_owner',
   process.env.DB_PASSWORD || 'npg_5WnTyfGhgK0l',
   {
     host: process.env.DB_HOST || 'ep-odd-breeze-a4zvl9vk-pooler.us-east-1.aws.neon.tech',
     dialect: 'postgres', 
     logging: false,
     define: {
       freezeTableName: true,
       underscored: true,
       timestamps: true,
       id: false
     },
     pool: {
       max: 5,
       min: 0,
       acquire: 30000,
       idle: 10000
     }
   }
 );
module.exports = sequelize;

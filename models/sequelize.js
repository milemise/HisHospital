// require('dotenv').config();
// const { Sequelize } = require('sequelize');

// const sequelize = new Sequelize(
//   process.env.DB_NAME || 'his_internacion',
//   process.env.DB_USER || 'root',
//   process.env.DB_PASSWORD || '',
//   {
//     host: process.env.DB_HOST || 'localhost',
//     dialect: 'postgres', 
//     logging: false,
//     define: {
//       freezeTableName: true,
//       underscored: true,
//       timestamps: true,
//       id: false
//     },
//     pool: {
//       max: 5,
//       min: 0,
//       acquire: 30000,
//       idle: 10000
//     }
//   }
// );

// module.exports = sequelize;
const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, require: true
  }
});

pool.connect()
.then(client => {
console.log('Conexión exitosa a Neon');
client.release();
})
.catch(err => {
console.error('Error de conexión a Neon', err);
});

module.exports = pool;
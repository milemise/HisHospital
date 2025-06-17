const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
'his_internacion_pg',
'postgres',
'jere123',
{
host: 'localhost',
dialect: 'postgres',
logging: false,
});

sequelize.authenticate()
.then(() => console.log('Conexión exitosa a PostgreSQL'))
.catch((err) => console.error('Error al conectar:', err));
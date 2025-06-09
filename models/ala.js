const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize'); 

const Ala = sequelize.define('Ala', {
  id_ala: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  nombre: {
    type: DataTypes.STRING(100), 
    allowNull: false,
    unique: true 
  }
}, {
  tableName: 'ala',
  timestamps: false 
});
module.exports = Ala;
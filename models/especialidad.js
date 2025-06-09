const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');

const Especialidad = sequelize.define('Especialidad', {
  id_especialidad: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'especialidad',
  timestamps: false
});

module.exports = Especialidad;
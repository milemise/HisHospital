const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');

const Habitacion = sequelize.define('Habitacion', {
  id_habitacion: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  numero: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  tipo: {
    type: DataTypes.ENUM('Individual', 'Compartida', 'Suite'),
    allowNull: false
  },
  estado: {
    type: DataTypes.ENUM('Disponible', 'Ocupada', 'Mantenimiento', 'Limpieza'),
    allowNull: false,
    defaultValue: 'Disponible'
  },
  id_ala: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'ala', 
      key: 'id_ala'
    }
  }
}, {
  tableName: 'habitaciones',
  timestamps: false 
});

module.exports = Habitacion;
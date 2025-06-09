const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');

const Turno = sequelize.define('Turno', {
  id_turno: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  id_paciente: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'pacientes',
      key: 'id_paciente'
    }
  },
  id_medico: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'medicos',
      key: 'id_medico'
    }
  },
  fecha_hora: {
    type: DataTypes.DATE, 
    allowNull: false
  },
  estado: {
    type: DataTypes.ENUM('pendiente', 'confirmado', 'cancelado', 'finalizado'),
    allowNull: false,
    defaultValue: 'pendiente'
  }
}, {
  tableName: 'turnos',
  timestamps: false 
});

module.exports = Turno;
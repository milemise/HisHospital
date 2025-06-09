const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');
const Alta = sequelize.define('Alta', {
  id_alta: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  id_admision: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true, 
    references: {
      model: 'admisiones',
      key: 'id_admision'
    }
  },
  id_medico: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'medicos',
      key: 'id_medico'
    }
  },
  fecha_alta_real: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  diagnostico_final: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  tratamiento_indicado: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  medicamentos_recetados: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  fecha_control_sugerido: {
    type: DataTypes.DATEONLY, 
    allowNull: true
  },
  observaciones_alta: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'altas',
  timestamps: false 
});
module.exports = Alta;
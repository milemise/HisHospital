const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');

const Admision = sequelize.define('Admision', {
  id_admision: {
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
  fecha_ingreso: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  fecha_alta: {
    type: DataTypes.DATE,
    allowNull: true
  },
  motivo_internacion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  es_emergencia: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  estado_admision: {
    type: DataTypes.ENUM('Activa', 'En Proceso', 'Dada de Alta', 'Cancelada'),
    allowNull: false,
    defaultValue: 'Activa'
  }
}, {
  tableName: 'admisiones',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

Admision.associate = (models) => {
  Admision.belongsTo(models.Paciente, { foreignKey: 'id_paciente', as: 'paciente' });
  Admision.hasMany(models.Evaluacion, { foreignKey: 'id_admision', as: 'evaluaciones' });
  Admision.hasMany(models.AsignacionCama, { foreignKey: 'id_admision', as: 'asignacionesCama' });
  Admision.hasOne(models.Alta, { foreignKey: 'id_admision', as: 'alta' });
};

module.exports = Admision;

const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');

const Evaluacion = sequelize.define('Evaluacion', {
  id_evaluacion: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  id_admision: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'admisiones',
      key: 'id_admision'
    }
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
    allowNull: false,
    references: {
      model: 'medicos',
      key: 'id_medico'
    }
  },
  fecha_evaluacion: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  diagnostico: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  observaciones_medicas: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  signos_vitales: {
    type: DataTypes.JSON,
    allowNull: true
  },
  plan_cuidados: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'evaluaciones',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updated_at'
});

Evaluacion.associate = (models) => {
  Evaluacion.belongsTo(models.Admision, { foreignKey: 'id_admision', as: 'admision' });
  Evaluacion.belongsTo(models.Paciente, { foreignKey: 'id_paciente', as: 'paciente' });
  Evaluacion.belongsTo(models.Medico, { foreignKey: 'id_medico', as: 'medico' });
};

module.exports = Evaluacion;

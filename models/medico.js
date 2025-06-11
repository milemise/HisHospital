const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');

const Medico = sequelize.define('Medico', {
  id_medico: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  apellido: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  id_especialidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'especialidad',
      key: 'id_especialidad'
    }
  },
  matricula: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  telefono: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  activo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  tableName: 'medicos',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

Medico.associate = (models) => {
  Medico.belongsTo(models.Especialidad, { foreignKey: 'id_especialidad', as: 'especialidad' });
  Medico.hasMany(models.Evaluacion, { foreignKey: 'id_medico', as: 'evaluaciones' });
  Medico.hasMany(models.Alta, { foreignKey: 'id_medico', as: 'altas' });
  Medico.hasMany(models.Turno, { foreignKey: 'id_medico', as: 'turnos' });
};

module.exports = Medico;

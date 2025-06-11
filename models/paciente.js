const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');

const Paciente = sequelize.define('Paciente', {
  id_paciente: {
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
    allowNull: false
  },
  dni: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  fecha_nacimiento: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  genero: {
    type: DataTypes.ENUM('Masculino', 'Femenino', 'Otro', 'No especificado'),
    defaultValue: 'No especificado'
  },
  telefono: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  direccion: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  grupo_sanguineo: {
    type: DataTypes.ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'),
    allowNull: true
  },
  alergias: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  medicamentos_actuales: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  id_obra_social: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'obras_sociales',
      key: 'id_obra_social'
    }
  },
  numero_afiliado: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'pacientes',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  paranoid: true,
  deletedAt: 'deleted_at'
});

Paciente.associate = (models) => {
  Paciente.belongsTo(models.ObraSocial, { foreignKey: 'id_obra_social', as: 'obraSocial' });
  Paciente.hasMany(models.Admision, { foreignKey: 'id_paciente', as: 'admisiones' });
  Paciente.hasMany(models.Evaluacion, { foreignKey: 'id_paciente', as: 'evaluaciones' });
  Paciente.hasMany(models.Turno, { foreignKey: 'id_paciente', as: 'turnos' });
};

module.exports = Paciente;

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

Especialidad.associate = (models) => {
  Especialidad.hasMany(models.Medico, { foreignKey: 'id_especialidad', as: 'medicos' });
};

module.exports = Especialidad;

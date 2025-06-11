const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');

const Cama = sequelize.define('Cama', {
  id_cama: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  id_habitacion: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'habitaciones',
      key: 'id_habitacion'
    }
  },
  numero: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  estado: {
    type: DataTypes.ENUM('Libre', 'Ocupada', 'En Limpieza', 'Fuera de Servicio'),
    allowNull: false,
    defaultValue: 'Libre'
  },
  genero_asignado: {
    type: DataTypes.ENUM('M', 'F'),
    allowNull: true
  }
}, {
  tableName: 'cama',
  timestamps: false
});

Cama.associate = (models) => {
  Cama.belongsTo(models.Habitacion, { foreignKey: 'id_habitacion', as: 'habitacion' });
  Cama.hasMany(models.AsignacionCama, { foreignKey: 'id_cama', as: 'asignaciones' });
};

module.exports = Cama;

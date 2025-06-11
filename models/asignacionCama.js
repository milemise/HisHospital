const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');

const AsignacionCama = sequelize.define('AsignacionCama', {
  id_asignacion_cama: {
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
  id_cama: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'cama',
      key: 'id_cama'
    }
  },
  fecha_asignacion: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  fecha_liberacion: {
    type: DataTypes.DATE,
    allowNull: true
  },
  es_actual: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  tableName: 'asignacion_cama',
  timestamps: false
});

AsignacionCama.associate = (models) => {
  AsignacionCama.belongsTo(models.Admision, { foreignKey: 'id_admision', as: 'admision' });
  AsignacionCama.belongsTo(models.Cama, { foreignKey: 'id_cama', as: 'cama' });
};

module.exports = AsignacionCama;

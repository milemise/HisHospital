const sequelize = require('./sequelize');

const Ala = require('./ala');
const Habitacion = require('./habitacion');
const Cama = require('./cama');
const ObraSocial = require('./obraSocial');
const Paciente = require('./paciente');
const Admision = require('./admision');
const AsignacionCama = require('./asignacionCama');
const Especialidad = require('./especialidad');
const Medico = require('./medico');
const Evaluacion = require('./evaluacion');
const Alta = require('./alta');
const Turno = require('./turno');
const Usuario = require('./usuario');

// Relaciones Ala - Habitacion
Ala.hasMany(Habitacion, { foreignKey: 'id_ala', as: 'habitaciones' });
Habitacion.belongsTo(Ala, { foreignKey: 'id_ala', as: 'ala' });

// Relaciones Habitacion - Cama
Habitacion.hasMany(Cama, { foreignKey: 'id_habitacion', as: 'camas' });
Cama.belongsTo(Habitacion, { foreignKey: 'id_habitacion', as: 'habitacion' });

// Relaciones ObraSocial - Paciente
ObraSocial.hasMany(Paciente, { foreignKey: 'id_obra_social', as: 'pacientes' });
Paciente.belongsTo(ObraSocial, { foreignKey: 'id_obra_social', as: 'obraSocial' });

// Relaciones Paciente - Admision
Paciente.hasMany(Admision, { foreignKey: 'id_paciente', as: 'admisiones' });
Admision.belongsTo(Paciente, { foreignKey: 'id_paciente', as: 'paciente' });

Admision.belongsTo(Cama, { foreignKey: 'id_cama_asignada', as: 'cama' });
// Relaciones Especialidad - Medico
Especialidad.hasMany(Medico, { foreignKey: 'id_especialidad', as: 'medicos' });
Medico.belongsTo(Especialidad, { foreignKey: 'id_especialidad', as: 'especialidad' });

// Relaciones Admision - Evaluacion
Admision.hasMany(Evaluacion, { foreignKey: 'id_admision', as: 'evaluaciones' });
Evaluacion.belongsTo(Admision, { foreignKey: 'id_admision', as: 'admision' });

// Relaciones Paciente - Evaluacion (si una evaluación puede ser directamente del paciente)
Paciente.hasMany(Evaluacion, { foreignKey: 'id_paciente', as: 'evaluaciones' });
Evaluacion.belongsTo(Paciente, { foreignKey: 'id_paciente', as: 'paciente' });

// Relaciones Medico - Evaluacion
Medico.hasMany(Evaluacion, { foreignKey: 'id_medico', as: 'evaluaciones' });
Evaluacion.belongsTo(Medico, { foreignKey: 'id_medico', as: 'medico' });

// Relaciones Admision - Alta
Admision.hasOne(Alta, { foreignKey: 'id_admision', as: 'alta' });
Alta.belongsTo(Admision, { foreignKey: 'id_admision', as: 'admision' });

// Relaciones Medico - Alta
Medico.hasMany(Alta, { foreignKey: 'id_medico', as: 'altas' });
Alta.belongsTo(Medico, { foreignKey: 'id_medico', as: 'medico' });

// Relaciones Paciente - Turno
Paciente.hasMany(Turno, { foreignKey: 'id_paciente', as: 'turnos' });
Turno.belongsTo(Paciente, { foreignKey: 'id_paciente', as: 'paciente' });

// Relaciones Medico - Turno
Medico.hasMany(Turno, { foreignKey: 'id_medico', as: 'turnos' });
Turno.belongsTo(Medico, { foreignKey: 'id_medico', as: 'medico' });


module.exports = {
  sequelize,
  Ala,
  Habitacion,
  Cama,
  ObraSocial,
  Paciente,
  Admision,
  AsignacionCama,
  Especialidad,
  Medico,
  Evaluacion,
  Alta,
  Turno,
  Usuario
};
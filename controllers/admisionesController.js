const { sequelize, Admision, Paciente, Cama, Habitacion, Ala, ObraSocial, Medico, Evaluacion, Alta } = require('../models');

exports.listarAdmisiones = async (req, res) => {
    try {
        const admisiones = await Admision.findAll({
            include: [
                { model: Paciente, as: 'paciente', attributes: ['nombre', 'apellido', 'dni', 'genero'] },
                {
                    model: Cama,
                    as: 'cama',
                    include: [
                        { model: Habitacion, as: 'habitacion', include: [{ model: Ala, as: 'ala' }] }
                    ]
                }
            ],
            order: [['fecha_ingreso', 'DESC']]
        });
        res.render('admisiones/index', {
            admisiones: admisiones,
            success: req.flash('success'),
            error: req.flash('error')
        });
    } catch (error) {
        console.error('Error al listar admisiones:', error);
        req.flash('error', 'Error al cargar las admisiones.');
        res.redirect('/error');
    }
};

exports.formularioNueva = async (req, res) => {
    try {
        const pacientes = await Paciente.findAll({
            attributes: ['id_paciente', 'nombre', 'apellido', 'dni', 'genero'],
            order: [['apellido', 'ASC'], ['nombre', 'ASC']]
        });
        const camasDisponibles = await Cama.findAll({
            where: { estado: 'Libre' },
            include: [{ model: Habitacion, as: 'habitacion', include: [{ model: Ala, as: 'ala' }] }]
        });
        const obrasSociales = await ObraSocial.findAll();
        res.render('admisiones/nueva', {
            pacientes: pacientes,
            camasDisponibles: camasDisponibles,
            obrasSociales: obrasSociales,
            error: req.flash('error'),
            success: req.flash('success')
        });
    } catch (error) {
        console.error('Error al cargar formulario de nueva admisión:', error);
        req.flash('error', 'Error al preparar el formulario de admisión.');
        res.redirect('/admisiones');
    }
};

exports.guardarAdmision = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const {
            id_paciente_seleccionado, nombre_paciente_nuevo, apellido_paciente_nuevo,
            dni_paciente_nuevo, genero_paciente_nuevo, fecha_nacimiento_nuevo,
            telefono_nuevo, email_nuevo, direccion_nuevo, grupo_sanguineo_nuevo,
            alergias_nuevo, medicamentos_nuevo, id_obra_social_nuevo, numero_afiliado_nuevo,
            es_emergencia, id_cama_asignada, motivo_internacion, fecha_ingreso
        } = req.body;

        let pacienteId;
        const esNuevaAdmisionEmergencia = es_emergencia === 'on' || es_emergencia === true;

        let finalDniToUse = dni_paciente_nuevo || null;
        let finalNombreToUse = nombre_paciente_nuevo || null;
        let finalApellidoToUse = apellido_paciente_nuevo || null;
        let finalGeneroToUse = genero_paciente_nuevo || null;
        let finalFechaNacimientoToUse = fecha_nacimiento_nuevo || null;

        if (id_paciente_seleccionado && id_paciente_seleccionado !== 'nuevo') {
            pacienteId = id_paciente_seleccionado;
            const pacienteExistente = await Paciente.findByPk(pacienteId, { transaction: t });
            if (!pacienteExistente) {
                throw new Error('Paciente seleccionado no encontrado.');
            }
        } else {
            if (esNuevaAdmisionEmergencia) {
                if (!finalGeneroToUse) {
                    throw new Error('Para un paciente de emergencia, el Género es obligatorio.');
                }

                if (!finalDniToUse) {
                    const randomSuffix = Math.random().toString(36).substr(2, 5).toUpperCase();
                    const timestampSuffix = Date.now().toString().slice(-5);
                    finalDniToUse = `EMERG_${timestampSuffix}_${randomSuffix}`;
                }
                
                finalNombreToUse = finalNombreToUse || 'Paciente Desconocido';
                finalApellidoToUse = finalApellidoToUse || 'N/A';
                finalFechaNacimientoToUse = finalFechaNacimientoToUse || '2000-01-01';
                finalGeneroToUse = finalGeneroToUse && finalGeneroToUse !== '' ? finalGeneroToUse : 'No especificado';

            } else {
                if (!finalNombreToUse || !finalApellidoToUse || !finalDniToUse || !finalGeneroToUse || !finalFechaNacimientoToUse) {
                    throw new Error('Para un paciente nuevo (no de emergencia), debe completar Nombre, Apellido, DNI, Fecha de Nacimiento y Género.');
                }
            }

            const [newOrExistingPaciente, created] = await Paciente.findOrCreate({
                where: { dni: finalDniToUse },
                defaults: {
                    nombre: finalNombreToUse,
                    apellido: finalApellidoToUse,
                    dni: finalDniToUse,
                    fecha_nacimiento: finalFechaNacimientoToUse,
                    genero: finalGeneroToUse,
                    telefono: telefono_nuevo || null,
                    email: email_nuevo || null,
                    direccion: direccion_nuevo || null,
                    grupo_sanguineo: grupo_sanguineo_nuevo || null,
                    alergias: alergias_nuevo || null,
                    medicamentos_actuales: medicamentos_nuevo || null,
                    id_obra_social: id_obra_social_nuevo || null,
                    numero_afiliado: numero_afiliado_nuevo || null,
                    activo: true
                },
                transaction: t
            });

            if (!created) {
                if (!esNuevaAdmisionEmergencia) {
                    throw new Error(`Ya existe un paciente con el DNI ${finalDniToUse}. Seleccione el paciente existente del desplegable o proporcione un DNI diferente.`);
                }
            }
            pacienteId = newOrExistingPaciente.id_paciente;
            if (created && esNuevaAdmisionEmergencia) {
                req.flash('success', 'Paciente de emergencia registrado temporalmente.');
            } else if (created) {
                req.flash('success', 'Nuevo paciente registrado con éxito.');
            }
        }

        const camaIdNumerico = parseInt(id_cama_asignada, 10);
        if (!id_cama_asignada || isNaN(camaIdNumerico)) {
            throw new Error('Debe seleccionar una cama válida para la admisión.');
        }

        const cama = await Cama.findByPk(camaIdNumerico, {
            include: [{ model: Habitacion, as: 'habitacion', required: true }],
            transaction: t,
            lock: t.LOCK.UPDATE
        });

        if (!cama) {
            throw new Error('La cama seleccionada no existe.');
        }
        
        if (cama.estado !== 'Libre') {
            throw new Error(`La cama ${cama.numero} de la Habitación ${cama.habitacion.numero} no está disponible. Estado actual: ${cama.estado}.`);
        }

        const pacienteActual = await Paciente.findByPk(pacienteId, { transaction: t });
        if (!pacienteActual) {
            throw new Error('Error interno: Paciente no encontrado después de creación/selección.');
        }
        const generoPacienteInicial = pacienteActual.genero ? pacienteActual.genero[0].toUpperCase() : null;

        if (cama.habitacion.tipo === 'Compartida') {
            if (cama.genero_asignado && (generoPacienteInicial === 'M' || generoPacienteInicial === 'F') && cama.genero_asignado !== generoPacienteInicial) {
                throw new Error(`La cama ${cama.numero} ya está designada para género ${cama.genero_asignado} y el paciente actual es de género ${generoPacienteInicial}.`);
            }
            if (cama.genero_asignado === null && (generoPacienteInicial === 'M' || generoPacienteInicial === 'F')) {
                await cama.update({ genero_asignado: generoPacienteInicial }, { transaction: t });
            }
        }
        
        const nuevaAdmision = await Admision.create({
            id_paciente: pacienteId,
            fecha_ingreso: fecha_ingreso || new Date(),
            motivo_internacion: motivo_internacion,
            es_emergencia: esNuevaAdmisionEmergencia,
            estado_admision: 'En Proceso',
            id_cama_asignada: camaIdNumerico
        }, { transaction: t });

        await cama.update({ estado: 'Ocupada' }, { transaction: t });

        await t.commit();
        req.flash('success', 'Admisión y asignación de cama realizadas con éxito.');
        res.redirect('/admisiones');
    } catch (error) {
        await t.rollback();
        console.error('Error al guardar admisión:', error);

        let errorMessage = 'Error al procesar la admisión.';
        if (error.name === 'SequelizeUniqueConstraintError') {
            errorMessage = 'Ya existe un registro con el DNI proporcionado para el nuevo paciente.';
        } else {
            errorMessage = error.message || errorMessage;
        }
        req.flash('error', errorMessage);
        res.redirect('/admisiones/nueva');
    }
};

exports.formularioEditar = async (req, res) => {
    try {
        const admision = await Admision.findByPk(req.params.id_admision, {
            include: [
                { model: Paciente, as: 'paciente' },
                {
                    model: Cama, as: 'cama',
                    include: [{ model: Habitacion, as: 'habitacion', include: [{ model: Ala, as: 'ala' }] }]
                }
            ]
        });

        if (!admision) {
            req.flash('error', 'Admisión no encontrada.');
            return res.redirect('/admisiones');
        }

        const pacientes = await Paciente.findAll({ order: [['apellido', 'ASC']] });
        
        const camasDisponibles = await Cama.findAll({
            where: {
                [sequelize.Op.or]: [
                    { estado: 'Libre' },
                    { id_cama: admision.id_cama_asignada }
                ]
            },
            include: [{ model: Habitacion, as: 'habitacion', include: [{ model: Ala, as: 'ala' }] }]
        });

        res.render('admisiones/editar', {
            title: `Editar Admisión ${admision.id_admision}`,
            admision: admision,
            pacientes: pacientes,
            camasDisponibles: camasDisponibles,
            error: req.flash('error'),
            success: req.flash('success')
        });
    } catch (error) {
        console.error('Error al cargar formulario de edición de admisión:', error);
        req.flash('error', 'Error al preparar el formulario de edición.');
        res.redirect('/admisiones');
    }
};

exports.actualizarAdmision = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { id_admision } = req.params;
        const { motivo_internacion, id_cama_nueva, estado_admision, fecha_alta, diagnostico_egreso, condiciones_egreso } = req.body;

        const admision = await Admision.findByPk(id_admision, { transaction: t, include: [{ model: Cama, as: 'cama' }] });
        if (!admision) {
            throw new Error('Admisión no encontrada.');
        }

        const oldCamaId = admision.id_cama_asignada;
        const newCamaId = id_cama_nueva ? parseInt(id_cama_nueva, 10) : oldCamaId;

        await admision.update({
            motivo_internacion: motivo_internacion,
            estado_admision: estado_admision,
            fecha_alta: fecha_alta || null,
            diagnostico_egreso: (estado_admision === 'Dada de Alta' ? diagnostico_egreso : null) || null,
            condiciones_egreso: (estado_admision === 'Dada de Alta' ? condiciones_egreso : null) || null,
            id_cama_asignada: newCamaId
        }, { transaction: t });

        if (newCamaId !== oldCamaId) {
            if (oldCamaId) {
                const oldCama = await Cama.findByPk(oldCamaId, { transaction: t });
                if (oldCama) {
                    await oldCama.update({ estado: 'Libre', genero_asignado: null }, { transaction: t });
                }
            }

            const nuevaCama = await Cama.findByPk(newCamaId, {
                include: [{ model: Habitacion, as: 'habitacion', required: true }],
                transaction: t,
                lock: t.LOCK.UPDATE
            });

            if (!nuevaCama) {
                throw new Error('La nueva cama seleccionada no existe.');
            }
            if (nuevaCama.estado !== 'Libre') {
                throw new Error(`La cama ${nuevaCama.numero} de la Habitación ${nuevaCama.habitacion.numero} no está disponible para asignación. Estado actual: ${nuevaCama.estado}.`);
            }
            
            if (nuevaCama.habitacion.tipo === 'Compartida') {
                const pacienteAdmision = await Paciente.findByPk(admision.id_paciente, { transaction: t });
                const generoPaciente = pacienteAdmision.genero ? pacienteAdmision.genero[0].toUpperCase() : null;

                if (nuevaCama.genero_asignado && generoPaciente && nuevaCama.genero_asignado !== generoPaciente) {
                    throw new Error(`La cama ${nuevaCama.numero} ya está designada para género ${nuevaCama.genero_asignado} y el paciente actual es de género ${generoPaciente}.`);
                }
                if (nuevaCama.genero_asignado === null && generoPaciente) {
                    await nuevaCama.update({ genero_asignado: generoPaciente }, { transaction: t });
                }
            }
            await nuevaCama.update({ estado: 'Ocupada' }, { transaction: t });
        }
        
        if ((estado_admision === 'Dada de Alta' || estado_admision === 'Cancelada') && oldCamaId) {
            const camaFinal = await Cama.findByPk(oldCamaId, { transaction: t });
            if (camaFinal) {
                if (camaFinal.id_cama !== newCamaId) {
                    await camaFinal.update({ estado: 'Libre', genero_asignado: null }, { transaction: t });
                }
            }
        }

        await t.commit();
        req.flash('success', 'Admisión actualizada con éxito.');
        res.redirect('/admisiones');
    } catch (error) {
        await t.rollback();
        console.error('Error al actualizar admisión:', error);
        req.flash('error', `Error al actualizar la admisión: ${error.message}`);
        res.redirect(`/admisiones/editar/${req.params.id_admision}`);
    }
};

exports.cancelarAdmision = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { id_admision } = req.params;
        const admision = await Admision.findByPk(id_admision, { transaction: t, include: [{ model: Cama, as: 'cama' }] });

        if (!admision) {
            throw new Error('Admisión no encontrada.');
        }
        if (admision.estado_admision !== 'Activa' && admision.estado_admision !== 'En Proceso') {
            throw new Error('No se puede cancelar una admisión que no esté Activa o En Proceso.');
        }

        await admision.update({ estado_admision: 'Cancelada', fecha_alta: new Date() }, { transaction: t });

        if (admision.id_cama_asignada) {
            const cama = await Cama.findByPk(admision.id_cama_asignada, { transaction: t });
            if (cama) {
                await cama.update({ estado: 'Libre', genero_asignado: null }, { transaction: t });
            }
        }

        await t.commit();
        req.flash('success', 'Admisión cancelada con éxito.');
        res.redirect('/admisiones');
    } catch (error) {
        await t.rollback();
        console.error('Error al cancelar admisión:', error);
        req.flash('error', `Error al cancelar la admisión: ${error.message}`);
        res.redirect('/admisiones');
    }
};

exports.darAlta = async (req, res) => {
    try {
        res.redirect(`/altas/nueva/${req.params.id_admision}`);
    }
     catch (error) {
        console.error('Error al redirigir para dar de alta:', error);
        req.flash('error', 'Error al preparar el alta.');
        res.redirect('/admisiones');
    }
};

exports.verDetalles = async (req, res) => {
    try {
        const admision = await Admision.findByPk(req.params.id_admision, {
            include: [
                { model: Paciente, as: 'paciente', include: [{ model: ObraSocial, as: 'obraSocial' }] },
                {
                    model: Cama, as: 'cama',
                    include: [{ model: Habitacion, as: 'habitacion', include: [{ model: Ala, as: 'ala' }] }]
                },
                { model: Evaluacion, as: 'evaluaciones', include: [{ model: Medico, as: 'medico' }], order: [['fecha_evaluacion', 'DESC']] },
                { model: Alta, as: 'alta', include: [{ model: Medico, as: 'medico' }] }
            ]
        });

        if (!admision) {
            req.flash('error', 'Admisión no encontrada.');
            return res.redirect('/admisiones');
        }

        res.render('admisiones/detalles', {
            admision: admision,
            success: req.flash('success'),
            error: req.flash('error')
        });
    } catch (error) {
        console.error('Error al ver detalles de admisión:', error);
        req.flash('error', 'Error al cargar los detalles de la admisión.');
        res.redirect('/admisiones');
    }
};
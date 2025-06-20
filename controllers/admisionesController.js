const { sequelize, Admision, Paciente, Cama, Habitacion, Ala, ObraSocial, Medico, Evaluacion, Alta, AsignacionCama } = require('../models');

exports.listarAdmisiones = async (req, res) => {
    try {
        const admisiones = await Admision.findAll({
            include: [
                { model: Paciente, as: 'paciente', attributes: ['nombre', 'apellido', 'dni', 'genero'] },
                {
                    model: Cama,
                    as: 'cama',
                    through: { where: { es_actual: true }, required: false },
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
        res.redirect('/');
    }
};

exports.formularioNueva = async (req, res) => {
    try {
        const pacienteIdSeleccionado = req.query.id_paciente;
        let pacienteSeleccionado = null;
        let camasDisponibles = [];

        const pacientes = await Paciente.findAll({
            attributes: ['id_paciente', 'nombre', 'apellido', 'dni', 'genero'],
            order: [['apellido', 'ASC'], ['nombre', 'ASC']]
        });

        const obrasSociales = await ObraSocial.findAll();
        
        if (pacienteIdSeleccionado) {
            pacienteSeleccionado = await Paciente.findByPk(pacienteIdSeleccionado);

            if (pacienteSeleccionado) {
                const sexoPacienteNuevo = pacienteSeleccionado.genero;

                const camasLibres = await Cama.findAll({
                    where: { estado: 'Libre' },
                    include: [{
                        model: Habitacion,
                        as: 'habitacion',
                        include: [{
                            model: Cama,
                            as: 'camas',
                            include: [{
                                model: Admision,
                                as: 'admisiones',
                                where: { estado_admision: 'Activa' },
                                required: false,
                                include: [{
                                    model: Paciente,
                                    as: 'paciente',
                                    attributes: ['genero']
                                }]
                            }]
                        },
                        {
                           model: Ala,
                           as: 'ala'
                        }]
                    }]
                });

                camasDisponibles = camasLibres.filter(cama => {
                    const habitacion = cama.habitacion;
                    if (habitacion.tipo !== 'Compartida') {
                        return true;
                    }
                    
                    const otraCamaOcupada = habitacion.camas.find(c => c.id_cama !== cama.id_cama && c.estado === 'Ocupada');

                    if (!otraCamaOcupada) {
                        return true;
                    }
                    
                    if (otraCamaOcupada.admisiones && otraCamaOcupada.admisiones.length > 0) {
                        const pacienteExistente = otraCamaOcupada.admisiones[0].paciente;
                        if (pacienteExistente && pacienteExistente.genero === sexoPacienteNuevo) {
                            return true;
                        }
                    }
                    return false;
                });
            }
        }
        
        res.render('admisiones/nueva', {
            pacientes: pacientes,
            camasDisponibles: camasDisponibles,
            obrasSociales: obrasSociales,
            pacienteSeleccionado: pacienteSeleccionado,
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
            if (!created && !esNuevaAdmisionEmergencia) {
                throw new Error(`Ya existe un paciente con el DNI ${finalDniToUse}. Seleccione el paciente existente del desplegable o proporcione un DNI diferente.`);
            }
            pacienteId = newOrExistingPaciente.id_paciente;
        }

        const camaIdNumerico = parseInt(id_cama_asignada, 10);
        if (!id_cama_asignada || isNaN(camaIdNumerico)) {
            throw new Error('Debe seleccionar una cama válida para la admisión.');
        }
        
        const cama = await Cama.findByPk(camaIdNumerico, { transaction: t, lock: t.LOCK.UPDATE });
        if (!cama || cama.estado !== 'Libre') {
            throw new Error(`La cama seleccionada no está disponible.`);
        }
        
        const pacienteActual = await Paciente.findByPk(pacienteId, { transaction: t });
        const habitacion = await Habitacion.findByPk(cama.id_habitacion, {
            include: [{ model: Cama, as: 'camas', include: [{model: Admision, as: 'admisiones', where: {estado_admision: 'Activa'}, required: false, include: [{model: Paciente, as: 'paciente'}]}]}],
            transaction: t
        });

        if (habitacion.tipo === 'Compartida') {
            const otraCamaOcupada = habitacion.camas.find(c => c.estado === 'Ocupada');
            if (otraCamaOcupada && otraCamaOcupada.admisiones[0].paciente.genero !== pacienteActual.genero) {
                throw new Error(`Conflicto de género. La habitación ya está ocupada por un paciente de género diferente.`);
            }
        }
        
        const nuevaAdmision = await Admision.create({
            id_paciente: pacienteId,
            fecha_ingreso: fecha_ingreso || new Date(),
            motivo_internacion: motivo_internacion,
            es_emergencia: esNuevaAdmisionEmergencia,
            estado_admision: 'Activa'
        }, { transaction: t });
        
        await AsignacionCama.create({
            id_admision: nuevaAdmision.id_admision,
            id_cama: camaIdNumerico,
            fecha_asignacion: new Date(),
            es_actual: true
        }, { transaction: t });

        await cama.update({ estado: 'Ocupada' }, { transaction: t });
        
        await t.commit();
        req.flash('success', 'Admisión y asignación de cama realizadas con éxito.');
        res.redirect('/admisiones');
    } catch (error) {
        await t.rollback();
        console.error('Error al guardar admisión:', error);
        req.flash('error', error.message || 'Error al procesar la admisión.');
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
                    through: { where: { es_actual: true } },
                    include: [{ model: Habitacion, as: 'habitacion', include: [{ model: Ala, as: 'ala' }] }]
                }
            ]
        });
        if (!admision) {
            req.flash('error', 'Admisión no encontrada.');
            return res.redirect('/admisiones');
        }
        const pacientes = await Paciente.findAll({ order: [['apellido', 'ASC']] });
        
        const camaActualId = (admision.Camas && admision.Camas.length > 0) ? admision.Camas[0].id_cama : null;

        const camasDisponibles = await Cama.findAll({
            where: {
                [sequelize.Op.or]: [
                    { estado: 'Libre' },
                    { id_cama: camaActualId }
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
        const { motivo_internacion, id_cama_nueva, estado_admision, fecha_alta } = req.body;
        const admision = await Admision.findByPk(id_admision, { transaction: t });
        if (!admision) {
            throw new Error('Admisión no encontrada.');
        }

        const asignacionActual = await AsignacionCama.findOne({ where: { id_admision, es_actual: true }, transaction: t });
        const oldCamaId = asignacionActual ? asignacionActual.id_cama : null;
        const newCamaId = id_cama_nueva ? parseInt(id_cama_nueva, 10) : oldCamaId;

        await admision.update({
            motivo_internacion,
            estado_admision,
            fecha_alta: fecha_alta || null,
        }, { transaction: t });

        if (newCamaId && newCamaId !== oldCamaId) {
            if (asignacionActual) {
                await asignacionActual.update({ es_actual: false, fecha_liberacion: new Date() }, { transaction: t });
                const oldCama = await Cama.findByPk(oldCamaId, { transaction: t });
                if (oldCama) {
                    await oldCama.update({ estado: 'Libre' }, { transaction: t });
                }
            }
            await AsignacionCama.create({ id_admision, id_cama: newCamaId, fecha_asignacion: new Date(), es_actual: true }, { transaction: t });
            const nuevaCama = await Cama.findByPk(newCamaId, { transaction: t });
            if (!nuevaCama || nuevaCama.estado !== 'Libre') {
                throw new Error('La nueva cama seleccionada no está disponible.');
            }
            await nuevaCama.update({ estado: 'Ocupada' }, { transaction: t });
        }
        
        if ((estado_admision === 'Dada de Alta' || estado_admision === 'Cancelada') && oldCamaId) {
            const camaFinal = await Cama.findByPk(oldCamaId, { transaction: t });
            if (camaFinal) {
                await camaFinal.update({ estado: 'Libre' }, { transaction: t });
                if(asignacionActual) {
                    await asignacionActual.update({ es_actual: false, fecha_liberacion: new Date() }, { transaction: t });
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
        const admision = await Admision.findByPk(id_admision, { transaction: t });

        if (!admision) {
            throw new Error('Admisión no encontrada.');
        }
        if (admision.estado_admision !== 'Activa' && admision.estado_admision !== 'En Proceso') {
            throw new Error('No se puede cancelar una admisión que no esté Activa o En Proceso.');
        }
        await admision.update({ estado_admision: 'Cancelada', fecha_alta: new Date() }, { transaction: t });
        
        const asignacion = await AsignacionCama.findOne({ where: { id_admision, es_actual: true }, transaction: t });
        if (asignacion) {
            await asignacion.update({ es_actual: false, fecha_liberacion: new Date() }, { transaction: t });
            const cama = await Cama.findByPk(asignacion.id_cama, { transaction: t });
            if (cama) {
                await cama.update({ estado: 'Libre' }, { transaction: t });
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
    } catch (error) {
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
                    through: { where: { es_actual: true } },
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
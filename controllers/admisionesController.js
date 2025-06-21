const { sequelize, Admision, Paciente, Cama, Habitacion, Ala, ObraSocial, Medico, Evaluacion, Alta } = require('../models');

exports.listarAdmisiones = async (req, res) => {
    try {
        const admisiones = await Admision.findAll({
            include: [
                {
                    model: Paciente,
                    as: 'paciente',
                    attributes: ['id_paciente', 'nombre', 'apellido', 'dni', 'genero']
                },
                {
                    model: Cama,
                    as: 'cama',
                    required: false,
                    include: [
                        {
                            model: Habitacion,
                            as: 'habitacion',
                            include: [{ model: Ala, as: 'ala' }]
                        }
                    ]
                }
            ],
            order: [['fecha_ingreso', 'DESC']]
        });
        res.render('admisiones/index', {
            admisiones: admisiones,
            title: 'Admisiones',
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
        const pacientes = await Paciente.findAll({
            attributes: ['id_paciente', 'nombre', 'apellido', 'dni', 'genero'],
            order: [['apellido', 'ASC'], ['nombre', 'ASC']]
        });
        const camasDisponibles = await Cama.findAll({
            where: { estado: 'Libre' },
            include: [{ model: Habitacion, as: 'habitacion', include: [{ model: Ala, as: 'ala' }] }],
            order: [['id_cama', 'ASC']]
        });
        const obrasSociales = await ObraSocial.findAll();
        res.render('admisiones/nueva', {
            pacientes: pacientes,
            camasDisponibles: camasDisponibles,
            obrasSociales: obrasSociales,
            pacienteSeleccionado: null,
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
            id_paciente_seleccionado, motivo_internacion, id_cama_asignada
        } = req.body;

        if (!id_paciente_seleccionado || !id_cama_asignada || !motivo_internacion) {
            throw new Error('Debe seleccionar un paciente, una cama y especificar un motivo.');
        }

        const cama = await Cama.findByPk(id_cama_asignada, { transaction: t, lock: t.LOCK.UPDATE });
        if (!cama || cama.estado !== 'Libre') {
            throw new Error('La cama seleccionada ya no está disponible.');
        }

        const paciente = await Paciente.findByPk(id_paciente_seleccionado, { transaction: t });
        if (!paciente) {
            throw new Error('El paciente seleccionado no existe.');
        }

        const habitacion = await Habitacion.findByPk(cama.id_habitacion, { transaction: t });
        if (habitacion.tipo === 'Compartida') {
            const admisionExistente = await Admision.findOne({
                where: {
                    estado_admision: 'Activa',
                    id_cama_asignada: {
                        [sequelize.Op.in]: sequelize.literal(`(SELECT id_cama FROM cama WHERE id_habitacion = ${habitacion.id_habitacion})`)
                    }
                },
                include: [{ model: Paciente, as: 'paciente' }],
                transaction: t
            });

            if (admisionExistente && admisionExistente.paciente.genero !== paciente.genero) {
                throw new Error(`Conflicto de género. La habitación ya está ocupada por un paciente de género diferente.`);
            }
        }

        await Admision.create({
            id_paciente: id_paciente_seleccionado,
            id_cama_asignada: id_cama_asignada,
            motivo_internacion: motivo_internacion,
            fecha_ingreso: new Date(),
            estado_admision: 'Activa'
        }, { transaction: t });

        await cama.update({ estado: 'Ocupada' }, { transaction: t });
        await t.commit();
        req.flash('success', 'Admisión registrada con éxito.');
        res.redirect('/admisiones');
    } catch (error) {
        await t.rollback();
        console.error('Error al guardar admisión:', error);
        req.flash('error', `Error al procesar la admisión: ${error.message}`);
        res.redirect('/admisiones/nueva');
    }
};


exports.formularioEditar = async (req, res) => {
    try {
        const admision = await Admision.findByPk(req.params.id_admision, {
            include: [
                { model: Paciente, as: 'paciente' },
                {
                    model: Cama,
                    as: 'cama',
                    include: [{ model: Habitacion, as: 'habitacion', include: [{ model: Ala, as: 'ala' }] }]
                }
            ]
        });
        if (!admision) {
            req.flash('error', 'Admisión no encontrada.');
            return res.redirect('/admisiones');
        }
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
            camasDisponibles: camasDisponibles,
            error: req.flash('error'),
            success: req.flash('success')
        });
    } catch (error) {
        console.error('Error al cargar formulario de edición:', error);
        req.flash('error', 'Error al preparar el formulario de edición.');
        res.redirect('/admisiones');
    }
};

exports.actualizarAdmision = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { id_admision } = req.params;
        const { motivo_internacion, id_cama_asignada, estado_admision } = req.body;

        const admision = await Admision.findByPk(id_admision, { transaction: t });
        if (!admision) {
            throw new Error('Admisión no encontrada.');
        }

        const oldCamaId = admision.id_cama_asignada;
        const newCamaId = id_cama_asignada ? parseInt(id_cama_asignada, 10) : oldCamaId;

        await admision.update({
            motivo_internacion,
            estado_admision,
            id_cama_asignada: newCamaId,
            fecha_alta: (estado_admision === 'Dada de Alta' || estado_admision === 'Cancelada') ? new Date() : null
        }, { transaction: t });

        if (newCamaId !== oldCamaId) {
            const nuevaCama = await Cama.findByPk(newCamaId, { transaction: t, lock: t.LOCK.UPDATE });
            if (!nuevaCama || nuevaCama.estado !== 'Libre') {
                throw new Error('La nueva cama seleccionada no está disponible.');
            }
            await nuevaCama.update({ estado: 'Ocupada' }, { transaction: t });

            if (oldCamaId) {
                const oldCama = await Cama.findByPk(oldCamaId, { transaction: t });
                if (oldCama) {
                    await oldCama.update({ estado: 'Libre' }, { transaction: t });
                }
            }
        } else if ((estado_admision === 'Dada de Alta' || estado_admision === 'Cancelada') && oldCamaId) {
            const camaALiberar = await Cama.findByPk(oldCamaId, { transaction: t });
            if (camaALiberar) {
                await camaALiberar.update({ estado: 'Libre' }, { transaction: t });
            }
        }

        await t.commit();
        req.flash('success', 'Admisión actualizada con éxito.');
        res.redirect('/admisiones');
    } catch (error) {
        await t.rollback();
        console.error('Error al actualizar admisión:', error);
        req.flash('error', `Error al actualizar: ${error.message}`);
        res.redirect(`/admisiones/editar/${req.params.id_admision}`);
    }
};

exports.verDetalles = async (req, res) => {
    try {
        const admision = await Admision.findByPk(req.params.id_admision, {
            include: [
                { model: Paciente, as: 'paciente', include: [{ model: ObraSocial, as: 'obraSocial' }] },
                {
                    model: Cama,
                    as: 'cama',
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
            admision,
            success: req.flash('success'),
            error: req.flash('error')
        });
    } catch (error) {
        console.error('Error al ver detalles de admisión:', error);
        req.flash('error', 'Error al cargar los detalles de la admisión.');
        res.redirect('/admisiones');
    }
};
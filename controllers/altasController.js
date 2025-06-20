const { Alta, Admision, Medico, Paciente, AsignacionCama } = require('../models');
const { sequelize } = require('../models');

exports.listarAltas = async (req, res) => {
    try {
        const altas = await Alta.findAll({
            include: [
                { model: Admision, as: 'admision', include: [{ model: Paciente, as: 'paciente' }] },
                { model: Medico, as: 'medico' }
            ],
            order: [['fecha_alta_real', 'DESC']]
        });
        res.render('altas/index', {
            altas: altas,
            success: req.flash('success'),
            error: req.flash('error')
        });
    } catch (error) {
        console.error('Error al listar altas:', error);
        req.flash('error', 'Error al cargar el listado de altas.');
        res.redirect('/');
    }
};

exports.formularioNueva = async (req, res) => {
    try {
        const { id_admision } = req.params;

        const admision = await Admision.findByPk(id_admision, {
            include: [
                { model: Paciente, as: 'paciente' },
                { model: Alta, as: 'alta' }
            ]
        });

        if (!admision) {
            req.flash('error', 'Admisión no encontrada para dar de alta.');
            return res.redirect('/admisiones');
        }
        if (admision.estado_admision === 'Dada de Alta') {
            req.flash('error', 'Esta admisión ya ha sido dada de alta.');
            return res.redirect(`/admisiones/detalles/${admision.id_admision}`);
        }
        if (admision.estado_admision === 'Cancelada') {
            req.flash('error', 'Esta admisión ha sido cancelada y no puede ser dada de alta.');
            return res.redirect(`/admisiones/detalles/${admision.id_admision}`);
        }

        const medicos = await Medico.findAll();

        res.render('altas/nueva', {
            admision: admision,
            medicos: medicos,
            success: req.flash('success'),
            error: req.flash('error')
        });
    } catch (error) {
        console.error('Error al cargar formulario de alta:', error);
        req.flash('error', 'Error al preparar el formulario de alta.');
        res.redirect('/admisiones');
    }
};

exports.guardarAlta = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const {
            id_admision, id_medico, diagnostico_final, tratamiento_indicado,
            medicamentos_recetados, fecha_control_sugerido, observaciones_alta
        } = req.body;

        if (!id_admision || !id_medico || !diagnostico_final || !tratamiento_indicado || !medicamentos_recetados) {
            throw new Error('Faltan campos obligatorios para el alta.');
        }

        const admision = await Admision.findByPk(id_admision, { transaction: t });
        if (!admision) {
            throw new Error('Admisión no encontrada.');
        }
        if (admision.estado_admision === 'Dada de Alta' || admision.estado_admision === 'Cancelada') {
            throw new Error('Esta admisión no puede ser dada de alta.');
        }

        // Crear registro de alta
        await Alta.create({
            id_admision,
            id_medico,
            fecha_alta_real: new Date(),
            diagnostico_final,
            tratamiento_indicado,
            medicamentos_recetados,
            fecha_control_sugerido: fecha_control_sugerido || null,
            observaciones_alta
        }, { transaction: t });

        // Actualizar estado de la admisión
        await admision.update({ estado_admision: 'Dada de Alta', fecha_alta: new Date() }, { transaction: t });

        // Liberar cama 
        const asignacionActual = await AsignacionCama.findOne({
            where: { id_admision: id_admision, es_actual: true },
            transaction: t
        });
        if (asignacionActual) {
            await asignacionActual.update({ es_actual: false, fecha_liberacion: new Date() }, { transaction: t });
            const cama = await Cama.findByPk(asignacionActual.id_cama, { transaction: t });
            if (cama) {
                await cama.update({ estado: 'Libre', genero_asignado: null }, { transaction: t });
            }
        }

        await t.commit();
        req.flash('success', 'Paciente dado de alta con éxito.');
        res.redirect('/admisiones');
    } catch (error) {
        await t.rollback();
        console.error('Error al guardar alta:', error);
        req.flash('error', `Error al dar de alta al paciente: ${error.message}`);
        res.redirect(`/altas/nueva/${req.body.id_admision}`); 
    }
};

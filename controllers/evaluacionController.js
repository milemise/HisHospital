const { Evaluacion, Admision, Paciente, Medico } = require('../models');

exports.listarEvaluaciones = async (req, res) => {
    try {
        const evaluaciones = await Evaluacion.findAll({
            include: [
                { model: Admision, as: 'admision', include: [{ model: Paciente, as: 'paciente' }] },
                { model: Medico, as: 'medico' }
            ],
            order: [['fecha_evaluacion', 'DESC']]
        });
        res.render('evaluaciones/index', {
            evaluaciones: evaluaciones,
            success: req.flash('success'),
            error: req.flash('error')
        });
    } catch (error) {
        console.error('Error al listar evaluaciones:', error);
        req.flash('error', 'Error al cargar las evaluaciones.');
        res.redirect('/');
    }
};

exports.formularioNueva = async (req, res) => {
    try {
        const { id_admision } = req.params; 

        const admision = await Admision.findByPk(id_admision, {
            include: [{ model: Paciente, as: 'paciente' }]
        });

        if (!admision) {
            req.flash('error', 'Admisión no encontrada para registrar evaluación.');
            return res.redirect('/admisiones');
        }

        const medicos = await Medico.findAll();

        res.render('evaluaciones/nueva', { 
            admision: admision,
            medicos: medicos,
            success: req.flash('success'),
            error: req.flash('error')
        });
    } catch (error) {
        console.error('Error al cargar formulario de evaluación:', error);
        req.flash('error', 'Error al preparar el formulario de evaluación.');
        res.redirect('/admisiones');
    }
};

exports.guardarEvaluacion = async (req, res) => {
    try {
        const {
            id_admision, id_medico, diagnostico, observaciones_medicas,
            signos_vitales_pa, signos_vitales_fc, signos_vitales_fr, signos_vitales_temp, 
            plan_cuidados
        } = req.body;

        if (!id_admision || !id_medico) {
            throw new Error('Faltan campos obligatorios para la evaluación (Admisión, Médico).');
        }

        const admision = await Admision.findByPk(id_admision);
        if (!admision) {
            throw new Error('Admisión no encontrada.');
        }

        const signosVitales = {};
        if (signos_vitales_pa) signosVitales.presion_arterial = signos_vitales_pa;
        if (signos_vitales_fc) signosVitales.frecuencia_cardiaca = signos_vitales_fc;
        if (signos_vitales_fr) signosVitales.frecuencia_respiratoria = signos_vitales_fr;
        if (signos_vitales_temp) signosVitales.temperatura = signos_vitales_temp;


        await Evaluacion.create({
            id_admision,
            id_paciente: admision.id_paciente, 
            id_medico,
            diagnostico: diagnostico || null, 
            observaciones_medicas: observaciones_medicas || null,
            signos_vitales: Object.keys(signosVitales).length > 0 ? signosVitales : null, 
            plan_cuidados: plan_cuidados || null
        });

        req.flash('success', 'Evaluación registrada con éxito.');
        res.redirect(`/admisiones/detalles/${id_admision}`); 
    } catch (error) {
        console.error('Error al guardar evaluación:', error);
        req.flash('error', `Error al registrar la evaluación: ${error.message}`);
        res.redirect(`/evaluaciones/nueva/${req.body.id_admision}`);
    }
};
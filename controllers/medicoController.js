const { Medico, Especialidad } = require('../models');

exports.listarMedicos = async (req, res) => {
    try {
        const medicos = await Medico.findAll({
            include: [{ model: Especialidad, as: 'especialidad' }]
        });
        res.render('medicos/index', {
            medicos: medicos,
            success: req.flash('success'),
            error: req.flash('error')
        });
    } catch (error) {
        console.error('Error al listar médicos:', error);
        req.flash('error', 'Error al cargar la lista de médicos.');
        res.redirect('/');
    }
};

exports.formularioNueva = async (req, res) => {
    try {
        const especialidades = await Especialidad.findAll();
        res.render('medicos/nuevo', {
            especialidades: especialidades,
            success: req.flash('success'),
            error: req.flash('error')
        });
    } catch (error) {
        console.error('Error al cargar formulario de nuevo médico:', error);
        req.flash('error', 'Error al preparar el formulario de médico.');
        res.redirect('/medicos');
    }
};

exports.guardarMedico = async (req, res) => {
    try {
        const { nombre, apellido, id_especialidad, matricula, telefono, email } = req.body;
        if (!nombre || !apellido || !id_especialidad || !matricula || !email) {
            throw new Error('Faltan campos obligatorios para el médico (Nombre, Apellido, Especialidad, Matrícula, Email).');
        }
        await Medico.create({ nombre, apellido, id_especialidad, matricula, telefono, email, activo: true });
        req.flash('success', 'Médico creado con éxito.');
        res.redirect('/medicos');
    } catch (error) {
        console.error('Error al guardar médico:', error);
        let errorMessage = 'Error al crear el médico.';
        if (error.name === 'SequelizeUniqueConstraintError') {
            errorMessage = `Ya existe un médico con la matrícula ${req.body.matricula} o el email ${req.body.email}.`;
        } else {
            errorMessage = error.message || errorMessage;
        }
        req.flash('error', errorMessage);
        res.redirect('/medicos/nuevo');
    }
};

exports.formularioEditar = async (req, res) => {
    try {
        const medico = await Medico.findByPk(req.params.id, {
            include: [{ model: Especialidad, as: 'especialidad' }]
        });
        if (!medico) {
            req.flash('error', 'Médico no encontrado.');
            return res.redirect('/medicos');
        }
        const especialidades = await Especialidad.findAll();
        res.render('medicos/editar', {
            medico: medico,
            especialidades: especialidades,
            success: req.flash('success'),
            error: req.flash('error')
        });
    } catch (error) {
        console.error('Error al cargar formulario de edición de médico:', error);
        req.flash('error', 'Error al preparar el formulario de edición de médico.');
        res.redirect('/medicos');
    }
};

exports.actualizarMedico = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, apellido, id_especialidad, matricula, telefono, email, activo } = req.body;
        if (!nombre || !apellido || !id_especialidad || !matricula || !email) {
            throw new Error('Faltan campos obligatorios para el médico.');
        }
        const medico = await Medico.findByPk(id);
        if (!medico) {
            throw new Error('Médico no encontrado.');
        }
        await medico.update({ nombre, apellido, id_especialidad, matricula, telefono, email, activo: activo === 'on' ? true : false });
        req.flash('success', 'Médico actualizado con éxito.');
        res.redirect('/medicos');
    } catch (error) {
        console.error('Error al actualizar médico:', error);
        let errorMessage = 'Error al actualizar el médico.';
        if (error.name === 'SequelizeUniqueConstraintError') {
            errorMessage = `Ya existe otro médico con la matrícula ${req.body.matricula} o el email ${req.body.email}.`;
        } else {
            errorMessage = error.message || errorMessage;
        }
        req.flash('error', errorMessage);
        res.redirect(`/medicos/editar/${req.params.id}`);
    }
};

exports.eliminarMedico = async (req, res) => {
    try {
        const { id } = req.params;
        const medico = await Medico.findByPk(id);
        if (!medico) {
            throw new Error('Médico no encontrado.');
        }
   
        await medico.destroy(); 
        req.flash('success', 'Médico eliminado con éxito.');
        res.redirect('/medicos');
    } catch (error) {
        console.error('Error al eliminar médico:', error);
        req.flash('error', `Error al eliminar el médico: ${error.message}`);
        res.redirect('/medicos');
    }
};
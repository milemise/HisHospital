const { Paciente, ObraSocial, Admision } = require('../models');

exports.listarPacientes = async (req, res) => {
    try {
        const pacientes = await Paciente.findAll({
            include: [{ model: ObraSocial, as: 'obraSocial' }],
            order: [['apellido', 'ASC'], ['nombre', 'ASC']]
        });
        res.render('pacientes/index', {
            pacientes: pacientes,
            success: req.flash('success'),
            error: req.flash('error')
        });
    } catch (error) {
        console.error('Error al listar pacientes:', error);
        req.flash('error', 'Error al cargar la lista de pacientes.');
        res.redirect('/');
    }
};

exports.formularioNueva = async (req, res) => {
    try {
        const obrasSociales = await ObraSocial.findAll();
        res.render('pacientes/nuevo', {
            obrasSociales: obrasSociales,
            success: req.flash('success'),
            error: req.flash('error')
        });
    } catch (error) {
        console.error('Error al cargar formulario de nuevo paciente:', error);
        req.flash('error', 'Error al preparar el formulario de paciente.');
        res.redirect('/pacientes');
    }
};

exports.guardarPaciente = async (req, res) => {
    try {
        const {
            nombre, apellido, dni, fecha_nacimiento, genero, telefono,
            email, direccion, grupo_sanguineo, alergias, medicamentos_actuales,
            id_obra_social, numero_afiliado
        } = req.body;

        if (!nombre || !apellido || !dni || !fecha_nacimiento || !genero) {
            throw new Error('Faltan campos obligatorios para el paciente (Nombre, Apellido, DNI, Fecha de Nacimiento, Género).');
        }

        await Paciente.create({
            nombre, apellido, dni, fecha_nacimiento, genero, telefono,
            email, direccion, grupo_sanguineo, alergias, medicamentos_actuales,
            id_obra_social: id_obra_social || null,
            numero_afiliado,
            activo: true
        });
        req.flash('success', 'Paciente creado con éxito.');
        res.redirect('/pacientes');
    } catch (error) {
        console.error('Error al guardar paciente:', error);
        let errorMessage = 'Error al crear el paciente.';
        if (error.name === 'SequelizeUniqueConstraintError') {
            errorMessage = `Ya existe un paciente con el DNI ${req.body.dni}.`;
        } else {
            errorMessage = error.message || errorMessage;
        }
        req.flash('error', errorMessage);
        res.redirect('/pacientes/nuevo');
    }
};

exports.formularioEditar = async (req, res) => {
    try {
        const paciente = await Paciente.findByPk(req.params.id_paciente, { // <--- CAMBIO AQUÍ: id_paciente
            include: [{ model: ObraSocial, as: 'obraSocial' }]
        });
        if (!paciente) {
            req.flash('error', 'Paciente no encontrado.');
            return res.redirect('/pacientes');
        }
        const obrasSociales = await ObraSocial.findAll();
        res.render('pacientes/editar', {
            paciente: paciente,
            obrasSociales: obrasSociales,
            success: req.flash('success'),
            error: req.flash('error')
        });
    } catch (error) {
        console.error('Error al cargar formulario de edición de paciente:', error);
        req.flash('error', 'Error al preparar el formulario de edición de paciente.');
        res.redirect('/pacientes');
    }
};

exports.actualizarPaciente = async (req, res) => {
    try {
        const { id_paciente } = req.params; // <--- CAMBIO AQUÍ: id_paciente
        const {
            nombre, apellido, dni, fecha_nacimiento, genero, telefono,
            email, direccion, grupo_sanguineo, alergias, medicamentos_actuales,
            id_obra_social, numero_afiliado, activo
        } = req.body;

        if (!nombre || !apellido || !dni || !fecha_nacimiento || !genero) {
            throw new Error('Faltan campos obligatorios para el paciente.');
        }

        const paciente = await Paciente.findByPk(id_paciente); // <--- CAMBIO AQUÍ: id_paciente
        if (!paciente) {
            throw new Error('Paciente no encontrado.');
        }

        await paciente.update({
            nombre, apellido, dni, fecha_nacimiento, genero, telefono,
            email, direccion, grupo_sanguineo, alergias, medicamentos_actuales,
            id_obra_social: id_obra_social || null,
            numero_afiliado,
            activo: activo === 'on' ? true : false
        });
        req.flash('success', 'Paciente actualizado con éxito.');
        res.redirect('/pacientes');
    } catch (error) {
        console.error('Error al actualizar paciente:', error);
        let errorMessage = 'Error al actualizar el paciente.';
        if (error.name === 'SequelizeUniqueConstraintError') {
            errorMessage = `Ya existe otro paciente con el DNI ${req.body.dni}.`;
        } else {
            errorMessage = error.message || errorMessage;
        }
        req.flash('error', errorMessage);
        res.redirect(`/pacientes/editar/${req.params.id_paciente}`); // <--- CAMBIO AQUÍ: id_paciente
    }
};

exports.eliminarPaciente = async (req, res) => {
    try {
        const { id_paciente } = req.params; // <--- CAMBIO AQUÍ: id_paciente
        const paciente = await Paciente.findByPk(id_paciente); // <--- CAMBIO AQUÍ: id_paciente
        if (!paciente) {
            throw new Error('Paciente no encontrado.');
        }
        const admisionesActivas = await Admision.count({ where: { id_paciente: id_paciente, estado: 'Activo' } }); // <--- CAMBIO AQUÍ: id_paciente, estado
        if (admisionesActivas > 0) {
            throw new Error('No se puede eliminar el paciente porque tiene admisiones activas. Primero de de alta o cancele las admisiones.');
        }
        await paciente.destroy();
        req.flash('success', 'Paciente eliminado con éxito.');
        res.redirect('/pacientes');
    } catch (error) {
        console.error('Error al eliminar paciente:', error);
        req.flash('error', `Error al eliminar el paciente: ${error.message}`);
        res.redirect('/pacientes');
    }
};

// Ruta para mostrar formulario de nueva admisión (usando un paciente existente)
exports.formularioAdmisionParaPaciente = async (req, res) => {
    try {
        const pacienteId = req.params.id_paciente; // <--- CAMBIO AQUÍ: id_paciente
        // Redirige al formulario de nueva admisión, posiblemente pre-llenando el paciente
        res.redirect(`/admisiones/nueva?id_paciente=${pacienteId}`);
    } catch (error) {
        console.error('Error al preparar admisión para paciente:', error);
        req.flash('error', 'No se pudo iniciar el proceso de admisión.');
        res.redirect('/pacientes');
    }
};
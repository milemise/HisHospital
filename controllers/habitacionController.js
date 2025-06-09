const { Habitacion, Ala, Cama } = require('../models');

exports.listarHabitaciones = async (req, res) => {
    try {
        const habitaciones = await Habitacion.findAll({
            include: [
                { model: Ala, as: 'ala' },
                { model: Cama, as: 'camas' }
            ],
            order: [['numero', 'ASC']]
        });
        res.render('habitacion/index', {
            habitaciones: habitaciones,
            success: req.flash('success'),
            error: req.flash('error')
        });
    } catch (error) {
        console.error('Error al listar habitaciones:', error);
        req.flash('error', 'Error al cargar las habitaciones.');
        res.redirect('/');
    }
};

exports.formularioNueva = async (req, res) => {
    try {
        const alas = await Ala.findAll();
        res.render('habitacion/nuevo', {
            alas: alas,
            success: req.flash('success'),
            error: req.flash('error')
        });
    } catch (error) {
        console.error('Error al cargar formulario de nueva habitación:', error);
        req.flash('error', 'Error al preparar el formulario de habitación.');
        res.redirect('/habitaciones');
    }
};

exports.guardarHabitacion = async (req, res) => {
    try {
        const { numero, tipo, estado, id_ala } = req.body;
        if (!numero || !tipo || !estado || !id_ala) {
            throw new Error('Faltan campos obligatorios para la habitación.');
        }
        await Habitacion.create({ numero, tipo, estado, id_ala });
        req.flash('success', 'Habitación creada con éxito.');
        res.redirect('/habitaciones');
    } catch (error) {
        console.error('Error al guardar habitación:', error);
        req.flash('error', `Error al crear la habitación: ${error.message}`);
        res.redirect('/habitaciones/nuevo');
    }
};

exports.formularioEditar = async (req, res) => {
    try {
        const habitacion = await Habitacion.findByPk(req.params.id, {
            include: [{ model: Ala, as: 'ala' }]
        });
        if (!habitacion) {
            req.flash('error', 'Habitación no encontrada.');
            return res.redirect('/habitaciones');
        }
        const alas = await Ala.findAll();
        res.render('habitacion/editar', {
            habitacion: habitacion,
            alas: alas,
            success: req.flash('success'),
            error: req.flash('error')
        });
    } catch (error) {
        console.error('Error al cargar formulario de edición de habitación:', error);
        req.flash('error', 'Error al preparar el formulario de edición de habitación.');
        res.redirect('/habitaciones');
    }
};

exports.actualizarHabitacion = async (req, res) => {
    try {
        const { id } = req.params;
        const { numero, tipo, estado, id_ala } = req.body;
        if (!numero || !tipo || !estado || !id_ala) {
            throw new Error('Faltan campos obligatorios para la habitación.');
        }
        const habitacion = await Habitacion.findByPk(id);
        if (!habitacion) {
            throw new Error('Habitación no encontrada.');
        }
        await habitacion.update({ numero, tipo, estado, id_ala });
        req.flash('success', 'Habitación actualizada con éxito.');
        res.redirect('/habitaciones');
    } catch (error) {
        console.error('Error al actualizar habitación:', error);
        req.flash('error', `Error al actualizar la habitación: ${error.message}`);
        res.redirect(`/habitaciones/editar/${req.params.id}`);
    }
};

exports.eliminarHabitacion = async (req, res) => {
    try {
        const { id } = req.params;
        const habitacion = await Habitacion.findByPk(id);
        if (!habitacion) {
            throw new Error('Habitación no encontrada.');
        }
        // Verificar si hay camas asociadas
        const camas = await Cama.count({ where: { id_habitacion: id } });
        if (camas > 0) {
            throw new Error('No se puede eliminar la habitación porque tiene camas asociadas.');
        }
        await habitacion.destroy();
        req.flash('success', 'Habitación eliminada con éxito.');
        res.redirect('/habitaciones');
    } catch (error) {
        console.error('Error al eliminar habitación:', error);
        req.flash('error', `Error al eliminar la habitación: ${error.message}`);
        res.redirect('/habitaciones');
    }
};
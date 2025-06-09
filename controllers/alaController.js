const { Ala, Habitacion } = require('../models');

exports.listarAlas = async (req, res) => {
    try {
        const alas = await Ala.findAll({
            include: [{ model: Habitacion, as: 'habitaciones' }]
        });
        res.render('ala/index', {
            alas: alas,
            success: req.flash('success'),
            error: req.flash('error')
        });
    } catch (error) {
        console.error('Error al listar alas:', error);
        req.flash('error', 'Error al cargar las alas.');
        res.redirect('/');
    }
};

exports.formularioNueva = (req, res) => {
    res.render('ala/nuevo', {
        success: req.flash('success'),
        error: req.flash('error')
    });
};

exports.guardarAla = async (req, res) => {
    try {
        const { nombre } = req.body;
        if (!nombre) {
            throw new Error('El nombre del ala es obligatorio.');
        }
        await Ala.create({ nombre });
        req.flash('success', 'Ala creada con éxito.');
        res.redirect('/alas');
    } catch (error) {
        console.error('Error al guardar ala:', error);
        req.flash('error', `Error al crear el ala: ${error.message}`);
        res.redirect('/alas/nuevo');
    }
};

exports.formularioEditar = async (req, res) => {
    try {
        const ala = await Ala.findByPk(req.params.id);
        if (!ala) {
            req.flash('error', 'Ala no encontrada.');
            return res.redirect('/alas');
        }
        res.render('ala/editar', {
            ala: ala,
            success: req.flash('success'),
            error: req.flash('error')
        });
    } catch (error) {
        console.error('Error al cargar formulario de edición de ala:', error);
        req.flash('error', 'Error al preparar el formulario de edición del ala.');
        res.redirect('/alas');
    }
};

exports.actualizarAla = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre } = req.body;
        if (!nombre) {
            throw new Error('El nombre del ala es obligatorio.');
        }
        const ala = await Ala.findByPk(id);
        if (!ala) {
            throw new Error('Ala no encontrada.');
        }
        await ala.update({ nombre });
        req.flash('success', 'Ala actualizada con éxito.');
        res.redirect('/alas');
    } catch (error) {
        console.error('Error al actualizar ala:', error);
        req.flash('error', `Error al actualizar el ala: ${error.message}`);
        res.redirect(`/alas/editar/${req.params.id}`);
    }
};

exports.eliminarAla = async (req, res) => {
    try {
        const { id } = req.params;
        const ala = await Ala.findByPk(id);
        if (!ala) {
            throw new Error('Ala no encontrada.');
        }
        const habitaciones = await Habitacion.count({ where: { id_ala: id } });
        if (habitaciones > 0) {
            throw new Error('No se puede eliminar el ala porque tiene habitaciones asociadas.');
        }
        await ala.destroy();
        req.flash('success', 'Ala eliminada con éxito.');
        res.redirect('/alas');
    } catch (error) {
        console.error('Error al eliminar ala:', error);
        req.flash('error', `Error al eliminar el ala: ${error.message}`);
        res.redirect('/alas');
    }
};
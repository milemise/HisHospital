const { Cama, Habitacion, Ala, AsignacionCama } = require('../models');
const { sequelize } = require('../models');

exports.listarCamas = async (req, res) => {
    try {
        const camas = await Cama.findAll({
            include: [
                {
                    model: Habitacion,
                    as: 'habitacion',
                    include: [{ model: Ala, as: 'ala' }]
                },
                {
                    model: AsignacionCama,
                    as: 'asignaciones', 
                    where: { es_actual: true },
                    required: false, // Para mostrar camas libres
                    include: [{
                        model: Admision,
                        as: 'admision',
                        include: [{ model: Paciente, as: 'paciente' }] 
                    }]
                }
            ],
            order: [['id_habitacion', 'ASC'], ['numero', 'ASC']]
        });
        res.render('cama/index', {
            camas: camas,
            success: req.flash('success'),
            error: req.flash('error')
        });
    } catch (error) {
        console.error('Error al listar camas:', error);
        req.flash('error', 'Error al cargar las camas.');
        res.redirect('/');
    }
};

exports.formularioNueva = async (req, res) => {
    try {
        const habitaciones = await Habitacion.findAll({
            include: [{ model: Ala, as: 'ala' }]
        });
        res.render('cama/nuevo', {
            habitaciones: habitaciones,
            success: req.flash('success'),
            error: req.flash('error')
        });
    } catch (error) {
        console.error('Error al cargar formulario de nueva cama:', error);
        req.flash('error', 'Error al preparar el formulario de cama.');
        res.redirect('/camas');
    }
};

exports.guardarCama = async (req, res) => {
    try {
        const { id_habitacion, numero, estado, genero_asignado } = req.body; 

        if (!id_habitacion || !numero || !estado) {
            throw new Error('Faltan campos obligatorios para la cama.');
        }

        const habitacion = await Habitacion.findByPk(id_habitacion);
        if (!habitacion) {
            throw new Error('La habitación seleccionada no existe.');
        }

        if (habitacion.tipo === 'Individual' && genero_asignado) {
            throw new Error('Una cama en habitación individual no debe tener género asignado.');
        }

        await Cama.create({
            id_habitacion,
            numero,
            estado,
            genero_asignado: (habitacion.tipo === 'Compartida' && genero_asignado) ? genero_asignado : null
        });
        req.flash('success', 'Cama creada con éxito.');
        res.redirect('/camas');
    } catch (error) {
        console.error('Error al guardar cama:', error);
        req.flash('error', `Error al crear la cama: ${error.message}`);
        res.redirect('/camas/nuevo');
    }
};

exports.formularioEditar = async (req, res) => {
    try {
        const cama = await Cama.findByPk(req.params.id, {
            include: [{ model: Habitacion, as: 'habitacion', include: [{ model: Ala, as: 'ala' }] }]
        });
        if (!cama) {
            req.flash('error', 'Cama no encontrada.');
            return res.redirect('/camas');
        }
        const habitaciones = await Habitacion.findAll({
            include: [{ model: Ala, as: 'ala' }]
        });
        res.render('cama/editar', {
            cama: cama,
            habitaciones: habitaciones,
            success: req.flash('success'),
            error: req.flash('error')
        });
    } catch (error) {
        console.error('Error al cargar formulario de edición de cama:', error);
        req.flash('error', 'Error al preparar el formulario de edición de cama.');
        res.redirect('/camas');
    }
};

exports.actualizarCama = async (req, res) => {
    try {
        const { id } = req.params;
        const { id_habitacion, numero, estado, genero_asignado } = req.body;

        if (!id_habitacion || !numero || !estado) {
            throw new Error('Faltan campos obligatorios para la cama.');
        }

        const cama = await Cama.findByPk(id);
        if (!cama) {
            throw new Error('Cama no encontrada.');
        }

        const habitacion = await Habitacion.findByPk(id_habitacion);
        if (!habitacion) {
            throw new Error('La habitación seleccionada no existe.');
        }

        let generoParaGuardar = null;
        if (habitacion.tipo === 'Compartida') {
            generoParaGuardar = genero_asignado || null; 
        } else {

            if (genero_asignado) {
                req.flash('warning', 'Género asignado ignorado para camas en habitaciones individuales.');
            }
        }
        
        await cama.update({
            id_habitacion,
            numero,
            estado,
            genero_asignado: generoParaGuardar
        });
        req.flash('success', 'Cama actualizada con éxito.');
        res.redirect('/camas');
    } catch (error) {
        console.error('Error al actualizar cama:', error);
        req.flash('error', `Error al actualizar la cama: ${error.message}`);
        res.redirect(`/camas/editar/${req.params.id}`);
    }
};

exports.eliminarCama = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { id } = req.params;
        const cama = await Cama.findByPk(id, { transaction: t });
        if (!cama) {
            throw new Error('Cama no encontrada.');
        }

        const asignacionesActivas = await AsignacionCama.count({ where: { id_cama: id, es_actual: true }, transaction: t });
        if (asignacionesActivas > 0) {
            throw new Error('No se puede eliminar la cama porque está actualmente asignada a una admisión activa. Libérela primero.');
        }
        

        await cama.destroy({ transaction: t });
        await t.commit();
        req.flash('success', 'Cama eliminada con éxito.');
        res.redirect('/camas');
    } catch (error) {
        await t.rollback();
        console.error('Error al eliminar cama:', error);
        req.flash('error', `Error al eliminar la cama: ${error.message}`);
        res.redirect('/camas');
    }
};
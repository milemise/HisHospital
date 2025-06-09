const { Usuario } = require('../models');
const bcrypt = require('bcryptjs'); 

exports.listarUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll({
            attributes: ['id_usuario', 'nombre_usuario', 'email', 'rol', 'created_at'] 
        });
        res.render('usuarios/index', {
            usuarios: usuarios,
            success: req.flash('success'),
            error: req.flash('error')
        });
    } catch (error) {
        console.error('Error al listar usuarios:', error);
        req.flash('error', 'Error al cargar la lista de usuarios.');
        res.redirect('/');
    }
};

exports.formularioNueva = (req, res) => {
    res.render('usuarios/nuevo', {
        success: req.flash('success'),
        error: req.flash('error')
    });
};

exports.guardarUsuario = async (req, res) => {
    try {
        const { nombre_usuario, email, password, rol } = req.body;
        if (!nombre_usuario || !email || !password || !rol) {
            throw new Error('Faltan campos obligatorios para el usuario.');
        }
        const password_hash = await bcrypt.hash(password, 10);

        await Usuario.create({ nombre_usuario, email, password_hash, rol });
        req.flash('success', 'Usuario creado con éxito.');
        res.redirect('/usuarios');
    } catch (error) {
        console.error('Error al guardar usuario:', error);
        let errorMessage = 'Error al crear el usuario.';
        if (error.name === 'SequelizeUniqueConstraintError') {
            errorMessage = `Ya existe un usuario con el email ${req.body.email}.`;
        } else {
            errorMessage = error.message || errorMessage;
        }
        req.flash('error', errorMessage);
        res.redirect('/usuarios/nuevo');
    }
};

exports.formularioEditar = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id, {
            attributes: ['id_usuario', 'nombre_usuario', 'email', 'rol'] 
        });
        if (!usuario) {
            req.flash('error', 'Usuario no encontrado.');
            return res.redirect('/usuarios');
        }
        res.render('usuarios/editar', {
            usuario: usuario,
            success: req.flash('success'),
            error: req.flash('error')
        });
    } catch (error) {
        console.error('Error al cargar formulario de edición de usuario:', error);
        req.flash('error', 'Error al preparar el formulario de edición de usuario.');
        res.redirect('/usuarios');
    }
};

exports.actualizarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre_usuario, email, password, rol } = req.body;

        if (!nombre_usuario || !email || !rol) {
            throw new Error('Faltan campos obligatorios para el usuario.');
        }

        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            throw new Error('Usuario no encontrado.');
        }

        const updateData = { nombre_usuario, email, rol };
        if (password) {
            updateData.password_hash = await bcrypt.hash(password, 10);
        }

        await usuario.update(updateData);
        req.flash('success', 'Usuario actualizado con éxito.');
        res.redirect('/usuarios');
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        let errorMessage = 'Error al actualizar el usuario.';
        if (error.name === 'SequelizeUniqueConstraintError') {
            errorMessage = `Ya existe otro usuario con el email ${req.body.email}.`;
        } else {
            errorMessage = error.message || errorMessage;
        }
        req.flash('error', errorMessage);
        res.redirect(`/usuarios/editar/${req.params.id}`);
    }
};

exports.eliminarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            throw new Error('Usuario no encontrado.');
        }
        await usuario.destroy();
        req.flash('success', 'Usuario eliminado con éxito.');
        res.redirect('/usuarios');
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        req.flash('error', `Error al eliminar el usuario: ${error.message}`);
        res.redirect('/usuarios');
    }
};
const express = require('express');
const router = express.Router();
console.log('✅ routes/usuarios.js cargado y router inicializado.');
const { Usuario } = require('../models'); 
const bcrypt = require('bcryptjs'); 

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated && req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'Por favor, inicia sesión para acceder a esta página.');
    res.redirect('/auth/login');
}

// Ruta para listar todos los usuarios
router.get('/', ensureAuthenticated, async (req, res) => {
    try {
        const usuarios = await Usuario.findAll(); 
        res.render('usuarios/index', { title: 'Gestión de Usuarios', usuarios: usuarios });
    } catch (error) {
        console.error('Error al listar usuarios:', error);
        req.flash('error', 'No se pudieron cargar los usuarios.');
        res.redirect('/error'); 
    }
});

// Ruta para mostrar el formulario de crear nuevo usuario
router.get('/nuevo', ensureAuthenticated, (req, res) => {
    res.render('usuarios/nuevo', { title: 'Crear Nuevo Usuario' });
});

// Ruta para procesar la creación de un nuevo usuario
router.post('/', ensureAuthenticated, async (req, res) => {
    const { nombre_usuario, email, password, rol } = req.body;
    try {
        const existingUser = await Usuario.findOne({ where: { email: email } });
        if (existingUser) {
            req.flash('error', 'El email ya está registrado.');
            return res.redirect('/usuarios/nuevo');
        }

        const hashedPassword = await bcrypt.hash(password, 10); // Hashear la contraseña
        await Usuario.create({
            nombre_usuario,
            email,
            password_hash: hashedPassword, 
            rol
        });
        req.flash('success', 'Usuario creado exitosamente.');
        res.redirect('/usuarios'); // Redirigir a la lista de usuarios
    } catch (error) {
        console.error('Error al crear usuario:', error);
        req.flash('error', 'Error al crear usuario. Verifique los datos.');
        res.redirect('/usuarios/nuevo');
    }
});

// Ruta para mostrar el formulario de edición de un usuario
router.get('/editar/:id', ensureAuthenticated, async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id);
        if (!usuario) {
            req.flash('error', 'Usuario no encontrado.');
            return res.redirect('/usuarios');
        }
        res.render('usuarios/editar', { title: 'Editar Usuario', usuario: usuario });
    } catch (error) {
        console.error('Error al cargar usuario para edición:', error);
        req.flash('error', 'No se pudo cargar el usuario para edición.');
        res.redirect('/usuarios');
    }
});

// Ruta para procesar la actualización de un usuario
router.post('/actualizar/:id', ensureAuthenticated, async (req, res) => {
    const { nombre_usuario, email, rol, password } = req.body; 
    try {
        const usuario = await Usuario.findByPk(req.params.id);
        if (!usuario) {
            req.flash('error', 'Usuario no encontrado para actualizar.');
            return res.redirect('/usuarios');
        }

        // Actualizar datos del usuario
        usuario.nombre_usuario = nombre_usuario;
        usuario.email = email;
        usuario.rol = rol;
        // Si se proporciona una nueva contraseña, hashearla y actualizarla
        if (password) {
            usuario.password_hash = await bcrypt.hash(password, 10);
        }

        await usuario.save(); // Guardar los cambios
        req.flash('success', 'Usuario actualizado exitosamente.');
        res.redirect('/usuarios');
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        req.flash('error', 'Error al actualizar usuario. Verifique los datos.');
        res.redirect(`/usuarios/editar/${req.params.id}`);
    }
});

// Ruta para procesar la eliminación de un usuario
router.post('/eliminar/:id', ensureAuthenticated, async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id);
        if (!usuario) {
            req.flash('error', 'Usuario no encontrado para eliminar.');
            return res.redirect('/usuarios');
        }
        await usuario.destroy(); // Eliminar el usuario
        req.flash('success', 'Usuario eliminado exitosamente.');
        res.redirect('/usuarios');
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        req.flash('error', 'Error al eliminar usuario.');
        res.redirect('/usuarios');
    }
});


module.exports = router;
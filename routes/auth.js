const express = require('express');
const router = express.Router();
console.log('✅ routes/auth.js cargado y router inicializado.');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const { Usuario } = require('../models');

// ... (tu router.get('/login')) ...

router.post('/login', (req, res, next) => {
    console.log('🔥 Petición POST a /auth/login recibida (router.post("/login")).'); // <--- AÑADE ESTE LOG
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/auth/login',
        failureFlash: true
    })(req, res, next);
});

// ... (tu router.get('/logout')) ...
// ... (tu router.get('/register')) ...

router.post('/register', async (req, res) => {
    console.log('✨ Petición POST a /auth/register recibida (router.post("/register")).'); // <--- AÑADE ESTE LOG
    const { nombre_usuario, email, password } = req.body;
    try {
        const existingUser = await Usuario.findOne({ where: { email: email } });
        if (existingUser) {
            req.flash('error', 'El email ya está registrado.');
            return res.redirect('/auth/register');
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        // Aquí es donde obtuviste el notNull Violation: Usuario.password_hash cannot be null
        await Usuario.create({
            nombre_usuario,
            email,
            password_hash: hashedPassword, // ASEGÚRATE DE QUE ESTO ESTÉ ASÍ EN TU ARCHIVO
            rol: 'recepcion' 
        });

        req.flash('success', 'Usuario registrado exitosamente. Por favor, inicia sesión.');
        res.redirect('/auth/login');
    } catch (error) {
        console.error('🔴 ERROR en router.post("/register"):', error); // <--- LOG MÁS DETALLADO
        req.flash('error', 'Error al registrar usuario. Inténtalo de nuevo.');
        res.redirect('/auth/register');
    }
});

module.exports = router;
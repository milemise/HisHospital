const express = require('express');
const router = express.Router();
console.log('✅ routes/auth.js cargado y router inicializado.');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const { Usuario } = require('../models');

router.get('/login', (req, res) => {
  res.render('auth/login', { title: 'Iniciar Sesión', layout: 'layout' });
});

router.post('/login', (req, res, next) => {
    console.log('🔥 Petición POST a /auth/login recibida.');
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/auth/login',
        failureFlash: true
    })(req, res, next);
});

router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash('success', 'Has cerrado sesión correctamente.');
    res.redirect('/auth/login');
  });
});

router.get('/register', (req, res) => {
  res.render('auth/register', { title: 'Registrarse', layout: 'layout' });
});

router.post('/register', async (req, res) => {
  const { nombre_usuario, email, password } = req.body;
  try {
    const existingUser = await Usuario.findOne({ where: { email: email } });
    if (existingUser) {
      req.flash('error', 'El email ya está registrado.');
      return res.redirect('/auth/register');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await Usuario.create({
      nombre_usuario,
      email,
      password_hash: hashedPassword,
      rol: 'recepcion'
    });
    req.flash('success', 'Usuario registrado exitosamente. Por favor, inicia sesión.');
    res.redirect('/auth/login');
  } catch (error) {
    console.error('🔴 ERROR en router.post("/register"):', error);
    req.flash('error', 'Error al registrar usuario. Inténtalo de nuevo.');
    res.redirect('/auth/register');
  }
});

module.exports = router;
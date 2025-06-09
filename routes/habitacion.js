const express = require('express');
const router = express.Router();
const habitacionController = require('../controllers/habitacionController');

const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'Acceso denegado. Por favor, inicia sesión.');
    res.redirect('/auth/login');
};
const isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.rol === 'admin') {
        return next();
    }
    req.flash('error', 'Acceso denegado. Solo administradores.');
    res.redirect('/');
};

router.use(isAuthenticated);
router.use(isAdmin); 

router.get('/', habitacionController.listarHabitaciones);
router.get('/nuevo', habitacionController.formularioNueva);
router.post('/', habitacionController.guardarHabitacion);
router.get('/editar/:id', habitacionController.formularioEditar);
router.post('/actualizar/:id', habitacionController.actualizarHabitacion);
router.post('/eliminar/:id', habitacionController.eliminarHabitacion);

module.exports = router;
const express = require('express');
const router = express.Router();
const medicoController = require('../controllers/medicoController');

const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'Acceso denegado. Por favor, inicia sesión.');
    res.redirect('/auth/login');
};
const isAdminOrMedicoViewer = (req, res, next) => {
    if (req.isAuthenticated() && (req.user.rol === 'admin' || req.user.rol === 'medico' || req.user.rol === 'enfermero')) {
        return next();
    }
    req.flash('error', 'Acceso denegado.');
    res.redirect('/');
};
const isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.rol === 'admin') {
        return next();
    }
    req.flash('error', 'Acceso denegado. Solo administradores.');
    res.redirect('/');
};


router.get('/', isAuthenticated, isAdminOrMedicoViewer, medicoController.listarMedicos);
router.get('/nuevo', isAuthenticated, isAdmin, medicoController.formularioNueva);
router.post('/', isAuthenticated, isAdmin, medicoController.guardarMedico);
router.get('/editar/:id', isAuthenticated, isAdmin, medicoController.formularioEditar);
router.post('/actualizar/:id', isAuthenticated, isAdmin, medicoController.actualizarMedico);
router.post('/eliminar/:id', isAuthenticated, isAdmin, medicoController.eliminarMedico);

module.exports = router;
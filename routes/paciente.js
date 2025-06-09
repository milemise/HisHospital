const express = require('express');
const router = express.Router();
const pacienteController = require('../controllers/pacienteController');

const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'Acceso denegado. Por favor, inicia sesión.');
    res.redirect('/auth/login');
};
const isAuthorizedToManagePatients = (req, res, next) => {
    if (req.isAuthenticated() && (req.user.rol === 'admin' || req.user.rol === 'recepcion' || req.user.rol === 'enfermero' || req.user.rol === 'medico')) {
        return next();
    }
    req.flash('error', 'Acceso denegado.');
    res.redirect('/');
};

router.use(isAuthenticated); 
router.use(isAuthorizedToManagePatients);

router.get('/', pacienteController.listarPacientes);
router.get('/nuevo', pacienteController.formularioNueva);
router.post('/', pacienteController.guardarPaciente);
router.get('/editar/:id', pacienteController.formularioEditar);
router.post('/actualizar/:id', pacienteController.actualizarPaciente);
router.post('/eliminar/:id', pacienteController.eliminarPaciente);

module.exports = router;
const express = require('express');
const router = express.Router();
const turnosController = require('../controllers/turnoController');

const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'Acceso denegado. Por favor, inicia sesión.');
    res.redirect('/auth/login');
};
const isAuthorizedForTurnos = (req, res, next) => {
    if (req.isAuthenticated() && (req.user.rol === 'admin' || req.user.rol === 'recepcion' || req.user.rol === 'medico')) {
        return next();
    }
    req.flash('error', 'Acceso denegado.');
    res.redirect('/');
};

router.use(isAuthenticated);
router.use(isAuthorizedForTurnos);

router.get('/', turnosController.listarTurnos);
router.get('/nuevo', turnosController.formularioNueva);
router.post('/', turnosController.guardarTurno);
router.get('/editar/:id', turnosController.formularioEditar);
router.post('/actualizar/:id', turnosController.actualizarTurno);
router.post('/eliminar/:id', turnosController.eliminarTurno);

module.exports = router;
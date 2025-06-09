const express = require('express');
const router = express.Router();
const camaController = require('../controllers/camaController');

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

router.get('/', camaController.listarCamas);
router.get('/nuevo', camaController.formularioNueva);
router.post('/', camaController.guardarCama);
router.get('/editar/:id', camaController.formularioEditar);
router.post('/actualizar/:id', camaController.actualizarCama);
router.post('/eliminar/:id', camaController.eliminarCama);

module.exports = router;
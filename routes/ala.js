// routes/ala.js
const express = require('express');
const router = express.Router();
const alaController = require('../controllers/alaController');

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

router.get('/', alaController.listarAlas);
router.get('/nuevo', alaController.formularioNueva);
router.post('/', alaController.guardarAla);
router.get('/editar/:id', alaController.formularioEditar);
router.post('/actualizar/:id', alaController.actualizarAla);
router.post('/eliminar/:id', alaController.eliminarAla); 

module.exports = router;
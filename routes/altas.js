const express = require('express');
const router = express.Router();
const altasController = require('../controllers/altasController');

const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'Acceso denegado. Por favor, inicia sesión.');
    res.redirect('/auth/login');
};
const isAuthorizedForAltas = (req, res, next) => {
    if (req.isAuthenticated() && (req.user.rol === 'admin' || req.user.rol === 'medico' || req.user.rol === 'enfermero')) {
        return next();
    }
    req.flash('error', 'Acceso denegado.');
    res.redirect('/');
};

router.use(isAuthenticated);
router.use(isAuthorizedForAltas);

router.get('/', altasController.listarAltas);
router.get('/nueva/:id_admision', altasController.formularioNueva); 
router.post('/', altasController.guardarAlta);

module.exports = router;
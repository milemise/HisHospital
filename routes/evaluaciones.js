const express = require('express');
const router = express.Router();
const evaluacionesController = require('../controllers/evaluacionController'); 

const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'Acceso denegado. Por favor, inicia sesión.');
    res.redirect('/auth/login');
};
const isAuthorizedForEvaluaciones = (req, res, next) => {
    if (req.isAuthenticated() && (req.user.rol === 'admin' || req.user.rol === 'medico' || req.user.rol === 'enfermero')) {
        return next();
    }
    req.flash('error', 'Acceso denegado.');
    res.redirect('/');
};

router.use(isAuthenticated);
router.use(isAuthorizedForEvaluaciones);

router.get('/', evaluacionesController.listarEvaluaciones);
router.get('/nueva/:id_admision', evaluacionesController.formularioNueva);
router.post('/', evaluacionesController.guardarEvaluacion);

module.exports = router;
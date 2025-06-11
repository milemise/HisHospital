const express = require('express');
const router = express.Router();
const admisionesController = require('../controllers/admisionesController');

const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'Acceso denegado. Por favor, inicia sesión.');
    res.redirect('/auth/login');
};
router.use(isAuthenticated); 

router.get('/', admisionesController.listarAdmisiones);
router.get('/nueva', admisionesController.formularioNueva);
router.post('/', admisionesController.guardarAdmision); 

// CAMBIOS CLAVE AQUÍ: usar :id_admision
router.get('/editar/:id_admision', admisionesController.formularioEditar);
router.post('/actualizar/:id_admision', admisionesController.actualizarAdmision);
router.post('/cancelar/:id_admision', admisionesController.cancelarAdmision); 
router.get('/dar-alta/:id_admision', admisionesController.darAlta); 
router.get('/detalles/:id_admision', admisionesController.verDetalles); 

module.exports = router;
const express = require('express');
const router = express.Router();
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'Por favor, inicia sesión para acceder.');
    res.redirect('/auth/login');
};

router.get('/', isAuthenticated, (req, res) => {
    res.render('inicio', { title: 'Sistema HIS - Inicio' }); 
});

router.get('/error', (req, res) => {
    res.render('error', { title: 'Error', message: 'Ha ocurrido un error inesperado.' });
});

module.exports = router;
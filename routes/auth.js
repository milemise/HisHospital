const express = require('express');
const router = express.Router();
const passport = require('passport'); 
router.get('/login', (req, res) => {
    res.render('auth/login', {
        title: 'Iniciar Sesión',
        error: req.flash('error')
    });
});

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/github/callback',
    passport.authenticate('github', {
        failureRedirect: '/auth/login',
        failureFlash: true
    }),
    (req, res) => {
        
        req.flash('success', `Bienvenido, ${req.user.nombre || req.user.email}!`);
        res.redirect('/');
    }
);

router.get('/logout', (req, res) => {
    req.logout((err) => { 
        if (err) {
            console.error('Error al cerrar sesión:', err);
            return res.redirect('/');
        }
        req.session.destroy((err) => {
            if (err) {
                console.error('Error al destruir la sesión:', err);
                return res.redirect('/');
            }
            res.clearCookie('connect.sid'); 
            req.flash('success', 'Has cerrado sesión correctamente.');
            res.redirect('/auth/login');
        });
    });
});

module.exports = router;
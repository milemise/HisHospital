exports.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'Necesitas iniciar sesión para acceder a esta página.');
    res.redirect('/auth/login');
};

exports.isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user && req.user.rol === 'admin') {
        return next();
    }
    req.flash('error', 'Acceso denegado. Solo administradores pueden acceder a esta sección.');
    res.redirect('/');
};

exports.isMedico = (req, res, next) => {
    if (req.isAuthenticated() && req.user && req.user.rol === 'medico') {
        return next();
    }
    req.flash('error', 'Acceso denegado. Se requiere rol de médico.');
    res.redirect('/');
};

exports.isEnfermero = (req, res, next) => {
    if (req.isAuthenticated() && req.user && req.user.rol === 'enfermero') {
        return next();
    }
    req.flash('error', 'Acceso denegado. Se requiere rol de enfermero.');
    res.redirect('/');
};

exports.isRecepcion = (req, res, next) => {
    if (req.isAuthenticated() && req.user && req.user.rol === 'recepcion') {
        return next();
    }
    req.flash('error', 'Acceso denegado. Se requiere rol de recepcionista.');
    res.redirect('/');
};
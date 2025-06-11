require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const path = require('path');
const flash = require('connect-flash');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { sequelize, Medico, Usuario } = require('./models');
const app = express();
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'", "https://cdnjs.cloudflare.com"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
}));
app.use('/api/', rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Demasiadas peticiones desde esta IP, por favor inténtalo de nuevo después de 15 minutos.'
}));
(async () => {
    try {
        await sequelize.authenticate();
        console.log('🟢 Conexión a la DB establecida correctamente.');
        //await sequelize.sync({ alter: true });
        console.log('🟢 Modelos de la DB sincronizados.');
    } catch (error) {
        console.error('🔴 Error de conexión o sincronización a la DB:', error);
        process.exit(1);
    }
})();
require('./config/passport');
app.use(session({
    secret: process.env.SESSION_SECRET || "unaFraseSecretaMuyLargaYComplejaParaTuAppHIS!",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    res.locals.isAuthenticated = req.isAuthenticated && req.isAuthenticated();
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const medicoRouter = require('./routes/medico');
const pacienteRouter = require('./routes/paciente');
const alaRouter = require('./routes/ala');
const camaRouter = require('./routes/cama');
const habitacionRouter = require('./routes/habitacion');
const admisionesRouter = require('./routes/admisiones');
const altasRouter = require('./routes/altas');
const evaluacionesRouter = require('./routes/evaluaciones');
const turnosRouter = require('./routes/turnos');
const usuariosRouter = require('./routes/usuarios');
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/medicos', medicoRouter);
app.use('/pacientes', pacienteRouter);
app.use('/alas', alaRouter);
app.use('/camas', camaRouter);
app.use('/habitaciones', habitacionRouter);
app.use('/admisiones', admisionesRouter);
app.use('/altas', altasRouter);
app.use('/evaluaciones', evaluacionesRouter);
app.use('/turnos', turnosRouter);
app.use('/usuarios', usuariosRouter);
function ensureAuthenticated(req, res, next) {
    return next();
}
app.use((req, res, next) => {
    next();
});
app.use((err, req, res, next) => {
    res.locals.message = err.message;
    const isDevelopment = (process.env.NODE_ENV === 'development' || req.app.get('env') === 'development');
    res.locals.error = isDevelopment ? err : {};
    res.status(err.status || 500);
    res.render('error', {
        title: 'Error',
        status: err.status || 500,
        message: err.message,
        error: res.locals.error,
        isDevelopment: isDevelopment
    });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
    console.log(`Entorno: ${process.env.NODE_ENV || 'development'}`);
});
module.exports = app;
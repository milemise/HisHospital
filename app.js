require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const path = require('path');
const flash = require('connect-flash');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
<<<<<<< HEAD
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
=======
const ConnectSessionSequelize = require('connect-session-sequelize');
const { sequelize } = require('./models');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

>>>>>>> aa8027501b4c073def9c20a08ba1531f326b1aa0
app.use('/api/', rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Demasiadas peticiones desde esta IP.'
}));
(async () => {
    try {
        await sequelize.authenticate();
        console.log('🟢 Conexión a la DB establecida correctamente.');
<<<<<<< HEAD
        // await sequelize.sync({ alter: true });
        // console.log('🟢 Modelos de la DB sincronizados.');
=======
        await sequelize.sync({ alter: true });
        console.log('🟢 Modelos de la DB sincronizados.');
>>>>>>> aa8027501b4c073def9c20a08ba1531f326b1aa0
    } catch (error) {
        console.error('🔴 Error de conexión o sincronización a la DB:', error);
        process.exit(1);
    }
})();
<<<<<<< HEAD
require('./config/passport');
=======

const MySessionStore = ConnectSessionSequelize(session.Store);
const sessionStore = new MySessionStore({
    db: sequelize,
    checkExpirationInterval: 15 * 60 * 1000,
    expiration: 24 * 60 * 60 * 1000
});

>>>>>>> aa8027501b4c073def9c20a08ba1531f326b1aa0
app.use(session({
    secret: process.env.SESSION_SECRET || "unaFraseSecretaMuyLargaYComplejaParaTuAppHIS!",
    resave: false,
    saveUninitialized: false,
<<<<<<< HEAD
=======
    store: sessionStore,
>>>>>>> aa8027501b4c073def9c20a08ba1531f326b1aa0
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}));
<<<<<<< HEAD
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
=======

require('./config/passport');
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

>>>>>>> aa8027501b4c073def9c20a08ba1531f326b1aa0
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    res.locals.isAuthenticated = req.isAuthenticated ? req.isAuthenticated() : false;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});
<<<<<<< HEAD
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
=======

console.log('📝 Montando rutas...');

function mountRouter(path, routerFile) {
    try {
        const router = require(routerFile);
        if (typeof router !== 'function') {
            throw new Error(`El archivo de rutas '${routerFile}' no exportó un router válido. ¿Olvidaste 'module.exports = router;' al final?`);
        }
        app.use(path, router);
        console.log(`✅ Ruta montada: ${path} -> ${routerFile}`);
    } catch (error) {
        console.error(`💥 ERROR CRÍTICO al montar la ruta para '${path}' desde '${routerFile}':`);
        throw error;
    }
}

const routes = [
    { path: '/', file: './routes/index' },
    { path: '/auth', file: './routes/auth' },
    { path: '/medicos', file: './routes/medico' },
    { path: '/pacientes', file: './routes/paciente' },
    { path: '/alas', file: './routes/ala' },
    { path: '/camas', file: './routes/cama' },
    { path: '/habitaciones', file: './routes/habitacion' },
    { path: '/admisiones', file: './routes/admisiones' },
    { path: '/altas', file: './routes/altas' },
    { path: '/evaluaciones', file: './routes/evaluaciones' },
    { path: '/turnos', file: './routes/turnos' },
    { path: '/usuarios', file: './routes/usuarios' }
];

try {
    routes.forEach(route => {
        mountRouter(route.path, route.file);
    });
    console.log('👍 Todas las rutas se han montado correctamente.');
} catch (error) {
    console.error("⛔ La aplicación no pudo iniciar debido a un error en el montaje de rutas.");
    process.exit(1);
}

>>>>>>> aa8027501b4c073def9c20a08ba1531f326b1aa0
app.use((req, res, next) => {
    const err = new Error('Página no encontrada');
    err.status = 404;
    next(err);
});
app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error', { title: 'Error', status: err.status || 500, message: err.message });
});
<<<<<<< HEAD
=======

>>>>>>> aa8027501b4c073def9c20a08ba1531f326b1aa0
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor iniciado en http://localhost:${PORT}`);
    console.log(`  Entorno: ${process.env.NODE_ENV || 'development'}`);
});
module.exports = app;
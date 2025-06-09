require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');


const path = require('path');
const flash = require('connect-flash');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const ConnectSessionSequelize = require('connect-session-sequelize');
const { sequelize } = require('./models');

const app = express();

app.use(helmet());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/', rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Demasiadas peticiones desde esta IP.'
}));

(async () => {
    try {
        await sequelize.authenticate();
        console.log('🟢 Conexión a la DB establecida correctamente.');

        await sequelize.sync({ alter: true });
        console.log('🟢 Modelos de la DB sincronizados.');
    } catch (error) {
        console.error('🔴 Error de conexión o sincronización a la DB:', error);

        process.exit(1);
    }
})();

const MySessionStore = ConnectSessionSequelize(session.Store);
const sessionStore = new MySessionStore({
    db: sequelize,
    checkExpirationInterval: 15 * 60 * 1000,
    expiration: 24 * 60 * 60 * 1000
});

app.use(session({
    secret: process.env.SESSION_SECRET || "unaFraseSecretaMuyLargaYComplejaParaTuAppHIS!",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}));

require('./config/passport');
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use((req, res, next) => {

    res.locals.user = req.user || null;
    res.locals.isAuthenticated = req.isAuthenticated ? req.isAuthenticated() : false;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

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
    { path: '/usuarios', file: './routes/usuarios' }];

try {
    routes.forEach(route => {
        mountRouter(route.path, route.file);
    });
    console.log('👍 Todas las rutas se han montado correctamente.');
} catch (error) {
    console.error("⛔ La aplicación no pudo iniciar debido a un error en el montaje de rutas.");
    process.exit(1);
}

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor iniciado en http://localhost:${PORT}`);
    console.log(`  Entorno: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
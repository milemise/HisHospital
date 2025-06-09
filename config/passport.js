const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const bcrypt = require('bcryptjs');
require('dotenv').config();

const { Usuario, Medico } = require('../models');

passport.use(new LocalStrategy({
    usernameField: 'email', 
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const usuario = await Usuario.findOne({
            where: { email: email } 
        });

        if (!usuario) {
            return done(null, false, { message: 'Email o contraseña incorrectos.' });
        }

        const match = await bcrypt.compare(password, usuario.password_hash); 
        if (!match) {
            return done(null, false, { message: 'Email o contraseña incorrectos.' });
        }

        return done(null, usuario);
    } catch (error) {
        console.error('Error en LocalStrategy:', error);
        return done(error); 
    }
}));

if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL,
        scope: ['user:email']
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            if (!profile.emails || profile.emails.length === 0 || !profile.emails[0].value) {
                return done(null, false, { message: 'No se pudo obtener el email de GitHub. Asegúrate de tener un email público o verificado.' });
            }
            const githubEmail = profile.emails[0].value;

            let usuario = await Usuario.findOne({
                where: {
                    [require('sequelize').Op.or]: [ 
                        { githubId: profile.id },
                        { email: githubEmail }
                    ]
                }
            });

            if (!usuario) {

                usuario = await Usuario.create({
                    githubId: profile.id.toString(), 
                    email: githubEmail,
                    nombre_usuario: profile.displayName || profile.username || githubEmail, 
                    password_hash: bcrypt.hashSync(Math.random().toString(36).substring(7), 10),
                    rol: 'medico', 
                    created_at: new Date(),
                    updated_at: new Date()
                });

                try {
                    await Medico.create({
                        nombre: profile.displayName || profile.username,
                        apellido: profile.profileUrl ? profile.profileUrl.split('/').pop() : '',
                        id_especialidad: 1, 
                        matricula: profile.id.toString(),
                        telefono: '',
                        email: githubEmail,
                        activo: true,
                        id_usuario: usuario.id_usuario
                    });
                } catch (medicoError) {
                    console.error("Error al crear perfil de médico para usuario GitHub:", medicoError);
                 
                    return done(medicoError);
                }

            } else if (usuario.githubId === null) {
               
                await usuario.update({ githubId: profile.id.toString() });
            }
            return done(null, usuario);
        } catch (error) {
            console.error('Error en GitHubStrategy:', error);
            return done(error);
        }
    }));
} else {
    console.warn('Advertencia: GITHUB_CLIENT_ID o GITHUB_CLIENT_SECRET no están configurados. La estrategia de GitHub no será utilizada.');
}

passport.serializeUser((user, done) => {
    done(null, user.id_usuario);
});
passport.deserializeUser(async (id, done) => {
    try {
        const user = await Usuario.findByPk(id, {
            include: [{ model: Medico, as: 'medico' }] 
        });
        done(null, user);
    } catch (error) {
        console.error('Error en deserializeUser:', error);
        done(error);
    }
});
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const { Usuario } = require('../models');

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  async (email, password, done) => {
    try {
      console.log('Intento de login para email:', email);
      const user = await Usuario.findOne({ where: { email: email } });
      
      console.log('Objeto de usuario recuperado de DB:', user);

      if (user) {
        console.log('Propiedad user.password_hash:', user.password_hash);
        console.log('Tipo de user.password_hash:', typeof user.password_hash);
        console.log('¿Es user.password_hash un valor falsy (null/undefined/vacío)?', !user.password_hash);
      } else {
        console.log('Usuario NO encontrado en la base de datos para este email.');
      }

      if (!user) {
        return done(null, false, { message: 'Email no registrado.' });
      }

      const isMatch = await bcrypt.compare(password, user.password_hash); 

      if (!isMatch) {
        return done(null, false, { message: 'Contraseña incorrecta.' });
      }

      return done(null, user);
    } catch (err) {
      console.error('Error en estrategia LocalStrategy:', err);
      return done(err);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id_usuario);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await Usuario.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});
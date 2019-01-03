const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('../database');
const helpers = require('../lib/helpers');

passport.use('local.conectarse', new LocalStrategy({
    usernameFiel: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    
    const usuarios = await pool.query('SELECT * FROM users WHERE username = ?', [username]);

    if(usuarios.length > 0) {

        const usuario = usuarios[0];
        const passwordValido = await helpers.comparePassword(password, usuario.password);

        if(passwordValido){
            // Todo correcto
            done(null, usuario, req.flash('success', '¡Bienvenido ' + usuario.username + '!'));
        }else{
            // Falló el password
            done(null, false, req.flash('message', 'Datos incorrectos'));
        }
    }else{
        // Falló el username
        return done(null, false, req.flash('message', 'Datos incorrectos'));
    }
    
}));

passport.use('local.registrarse', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    const nuevoUsuario = {
        username: username,
        password: password,
        fullname: req.body.fullname
    };

    nuevoUsuario.password = await helpers.encryptPassword(password);

    const result = await pool.query('INSERT INTO users SET ?', [nuevoUsuario]);

    nuevoUsuario.id = result.insertId;

    return done(null, nuevoUsuario);

}));

passport.serializeUser((usuario, done) => {
    done(null, usuario.id);
});

passport.deserializeUser( async (id, done) => {
    const usuarios = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    done(null, usuarios[0]);
});

module.exports = passport;

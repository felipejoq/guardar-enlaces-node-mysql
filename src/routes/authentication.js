const express = require('express');
const router = express.Router();

const passport = require('passport');

const { estaConectado, noEstaLogeado } = require('../lib/auth');

router.get('/registrarse', (req, res) => {
    res.render('auth/registrarse');
});

router.post('/registrarse', noEstaLogeado, passport.authenticate('local.registrarse', {
    successRedirect: '/profile',
    failureRedirect: '/registrarse',
    failureFlash: true
}));

// router.post('/registrarse', (req, res) => {
//     passport.authenticate('local.registrarse', {
        // successRedirect: '/profile',
        // failureRedirect: '/registrarse',
        // failureFlash: true
//     });
//     res.send('Intentas registrarse.')
// });

router.get('/conectarse', noEstaLogeado, (req, res) => {
    res.render('auth/conectarse');
});

router.post('/conectarse', (req, res, next) => {
    passport.authenticate('local.conectarse', {
        successRedirect: '/profile',
        failureRedirect: '/conectarse',
        failureFlash: true
    })(req, res, next);
});

router.get('/profile', estaConectado, (req, res) => {
    res.render('profile');
});

router.get('/salir', (req, res) => {
    req.logOut();
    res.redirect('/conectarse');
});

module.exports = router;
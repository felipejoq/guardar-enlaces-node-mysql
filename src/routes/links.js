const express = require('express');
const router = express.Router();

// Conexión a la DB
const pool = require('../database');

const { estaConectado } = require('../lib/auth');

router.get('/', estaConectado, async (req, res) => {
    const enlaces = await pool.query('SELECT * FROM links WHERE user_id = ?', [req.user.id]);
    res.render('links/list', {enlaces});
});

router.get('/add', estaConectado, (req, res) => {
    res.render('links/add');
});

router.post('/add', estaConectado, async (req, res) => {
    
    const { title, url, description } = req.body;

    const nuevoLink = {
        title,
        url,
        description,
        user_id: req.user.id
    };

    await pool.query('INSERT INTO links set ?', [nuevoLink]);

    req.flash('success', 'El enlace fue guardado.');

    res.redirect('/links')
});

router.post('/edit/:id', estaConectado, async (req, res) => {
    const { id } = req.params;

    const { title, description, url } = req.body;

    const editLink = {
        title,
        description,
        url
    };

    await pool.query('UPDATE links set ? WHERE id = ?', [ editLink, id ]);

    req.flash('success', 'Enlace actualizado con éxito.');

    res.redirect('/links');

});

router.get('/delete/:id', estaConectado, async (req, res) => {
    console.log(req.params.id);

    const { id } = req.params;

    await pool.query('DELETE FROM links WHERE id = ?', [id]);

    req.flash('success', 'Enlace eliminado con éxito.');

    res.redirect('/links')

});

router.get('/edit/:id', estaConectado, async (req, res) => {
    const { id } = req.params;

    const enlaces = await pool.query('SELECT * FROM links WHERE id = ?', [id]);

    res.render('links/edit', { enlace: enlaces[0] });
});

module.exports = router;
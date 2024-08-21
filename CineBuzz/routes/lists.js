const express = require('express');
const router = express.Router();
const pool = require('../db');

// Route to create a new list
router.post('/', async (req, res) => {
    const { topic, description } = req.body;
    if (!req.session.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
        const result = await pool.query(
            'INSERT INTO lists (userid, topic, description) VALUES ($1, $2, $3) RETURNING *',
            [req.session.user.id, topic, description]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Route to get all lists for a user
router.get('/', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
        const result = await pool.query(
            'SELECT * FROM lists WHERE userid = $1',
            [req.session.user.id]
        );
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Route to add a movie to a list
router.post('/:listId/movies', async (req, res) => {
    const { listId } = req.params;
    const { movieName } = req.body;
    if (!req.session.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
        const result = await pool.query(
            'INSERT INTO list_movies (listid, userid, username, moviename) VALUES ($1, $2, $3, $4) RETURNING *',
            [listId, req.session.user.id, req.session.user.username, movieName]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Route to get all movies in a list
router.get('/:listId/movies', async (req, res) => {
    const { listId } = req.params;
    if (!req.session.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
        const result = await pool.query(
            'SELECT * FROM list_movies WHERE listid = $1',
            [listId]
        );
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Route to get a specific list
router.get('/:listId', async (req, res) => {
    const { listId } = req.params;
    if (!req.session.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
        const result = await pool.query(
            'SELECT * FROM lists WHERE listid = $1',
            [listId]
        );
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

module.exports = router;

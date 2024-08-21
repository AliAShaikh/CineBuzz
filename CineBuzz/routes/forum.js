const express = require('express');
const router = express.Router();
const pool = require('../db');

// Route to create a new forum
router.post('/', async (req, res) => {
  const { title, description } = req.body;
  if (!req.session.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO forums (title, description, userid) VALUES ($1, $2, $3) RETURNING *',
      [title, description, req.session.user.id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Route to get all forums
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM forums');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Route to get comments for a forum
router.get('/:articleNo/comments', async (req, res) => {
  const { articleNo } = req.params;
  try {
    const result = await pool.query('SELECT * FROM comments WHERE articleno = $1', [articleNo]);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Route to add a comment to a forum
router.post('/:articleNo/comments', async (req, res) => {
  const { articleNo } = req.params;
  const { comment } = req.body;
  if (!req.session.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO comments (articleno, userid, username, comment) VALUES ($1, $2, $3, $4) RETURNING *',
      [articleNo, req.session.user.id, req.session.user.username, comment]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Route to get a specific forum
router.get('/:articleNo', async (req, res) => {
  const { articleNo } = req.params;
  try {
    const result = await pool.query('SELECT * FROM forums WHERE articleno = $1', [articleNo]);
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const pool = require('../db');

// Route to add a new user
router.post('/add', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
      [username, email, password]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Route to log in a user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, password]);
    const user = result.rows[0];

    if (user) {
      req.session.user = {
        id: user.id,
        username: user.username
      };
      res.status(200).json({ message: 'Login successful' });
    } else {
      res.status(401).json({ error: 'Invalid email or password' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Route to log out a user
router.post('/logout', (req, res) => {
  if (req.session.user) {
    req.session.destroy(err => {
      if (err) {
        return res.status(500).json({ error: 'Failed to logout' });
      }
      res.status(200).json({ message: 'Logout successful' });
    });
  } else {
    res.status(400).json({ error: 'No user is currently logged in' });
  }
});

module.exports = router;

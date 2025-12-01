import express from 'express';
import db from '../database.js';

const router = express.Router();

// Subscribe to newsletter
router.post('/subscribe', (req, res) => {
  const { email } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ message: 'Valid email is required' });
  }

  // Create table if not exists
  db.run(`CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    active INTEGER DEFAULT 1
  )`, (err) => {
    if (err) console.error('Table creation error:', err);
  });

  const query = 'INSERT INTO newsletter_subscribers (email) VALUES (?)';
  
  db.run(query, [email.toLowerCase()], function(err) {
    if (err) {
      if (err.message.includes('UNIQUE')) {
        return res.status(400).json({ message: 'Email already subscribed' });
      }
      return res.status(500).json({ message: 'Failed to subscribe' });
    }
    res.json({ message: 'Successfully subscribed to newsletter!' });
  });
});

// Unsubscribe from newsletter
router.post('/unsubscribe', (req, res) => {
  const { email } = req.body;

  const query = 'UPDATE newsletter_subscribers SET active = 0 WHERE email = ?';
  
  db.run(query, [email.toLowerCase()], function(err) {
    if (err) {
      return res.status(500).json({ message: 'Failed to unsubscribe' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Email not found' });
    }
    res.json({ message: 'Successfully unsubscribed' });
  });
});

// Get all subscribers (admin only)
router.get('/', (req, res) => {
  const query = 'SELECT email, subscribed_at FROM newsletter_subscribers WHERE active = 1 ORDER BY subscribed_at DESC';
  
  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to fetch subscribers' });
    }
    res.json(rows);
  });
});

export default router;

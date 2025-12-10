import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../database.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key'; // Fallback for dev only

router.post('/login', [
  body('username').isString().trim().notEmpty(),
  body('password').isString().notEmpty()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;

  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role, email: user.email }, 
      SECRET_KEY, 
      { expiresIn: '24h' }
    );
    res.json({ 
      token, 
      user: { 
        id: user.id, 
        username: user.username, 
        role: user.role,
        email: user.email,
        loyalty_points: user.loyalty_points 
      } 
    });
  });
});

// Registration Disabled
/*
router.post('/register', [
  body('username').isString().trim().notEmpty(),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 })
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password } = req.body;
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  db.run(
    'INSERT INTO users (username, email, password, loyalty_points) VALUES (?, ?, ?, 0)',
    [username, email, hash],
    function(err) {
      if (err) {
        if (err.message.includes('UNIQUE')) {
          return res.status(400).json({ error: 'Username or email already exists' });
        }
        return res.status(500).json({ error: err.message });
      }

      const userId = this.lastID;
      const token = jwt.sign(
        { id: userId, username, role: 'user', email }, 
        SECRET_KEY, 
        { expiresIn: '24h' }
      );

      res.status(201).json({
        token,
        user: { id: userId, username, email, role: 'user', loyalty_points: 0 }
      });
    }
  );
});
*/

export default router;

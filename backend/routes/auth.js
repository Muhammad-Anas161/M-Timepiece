import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';

const router = express.Router();
// Secret loaded dynamically at runtime

router.post('/login', [
  body('username').isString().trim().notEmpty(),
  body('password').isString().notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role, email: user.email }, 
      process.env.JWT_SECRET || 'm_timepiece_dev_secret_2024', 
      { expiresIn: '24h' }
    );
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        username: user.username, 
        role: user.role,
        email: user.email,
        loyalty_points: user.loyalty_points 
      } 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
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

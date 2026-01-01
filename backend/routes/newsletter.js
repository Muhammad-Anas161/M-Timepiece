import express from 'express';
import Newsletter from '../models/Newsletter.js';

const router = express.Router();

// Subscribe to newsletter
router.post('/subscribe', async (req, res) => {
  const { email } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ message: 'Valid email is required' });
  }

  try {
    const subscriber = new Newsletter({ email: email.toLowerCase() });
    await subscriber.save();
    res.json({ message: 'Successfully subscribed to newsletter!' });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Email already subscribed' });
    }
    res.status(500).json({ message: 'Failed to subscribe', error: err.message });
  }
});

// Unsubscribe from newsletter
router.post('/unsubscribe', async (req, res) => {
  const { email } = req.body;

  try {
    const subscriber = await Newsletter.findOneAndUpdate(
      { email: email.toLowerCase() },
      { active: false },
      { new: true }
    );
    if (!subscriber) return res.status(404).json({ message: 'Email not found' });
    res.json({ message: 'Successfully unsubscribed' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to unsubscribe', error: err.message });
  }
});

// Get all subscribers (admin only)
router.get('/', async (req, res) => {
  try {
    const subscribers = await Newsletter.find({ active: true }).sort({ subscribed_at: -1 });
    res.json(subscribers);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch subscribers', error: err.message });
  }
});

export default router;

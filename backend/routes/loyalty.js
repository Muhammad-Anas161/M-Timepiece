import express from 'express';
import User from '../models/User.js';
import LoyaltyHistory from '../models/LoyaltyHistory.js';
import Coupon from '../models/Coupon.js';
import mongoose from 'mongoose';

import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Get user points and history
router.get('/', verifyToken, async (req, res) => {
  const userId = req.query.userId;
  if (!userId) return res.status(400).json({ message: 'User ID required' });

  // Security check: Only allow users to access their own data unless they are admin
  if (req.userId !== userId && req.userRole !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: You can only access your own data' });
  }

  try {
    const user = await User.findById(userId).select('loyalty_points');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const history = await LoyaltyHistory.find({ user_id: userId }).sort({ created_at: -1 });
    
    res.json({ points: user.loyalty_points, history });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching loyalty data', error: err.message });
  }
});

// Redeem points for a coupon
router.post('/redeem', verifyToken, async (req, res) => {
  const { userId, pointsToRedeem } = req.body;
  
  if (!userId || !pointsToRedeem) {
    return res.status(400).json({ message: 'User ID and points required' });
  }

  // Security check: Only allow users to redeem their own points
  if (req.userId !== userId) {
    return res.status(403).json({ message: 'Forbidden: You can only redeem your own points' });
  }

  if (pointsToRedeem < 100) {
    return res.status(400).json({ message: 'Minimum redemption is 100 points' });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await User.findById(userId).session(session);
    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.loyalty_points < pointsToRedeem) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'Insufficient points' });
    }

    const discountAmount = pointsToRedeem; 
    const code = `LOYALTY-${Date.now().toString().slice(-6)}`;

    // Deduct points
    user.loyalty_points -= pointsToRedeem;
    await user.save({ session });

    // Log history
    const history = new LoyaltyHistory({
      user_id: userId,
      points: -pointsToRedeem,
      type: 'redeemed',
      description: `Redeemed for PKR ${discountAmount} coupon`
    });
    await history.save({ session });

    // Create coupon
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 30);

    const coupon = new Coupon({
      code,
      discount_type: 'fixed',
      discount_value: discountAmount,
      usage_limit: 1,
      valid_until: validUntil,
      active: true
    });
    await coupon.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.json({ 
      message: 'Points redeemed successfully', 
      coupon: { code, amount: discountAmount } 
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: 'Redemption failed', error: err.message });
  }
});

export default router;

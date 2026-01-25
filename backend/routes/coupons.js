import express from 'express';
import Coupon from '../models/Coupon.js';

import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Table creation handled in database.js

// Validate and apply coupon
router.post('/validate', async (req, res) => {
  const { code, orderTotal } = req.body;

  if (!code || !orderTotal) {
    return res.status(400).json({ message: 'Code and order total are required' });
  }

  try {
    const now = new Date();
    const coupon = await Coupon.findOne({
      code: { $regex: new RegExp(`^${code}$`, 'i') },
      active: true,
      $or: [
        { valid_until: { $exists: false } },
        { valid_until: null },
        { valid_until: { $gte: now } }
      ]
    });

    if (!coupon) {
      return res.status(404).json({ message: 'Invalid or expired coupon code' });
    }

    if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
      return res.status(404).json({ message: 'Coupon usage limit reached' });
    }

    // Check minimum purchase
    if (coupon.min_purchase && orderTotal < coupon.min_purchase) {
      return res.status(400).json({ 
        message: `Minimum purchase of PKR ${coupon.min_purchase} required` 
      });
    }

    // Calculate discount
    let discount = 0;
    if (coupon.discount_type === 'percentage') {
      discount = (orderTotal * coupon.discount_value) / 100;
      if (coupon.max_discount && discount > coupon.max_discount) {
        discount = coupon.max_discount;
      }
    } else {
      discount = coupon.discount_value;
    }

    res.json({
      valid: true,
      coupon: {
        code: coupon.code,
        discount_type: coupon.discount_type,
        discount_value: coupon.discount_value,
        discount_amount: discount
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Error validating coupon', error: err.message });
  }
});

// Increment coupon usage (called after order creation)
router.post('/use', async (req, res) => {
  const { code } = req.body;

  try {
    await Coupon.updateOne(
      { code: { $regex: new RegExp(`^${code}$`, 'i') } },
      { $inc: { used_count: 1 } }
    );
    res.json({ message: 'Coupon usage recorded' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating coupon usage', error: err.message });
  }
});

// Get all coupons (admin)
router.get('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ created_at: -1 });
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching coupons', error: err.message });
  }
});

// Create coupon (admin)
router.post('/', verifyToken, isAdmin, async (req, res) => {
  const { 
    code, discount_type, discount_value, min_purchase, 
    max_discount, usage_limit, valid_until 
  } = req.body;

  if (!code || !discount_type || !discount_value) {
    return res.status(400).json({ message: 'Code, type, and value are required' });
  }

  try {
    const coupon = new Coupon({
      code: code.toUpperCase(),
      discount_type,
      discount_value,
      min_purchase: min_purchase || 0,
      max_discount,
      usage_limit,
      valid_until
    });

    await coupon.save();
    res.status(201).json({ message: 'Coupon created successfully', id: coupon._id });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Coupon code already exists' });
    }
    res.status(500).json({ message: 'Error creating coupon', error: err.message });
  }
});

// Delete coupon (admin)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
    res.json({ message: 'Coupon deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting coupon', error: err.message });
  }
});

// Toggle coupon active status (admin)
router.patch('/:id/toggle', verifyToken, isAdmin, async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
    
    coupon.active = !coupon.active;
    await coupon.save();
    
    res.json({ message: 'Coupon status updated', active: coupon.active });
  } catch (err) {
    res.status(500).json({ message: 'Error updating coupon', error: err.message });
  }
});

export default router;

import express from 'express';
import db from '../database.js';

const router = express.Router();

// Table creation handled in database.js

// Validate and apply coupon
router.post('/validate', (req, res) => {
  const { code, orderTotal } = req.body;

  if (!code || !orderTotal) {
    return res.status(400).json({ message: 'Code and order total are required' });
  }

  const query = `
    SELECT * FROM coupons 
    WHERE UPPER(code) = UPPER(?) 
    AND active = 1 
    AND (valid_until IS NULL OR datetime(valid_until) >= datetime('now'))
    AND (usage_limit IS NULL OR used_count < usage_limit)
  `;

  db.get(query, [code], (err, coupon) => {
    if (err) {
      return res.status(500).json({ message: 'Error validating coupon' });
    }

    if (!coupon) {
      return res.status(404).json({ message: 'Invalid or expired coupon code' });
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
  });
});

// Increment coupon usage (called after order creation)
router.post('/use', (req, res) => {
  const { code } = req.body;

  db.run(
    'UPDATE coupons SET used_count = used_count + 1 WHERE UPPER(code) = UPPER(?)',
    [code],
    function(err) {
      if (err) {
        return res.status(500).json({ message: 'Error updating coupon usage' });
      }
      res.json({ message: 'Coupon usage recorded' });
    }
  );
});

// Get all coupons (admin)
router.get('/', (req, res) => {
  db.all('SELECT * FROM coupons ORDER BY created_at DESC', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching coupons' });
    }
    res.json(rows);
  });
});

// Create coupon (admin)
router.post('/', (req, res) => {
  const { 
    code, discount_type, discount_value, min_purchase, 
    max_discount, usage_limit, valid_until 
  } = req.body;

  if (!code || !discount_type || !discount_value) {
    return res.status(400).json({ message: 'Code, type, and value are required' });
  }

  const query = `
    INSERT INTO coupons (code, discount_type, discount_value, min_purchase, max_discount, usage_limit, valid_until)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(
    query,
    [code.toUpperCase(), discount_type, discount_value, min_purchase || 0, max_discount, usage_limit, valid_until],
    function(err) {
      if (err) {
        if (err.message.includes('UNIQUE')) {
          return res.status(400).json({ message: 'Coupon code already exists' });
        }
        return res.status(500).json({ message: 'Error creating coupon' });
      }
      res.status(201).json({ message: 'Coupon created successfully', id: this.lastID });
    }
  );
});

// Delete coupon (admin)
router.delete('/:id', (req, res) => {
  db.run('DELETE FROM coupons WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      return res.status(500).json({ message: 'Error deleting coupon' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    res.json({ message: 'Coupon deleted successfully' });
  });
});

// Toggle coupon active status (admin)
router.patch('/:id/toggle', (req, res) => {
  db.run(
    'UPDATE coupons SET active = NOT active WHERE id = ?',
    [req.params.id],
    function(err) {
      if (err) {
        return res.status(500).json({ message: 'Error updating coupon' });
      }
      res.json({ message: 'Coupon status updated' });
    }
  );
});

export default router;

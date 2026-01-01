import express from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import LoyaltyHistory from '../models/LoyaltyHistory.js';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const router = express.Router();
const SECRET_KEY = 'your-secret-key'; // Must match auth.js

const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Create Order (Public)
router.post('/', async (req, res) => {
  const { customer, address, items, total, coupon } = req.body;
  
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const orderNumber = `WJ-${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;

    // Map items to Mongoose schema
    const orderItems = items.map(item => ({
      product_id: item.id,
      quantity: item.quantity,
      price: item.price,
      variant_id: item.variantId || null,
      variant_info: item.selectedColor || null
    }));

    const order = new Order({
      customer_name: customer.name,
      customer_email: customer.email,
      address: address.street,
      city: address.city,
      zip: address.zip,
      total,
      payment_method: customer.paymentMethod || 'COD/WhatsApp',
      order_number: orderNumber,
      items: orderItems
    });

    await order.save({ session });

    // Stock management
    for (const item of items) {
      if (item.variantId) {
        // Find product and update variant stock
        // Note: For now, we assume variantId is the index or some identifier in the variants array
        // In Mongoose, we should probably find by order.items.product_id and then update subdocument
        await Product.updateOne(
          { _id: item.id, "variants._id": item.variantId },
          { $inc: { "variants.$.stock": -item.quantity } },
          { session }
        );
      }
    }

    // Award loyalty points
    if (customer.userId) {
      const pointsEarned = Math.floor(total / 100);
      await User.findByIdAndUpdate(customer.userId, { $inc: { loyalty_points: pointsEarned } }, { session });
      
      const loyalty = new LoyaltyHistory({
        user_id: customer.userId,
        points: pointsEarned,
        type: 'earned',
        description: `Order #${orderNumber}`
      });
      await loyalty.save({ session });
    }

    await session.commitTransaction();
    session.endSession();

    // Async tasks
    import('../services/googleSheets.js').then(({ appendOrderToSheet }) => {
      appendOrderToSheet({
        orderId: order._id,
        customerName: customer.name,
        customerEmail: customer.email,
        items: items.map(i => i.name).join(', '),
        total
      });
    }).catch(err => console.error('Failed to load Google Sheets service', err));

    import('../services/email.js').then(({ sendOrderEmail }) => {
      sendOrderEmail({ id: order._id, total, orderNumber }, customer, items);
    }).catch(err => console.error('Failed to load Email service', err));

    res.json({ id: order._id, orderNumber, message: 'Order created successfully' });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ error: err.message });
  }
});

// Get Orders (Protected)
router.get('/', authenticate, async (req, res) => {
  try {
    const orders = await Order.find().sort({ created_at: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Order Status (Protected)
router.patch('/:id/status', authenticate, async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  
  const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  
  try {
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json({ message: 'Order status updated', status: order.status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Track Order (Public) - Fetch by order_number
router.get('/track/:orderNumber', async (req, res) => {
  const { orderNumber } = req.params;
  
  try {
    // Try finding by order_number first, then by _id if it's a valid ObjectId
    let order = await Order.findOne({ order_number: orderNumber }).populate('items.product_id');
    
    if (!order && mongoose.Types.ObjectId.isValid(orderNumber)) {
      order = await Order.findById(orderNumber).populate('items.product_id');
    }

    if (!order) return res.status(404).json({ error: 'Order not found' });
    
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

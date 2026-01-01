import express from 'express';
import db from '../database.js';
import jwt from 'jsonwebtoken';

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
router.post('/', (req, res) => {
  const { customer, address, items, total } = req.body;
  
  // Start transaction (simplified)
  db.serialize(() => {
    db.run("BEGIN TRANSACTION");

    const orderNumber = `WJ-${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;

    const sqlOrder = "INSERT INTO orders (customer_name, customer_email, address, city, zip, total, payment_method, order_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    db.run(sqlOrder, [customer.name, customer.email, address.street, address.city, address.zip, total, customer.paymentMethod, orderNumber], function(err) {
      if (err) {
        db.run("ROLLBACK");
        return res.status(500).json({ error: err.message });
      }
      
      const orderId = this.lastID;
      const sqlItem = "INSERT INTO order_items (order_id, product_id, quantity, price, variant_id, variant_info) VALUES (?, ?, ?, ?, ?, ?)";
      const stmt = db.prepare(sqlItem);
      
      items.forEach(item => {
        // item.variantId and item.color should be sent from frontend
        stmt.run(orderId, item.id, item.quantity, item.price, item.variantId || null, item.selectedColor || null);
        
        // Deduct stock for the variant if applicable
        if (item.variantId) {
          db.run("UPDATE product_variants SET stock = stock - ? WHERE id = ?", [item.quantity, item.variantId]);
        }
      });
      
      stmt.finalize((err) => {
        if (err) {
          db.run("ROLLBACK");
          return res.status(500).json({ error: err.message });
        }
        
        db.run("COMMIT");
        
        // Award loyalty points if user is logged in (simplified: 1 point per spend)
        if (customer.userId) {
          const pointsEarned = Math.floor(total / 100); // 1 point per 100 spent
          db.run("UPDATE users SET loyalty_points = loyalty_points + ? WHERE id = ?", [pointsEarned, customer.userId]);
          db.run("INSERT INTO loyalty_history (user_id, points, type, description) VALUES (?, ?, ?, ?)", 
            [customer.userId, pointsEarned, 'earned', `Order #${orderNumber}`]);
        }
        
        // Async: Send to Google Sheets
        import('../services/googleSheets.js').then(({ appendOrderToSheet }) => {
          appendOrderToSheet({
            orderId,
            customerName: customer.name,
            customerEmail: customer.email,
            items: items.map(i => i.name).join(', '),
            total
          });
        }).catch(err => console.error('Failed to load Google Sheets service', err));

        // Async: Send Email Notification to Admin
        import('../services/email.js').then(({ sendOrderEmail }) => {
            sendOrderEmail({ id: orderId, total }, customer, items);
        }).catch(err => console.error('Failed to load Email service', err));

        res.json({ id: orderId, orderNumber, message: 'Order created successfully' });
      });
    });
  });
});

// Get Orders (Protected)
router.get('/', authenticate, (req, res) => {
  db.all("SELECT * FROM orders ORDER BY created_at DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Update Order Status (Protected)
router.patch('/:id/status', authenticate, (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  
  const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  
  db.run(
    "UPDATE orders SET status = ? WHERE id = ?",
    [status, id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: 'Order not found' });
      res.json({ message: 'Order status updated', status });
    }
  );
});

// Track Order (Public) - Fetch by order_number
router.get('/track/:orderNumber', (req, res) => {
  const { orderNumber } = req.params;
  
  const sqlOrder = "SELECT * FROM orders WHERE order_number = ? OR id = ?";
  db.get(sqlOrder, [orderNumber, orderNumber], (err, order) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    
    // Fetch items for this order
    const sqlItems = "SELECT * FROM order_items WHERE order_id = ?";
    db.all(sqlItems, [order.id], (err, items) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ ...order, items });
    });
  });
});

export default router;

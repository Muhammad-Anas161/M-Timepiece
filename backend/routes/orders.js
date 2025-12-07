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

    const sqlOrder = "INSERT INTO orders (customer_name, customer_email, address, city, zip, total, payment_method) VALUES (?, ?, ?, ?, ?, ?, ?)";
    db.run(sqlOrder, [customer.name, customer.email, address.street, address.city, address.zip, total, customer.paymentMethod], function(err) {
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
        
        // Deduct stock if variant
        if (item.variantId) {
          db.run("UPDATE product_variants SET stock = stock - ? WHERE id = ?", [item.quantity, item.variantId]);
        }
      });
      
      stmt.finalize(err => {
        if (err) {
          db.run("ROLLBACK");
          return res.status(500).json({ error: err.message });
        }

        // Award Loyalty Points
        const pointsEarned = Math.floor(total / 10); // 1 point per $10
        if (pointsEarned > 0) {
          db.run(
            "UPDATE users SET loyalty_points = loyalty_points + ? WHERE email = ?",
            [pointsEarned, customer.email],
            function(err) {
              if (!err && this.changes > 0) {
                // User found and points updated, log history
                // We need to get user ID first, but we can't easily in this flow without another query.
                // For simplicity/performance in this callback hell, we might skip history or do a subquery.
                // SQLite supports subquery in INSERT.
                db.run(
                  `INSERT INTO loyalty_history (user_id, points, type, description) 
                   SELECT id, ?, 'earned', ? FROM users WHERE email = ?`,
                  [pointsEarned, `Earned from Order #${orderId}`, customer.email]
                );
              }
            }
          );
        }

        db.run("COMMIT");
        
        // Async: Send to Google Sheets
        import('../services/googleSheets.js').then(({ appendToSheet }) => {
          appendToSheet({
            id: orderId,
            customer,
            address,
            items: items.map(i => ({...i, selectedColor: i.selectedColor})), 
            total
          });
        }).catch(err => console.error('Failed to load Google Sheets service', err));

        // Async: Send Email Notification to Admin
        import('../services/email.js').then(({ sendOrderEmail }) => {
            sendOrderEmail({ id: orderId, total }, customer, items);
        }).catch(err => console.error('Failed to load Email service', err));

        res.json({ id: orderId, message: 'Order created successfully' });
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

export default router;

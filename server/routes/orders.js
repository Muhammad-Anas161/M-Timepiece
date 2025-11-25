import express from 'express';
import db from '../database.js';
import jwt from 'jsonwebtoken';

const router = express.Router();
const SECRET_KEY = 'your-secret-key-change-this-in-production';

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
      const sqlItem = "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)";
      const stmt = db.prepare(sqlItem);
      
      items.forEach(item => {
        stmt.run(orderId, item.id, item.quantity, item.price);
      });
      
      stmt.finalize(err => {
        if (err) {
          db.run("ROLLBACK");
          return res.status(500).json({ error: err.message });
        }
        db.run("COMMIT");
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

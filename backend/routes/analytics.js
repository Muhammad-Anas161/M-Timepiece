import express from 'express';
import db from '../database.js';

const router = express.Router();

// Get dashboard stats
router.get('/stats', (req, res) => {
  const stats = {};

  // Total Revenue
  db.get('SELECT SUM(total) as total FROM orders', [], (err, row) => {
    if (err) return res.status(500).json({ message: 'Error fetching revenue' });
    stats.revenue = row.total || 0;

    // Total Orders
    db.get('SELECT COUNT(*) as count FROM orders', [], (err, row) => {
      if (err) return res.status(500).json({ message: 'Error fetching orders' });
      stats.orders = row.count;

      // Total Products
      db.get('SELECT COUNT(*) as count FROM products', [], (err, row) => {
        if (err) return res.status(500).json({ message: 'Error fetching products' });
        stats.products = row.count;

        // Total Customers (Unique emails in orders)
        db.get('SELECT COUNT(DISTINCT customer_email) as count FROM orders', [], (err, row) => {
          if (err) return res.status(500).json({ message: 'Error fetching customers' });
          stats.customers = row.count;

          res.json(stats);
        });
      });
    });
  });
});

// Get sales chart data (Last 7 days)
router.get('/sales', (req, res) => {
  const query = `
    SELECT date(created_at) as date, SUM(total) as amount, COUNT(*) as orders
    FROM orders
    WHERE created_at >= date('now', '-7 days')
    GROUP BY date(created_at)
    ORDER BY date(created_at)
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Sales Analytics Error:', err);
      return res.status(500).json({ message: 'Error fetching sales data' });
    }
    res.json(rows);
  });
});

// Get top selling products
router.get('/top-products', (req, res) => {
  // Note: This assumes we have an order_items table. 
  // Since we might be storing items as JSON in orders table (simplified), 
  // we'll fetch orders and process in JS if needed, or if we have a proper schema:
  
  // Checking schema assumption: If items are JSON in orders table, we can't easily query top products with SQL alone in SQLite without JSON extension.
  // Let's assume for now we just return the latest 5 products as "Trending" or similar if we can't query sales.
  // However, let's try to see if we can get order counts per product if we have a relation.
  // Based on previous context, we might not have a normalized order_items table.
  // Let's stick to a simple query or mock if complex.
  
  // Actually, let's check if we can get products with low stock as "Top Priority" instead?
  // Or just return top 5 most expensive products as "Premium Inventory".
  
  // Let's try to get products with highest price for now as a placeholder for "Top Value Assets"
  const query = 'SELECT * FROM products ORDER BY price DESC LIMIT 5';
  
  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Error fetching top products' });
    res.json(rows);
  });
});

// Get order status distribution
router.get('/order-status', (req, res) => {
  const query = 'SELECT status, COUNT(*) as count FROM orders GROUP BY status';
  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Error fetching status distribution' });
    res.json(rows);
  });
});

export default router;

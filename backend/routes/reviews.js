import express from 'express';
import db from '../database.js';

const router = express.Router();

// Create reviews table
db.run(`CREATE TABLE IF NOT EXISTS reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT NOT NULL,
  verified_purchase INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id)
)`, (err) => {
  if (err) console.error('Reviews table creation error:', err);
});

// Get reviews for a product
router.get('/product/:productId', (req, res) => {
  const { productId } = req.params;
  
  const query = `
    SELECT id, user_name, rating, title, comment, verified_purchase, created_at
    FROM reviews 
    WHERE product_id = ? 
    ORDER BY created_at DESC
  `;
  
  db.all(query, [productId], (err, reviews) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to fetch reviews' });
    }
    
    // Calculate average rating
    const avgQuery = 'SELECT AVG(rating) as average, COUNT(*) as total FROM reviews WHERE product_id = ?';
    db.get(avgQuery, [productId], (err, stats) => {
      if (err) {
        return res.status(500).json({ message: 'Failed to calculate stats' });
      }
      
      res.json({
        reviews,
        stats: {
          average: stats.average ? parseFloat(stats.average.toFixed(1)) : 0,
          total: stats.total
        }
      });
    });
  });
});

// Submit a review
router.post('/', (req, res) => {
  const { product_id, user_name, user_email, rating, title, comment } = req.body;

  // Validation
  if (!product_id || !user_name || !user_email || !rating || !comment) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }

  const query = `
    INSERT INTO reviews (product_id, user_name, user_email, rating, title, comment)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  
  db.run(query, [product_id, user_name, user_email, rating, title || '', comment], function(err) {
    if (err) {
      console.error('Review submission error:', err);
      return res.status(500).json({ message: 'Failed to submit review' });
    }
    
    res.status(201).json({ 
      message: 'Review submitted successfully!',
      reviewId: this.lastID
    });
  });
});

// Get all reviews (admin)
router.get('/', (req, res) => {
  const query = `
    SELECT r.*, p.name as product_name
    FROM reviews r
    LEFT JOIN products p ON r.product_id = p.id
    ORDER BY r.created_at DESC
  `;
  
  db.all(query, [], (err, reviews) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to fetch reviews' });
    }
    res.json(reviews);
  });
});

// Delete a review (admin)
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM reviews WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ message: 'Failed to delete review' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.json({ message: 'Review deleted successfully' });
  });
});

export default router;

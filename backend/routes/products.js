import express from 'express';
import db from '../database.js';
import multer from 'multer';
import path from 'path';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Configure Multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Get all products
router.get('/', (req, res) => {
  const { category, search } = req.query;
  let query = 'SELECT * FROM products';
  const params = [];
  const conditions = [];

  if (category) {
    conditions.push('category = ?');
    params.push(category);
  }

  if (search) {
    conditions.push('name LIKE ?');
    params.push(`%${search}%`);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Get single product
router.get('/:id', (req, res) => {
  db.get('SELECT * FROM products WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Product not found' });
    res.json(row);
  });
});

// Create product
router.post('/', upload.single('image'), [
  body('name').isString().notEmpty(),
  body('price').isFloat({ min: 0 }),
  body('description').isString(),
  body('category').isString().notEmpty()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, price, description, category } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : '';

  db.run('INSERT INTO products (name, price, description, image, category) VALUES (?, ?, ?, ?, ?)', 
    [name, price, description, image, category], 
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, name, price, description, image, category });
    }
  );
});

// Update product
router.put('/:id', upload.single('image'), [
  body('name').optional().isString().notEmpty(),
  body('price').optional().isFloat({ min: 0 }),
  body('description').optional().isString(),
  body('category').optional().isString().notEmpty()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, price, description, category } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : undefined;

  let query = 'UPDATE products SET name = COALESCE(?, name), price = COALESCE(?, price), description = COALESCE(?, description), category = COALESCE(?, category)';
  const params = [name, price, description, category];

  if (image) {
    query += ', image = ?';
    params.push(image);
  }

  query += ' WHERE id = ?';
  params.push(req.params.id);

  db.run(query, params, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Product updated' });
  });
});

// Delete product
router.delete('/:id', (req, res) => {
  db.run('DELETE FROM products WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Product deleted' });
  });
});

// Get product reviews
router.get('/:id/reviews', (req, res) => {
  const query = `
    SELECT id, user_name, rating, comment, created_at 
    FROM reviews 
    WHERE product_id = ? 
    ORDER BY created_at DESC
  `;
  
  db.all(query, [req.params.id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    
    // Also get average rating and count
    db.get(
      'SELECT AVG(rating) as avg_rating, COUNT(*) as review_count FROM reviews WHERE product_id = ?',
      [req.params.id],
      (err2, stats) => {
        if (err2) return res.status(500).json({ error: err2.message });
        res.json({
          reviews: rows,
          stats: {
            average_rating: stats.avg_rating ? parseFloat(stats.avg_rating.toFixed(1)) : 0,
            review_count: stats.review_count
          }
        });
      }
    );
  });
});

// Submit product review
router.post('/:id/reviews', [
  body('user_name').isString().trim().notEmpty().withMessage('Name is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().isString().trim()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { user_name, rating, comment } = req.body;
  const product_id = req.params.id;

  db.run(
    'INSERT INTO reviews (product_id, user_name, rating, comment) VALUES (?, ?, ?, ?)',
    [product_id, user_name, rating, comment || ''],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ 
        id: this.lastID, 
        product_id, 
        user_name, 
        rating, 
        comment,
        message: 'Review submitted successfully' 
      });
    }
  );
});

// Get related products (same category, excluding current product)
router.get('/:id/related', (req, res) => {
  const query = `
    SELECT p2.* 
    FROM products p1 
    JOIN products p2 ON p1.category = p2.category 
    WHERE p1.id = ? AND p2.id != ? 
    LIMIT 6
  `;
  
  db.all(query, [req.params.id, req.params.id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

export default router;

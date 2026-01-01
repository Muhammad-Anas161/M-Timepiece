import Product from '../models/Product.js';
import multer from 'multer';
import path from 'path';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Configure Multer for image upload
// Configure Multer to use persistent volume if available
import fs from 'fs';

const isRailwayVolume = process.env.DB_FILE_PATH && process.env.DB_FILE_PATH.includes('/app/data');
const uploadDir = isRailwayVolume 
  ? path.join('/app/data', 'uploads') 
  : process.env.UPLOADS_DIR || path.join(process.cwd(), 'uploads');

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Get all products
router.get('/', async (req, res) => {
  const { category, search, brand } = req.query;
  const filter = {};

  if (category) {
    filter.category = category;
  }

  if (brand) {
    filter.brand = { $in: brand.split(',') };
  }

  if (search) {
    filter.name = { $regex: search, $options: 'i' };
  }

  try {
    const products = await Product.find(filter).sort({ created_at: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single product with variants
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

import { verifyToken, isAdmin } from '../middleware/auth.js';

// Create product with variants (Protected)
router.post('/', verifyToken, isAdmin, upload.any(), [
  body('name').isString().notEmpty(),
  body('price').isFloat({ min: 0 }),
  body('description').isString(),
  body('category').isString().notEmpty(),
  body('brand').optional().isString()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    if (req.files) {
      req.files.forEach(file => fs.unlinkSync(file.path));
    }
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, price, description, category, brand } = req.body;
  
  let variantsData = [];
  try {
    variantsData = req.body.variants ? JSON.parse(req.body.variants) : [];
  } catch (e) {
    console.error('Error parsing variants JSON:', e);
  }

  const protocol = process.env.NODE_ENV === 'production' ? 'https' : req.protocol;
  const host = req.get('host');
  const baseUrl = `${protocol}://${host}/uploads/`;

  let mainImage = '';
  let hoverImage = '';
  
  const mainImageFile = req.files.find(f => f.fieldname === 'image');
  if (mainImageFile) {
    mainImage = `${baseUrl}${mainImageFile.filename}`;
  }

  const hoverImageFile = req.files.find(f => f.fieldname === 'hover_image');
  if (hoverImageFile) {
    hoverImage = `${baseUrl}${hoverImageFile.filename}`;
  }

  const processedVariants = variantsData.map((v, index) => {
    const variantFile = req.files.find(f => f.fieldname === `variant_image_${index}`);
    let variantImageUrl = v.image || null;
    if (variantFile) {
      variantImageUrl = `${baseUrl}${variantFile.filename}`;
    }
    return {
      color: v.color,
      color_code: v.color_code || '#000000',
      stock: v.stock || 0,
      price_modifier: v.price_modifier || 0,
      image: variantImageUrl
    };
  });

  try {
    const product = new Product({
      name,
      price,
      description,
      image: mainImage,
      hover_image: hoverImage,
      category,
      brand: brand || 'M Timepiece',
      variants: processedVariants
    });

    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update product and variants (Protected)
router.put('/:id', verifyToken, isAdmin, upload.any(), [
  body('name').optional().isString().notEmpty(),
  body('price').optional().isFloat({ min: 0 }),
  body('description').optional().isString(),
  body('category').optional().isString().notEmpty()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
     if (req.files) {
      req.files.forEach(file => fs.unlinkSync(file.path));
    }
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, price, description, category, brand } = req.body;
  let variants = [];
  try {
    variants = req.body.variants ? JSON.parse(req.body.variants) : [];
  } catch (e) {}

  const protocol = process.env.NODE_ENV === 'production' ? 'https' : req.protocol;
  const host = req.get('host');
  const baseUrl = `${protocol}://${host}/uploads/`;

  let image = undefined;
  let hover_image = undefined;

  const mainImageFile = req.files.find(f => f.fieldname === 'image');
  if (mainImageFile) {
    image = `${baseUrl}${mainImageFile.filename}`;
  }

  const hoverImageFile = req.files.find(f => f.fieldname === 'hover_image');
  if (hoverImageFile) {
    hover_image = `${baseUrl}${hoverImageFile.filename}`;
  }

  let query = 'UPDATE products SET name = COALESCE(?, name), price = COALESCE(?, price), description = COALESCE(?, description), category = COALESCE(?, category), brand = COALESCE(?, brand)';
  const params = [name, price, description, category, brand];

  if (image) {
    query += ', image = ?';
    params.push(image);
  }

  if (hover_image) {
    query += ', hover_image = ?';
    params.push(hover_image);
  } else if (req.body.imageUrl) {
     // If no new file but imageUrl is provided (retaining old image), we don't need to update the column unless we want to explicit set it. 
     // However, the standard usually is: if file provided, update. If not, keep old. 
     // The frontend might explicitly send `imageUrl` to confirm the existing one not changed, but SQL `COALESCE` or just not updating it does the job.
     // In this specific logic: params.push(image) only if image is defined. 
  }

  query += ' WHERE id = ?';
  params.push(req.params.id);

  db.run(query, params, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    
    // Update variants: Delete all and re-insert (simplest strategy)
    // IMPORTANT: We must perform DELETE even if variants.length is 0 (to allow clearing all variants)
    db.run('DELETE FROM product_variants WHERE product_id = ?', [req.params.id], (err) => {
      if (err) {
        console.error("Error deleting old variants:", err.message);
        // We continue? or fail? Failsafe: continue to at least update product info, but ideally warn.
        // For now, let's log.
      } else {
        console.log(`Cleared variants for product ${req.params.id}`);
        
        if (variants.length > 0) {
          const stmt = db.prepare('INSERT INTO product_variants (product_id, color, color_code, stock, price_modifier, image) VALUES (?, ?, ?, ?, ?, ?)');
          
          // Debugging log
          console.log('Processing variants update:', JSON.stringify(variants, null, 2));

          variants.forEach((v, index) => {
             // Check if new file uploaded for this variant
             const variantFile = req.files.find(f => f.fieldname === `variant_image_${index}`);
             
             // Explicit logic: 
             let finalVariantImage = null;

             if (variantFile) {
               finalVariantImage = `${baseUrl}${variantFile.filename}`;
             } else if (v.image && v.image.trim() !== '') {
               finalVariantImage = v.image;
             }

             // Log to confirm what's being inserted
             console.log(`Variant ${index} image: ${finalVariantImage}`);

            stmt.run(req.params.id, v.color, v.color_code || '#000000', v.stock || 0, v.price_modifier || 0, finalVariantImage);
          });
          stmt.finalize();
        }
      }
    });

    res.json({ message: 'Product updated' });
  });
});

// Delete product (Protected)
router.delete('/:id', verifyToken, isAdmin, (req, res) => {
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

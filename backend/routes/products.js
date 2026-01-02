import express from 'express';
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

import Review from '../models/Review.js';

// Update product and variants (Protected)
router.put('/:id', verifyToken, isAdmin, upload.any(), [
  body('name').optional().isString().notEmpty(),
  body('price').optional().isFloat({ min: 0 }),
  body('description').optional().isString(),
  body('category').optional().isString().notEmpty()
], async (req, res) => {
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
  } catch (e) {
    console.error('Error parsing variants JSON:', e);
  }

  const protocol = process.env.NODE_ENV === 'production' ? 'https' : req.protocol;
  const host = req.get('host');
  const baseUrl = `${protocol}://${host}/uploads/`;

  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Update fields if provided
    if (name) product.name = name;
    if (price) product.price = price;
    if (description) product.description = description;
    if (category) product.category = category;
    if (brand) product.brand = brand;
    if (req.body.features) product.features = req.body.features;

    // Handle Main Image
    const mainImageFile = req.files.find(f => f.fieldname === 'image');
    if (mainImageFile) {
      product.image = `${baseUrl}${mainImageFile.filename}`;
      // Ideally delete old image here if exists
    }

    // Handle Hover Image
    const hoverImageFile = req.files.find(f => f.fieldname === 'hover_image');
    if (hoverImageFile) {
      product.hover_image = `${baseUrl}${hoverImageFile.filename}`;
    }

    // Handle Variants
    // Strategy: Rebuild variants array based on input
    // If variants array is empty in input, clear it? Or just update if provided?
    // Frontend sends all variants every time, so we can overwrite.
    
    if (variants && variants.length > 0) {
      const processedVariants = variants.map((v, index) => {
        const variantFile = req.files.find(f => f.fieldname === `variant_image_${index}`);
        let variantImageUrl = null;
        
        if (variantFile) {
          variantImageUrl = `${baseUrl}${variantFile.filename}`;
        } else if (v.image && v.image.trim() !== '') {
           variantImageUrl = v.image; // Keep existing image URL
        }

        return {
          color: v.color,
          color_code: v.color_code || '#000000',
          stock: v.stock || 0,
          price_modifier: v.price_modifier || 0,
          image: variantImageUrl
        };
      });
      product.variants = processedVariants;
    } else if (req.body.variants === '[]') {
       // Explicitly cleared
       product.variants = [];
    }

    await product.save();
    res.json({ message: 'Product updated', product });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Delete product (Protected)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    
    // Also delete associated reviews
    await Review.deleteMany({ product_id: req.params.id });

    // Ideally delete images from disk too

    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get product reviews
router.get('/:id/reviews', async (req, res) => {
  try {
    const reviews = await Review.find({ product_id: req.params.id }).sort({ created_at: -1 });
    
    // Calculate stats
    const stats = {
      average_rating: 0,
      review_count: reviews.length
    };

    if (reviews.length > 0) {
      const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
      stats.average_rating = parseFloat((sum / reviews.length).toFixed(1));
    }

    res.json({ reviews, stats });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Submit product review
router.post('/:id/reviews', [
  body('user_name').isString().trim().notEmpty().withMessage('Name is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().isString().trim()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { user_name, rating, comment } = req.body;
  const product_id = req.params.id;

  try {
    const review = new Review({
      product_id,
      user_name,
      rating,
      comment: comment || ''
    });

    await review.save();
    
    res.json({ 
      id: review._id, 
      product_id, 
      user_name, 
      rating, 
      comment,
      message: 'Review submitted successfully' 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get related products (same category, excluding current product)
router.get('/:id/related', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const related = await Product.find({ 
      category: product.category, 
      _id: { $ne: product._id } 
    }).limit(6);

    res.json(related);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

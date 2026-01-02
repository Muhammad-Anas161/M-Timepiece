import express from 'express';
import Product from '../models/Product.js';
import multer from 'multer';
import path from 'path';
import { body, validationResult } from 'express-validator';

const router = express.Router();

import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dweiwmhyn',
  api_key: process.env.CLOUDINARY_API_KEY || '639921947834824',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'a17cJSbokE_wtwcUPoZW_Ad95c4'
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'm-timepiece',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    transformation: [{ width: 1000, height: 1000, crop: 'limit' }]
  },
});

const upload = multer({ storage });

// Get all products
router.get('/', async (req, res) => {
  const { category, search, brand } = req.query;
  const filter = {};

  if (category) {
    // Check if product's category array contains the requested category
    // Mongoose handles { field: value } for arrays as "does array contain value?"
    // If multiple categories provided (comma separated), match ANY
    const cats = category.split(',').map(c => c.trim());
    if (cats.length > 1) {
       filter.category = { $in: cats };
    } else {
       filter.category = cats[0];
    }
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

  let mainImage = '';
  const mainImageFile = req.files.find(f => f.fieldname === 'image');
  if (mainImageFile) {
    mainImage = mainImageFile.path;
  }

  const processedVariants = variantsData.map((v, index) => {
    const variantFile = req.files.find(f => f.fieldname === `variant_image_${index}`);
    let variantImageUrl = v.image || null;
    if (variantFile) {
      variantImageUrl = variantFile.path;
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

  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Update fields if provided
    if (name) product.name = name;
    if (price) product.price = price;
    if (description) product.description = description;
    if (category) product.category = formatCategories(category);
    if (brand) product.brand = brand;
    if (req.body.features) product.features = req.body.features;

    // Handle Main Image
    const mainImageFile = req.files.find(f => f.fieldname === 'image');
    if (mainImageFile) {
      product.image = mainImageFile.path;
    }

    // Handle Variants
    if (variants && variants.length > 0) {
      const processedVariants = variants.map((v, index) => {
        const variantFile = req.files.find(f => f.fieldname === `variant_image_${index}`);
        let variantImageUrl = null;
        
        if (variantFile) {
          variantImageUrl = variantFile.path;
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

import express from 'express';
import Review from '../models/Review.js';
import mongoose from 'mongoose';

const router = express.Router();

// Get reviews for a product
router.get('/product/:productId', async (req, res) => {
  const { productId } = req.params;
  
  try {
    const reviews = await Review.find({ product_id: productId }).sort({ created_at: -1 });
    
    // Calculate average rating and total
    const stats = await Review.aggregate([
      { $match: { product_id: new mongoose.Types.ObjectId(productId) } },
      { $group: {
          _id: null,
          average: { $avg: "$rating" },
          total: { $sum: 1 }
      }}
    ]);

    const resultStats = stats.length > 0 ? {
      average: parseFloat(stats[0].average.toFixed(1)),
      total: stats[0].total
    } : { average: 0, total: 0 };

    res.json({
      reviews,
      stats: resultStats
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch reviews', error: err.message });
  }
});

// Submit a review
router.post('/', async (req, res) => {
  const { product_id, user_name, user_email, rating, title, comment } = req.body;

  // Validation
  if (!product_id || !user_name || !user_email || !rating || !comment) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }

  try {
    const review = new Review({
      product_id,
      user_name,
      user_email,
      rating,
      title: title || '',
      comment
    });

    await review.save();
    
    res.status(201).json({ 
      message: 'Review submitted successfully!',
      reviewId: review._id
    });
  } catch (err) {
    console.error('Review submission error:', err);
    res.status(500).json({ message: 'Failed to submit review', error: err.message });
  }
});

// Get all reviews (admin)
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('product_id', 'name')
      .sort({ created_at: -1 });
    
    // Map product_id to product_name to match expected response format if needed
    const formattedReviews = reviews.map(r => ({
      ...r.toObject(),
      product_name: r.product_id ? r.product_id.name : 'Unknown Product'
    }));

    res.json(formattedReviews);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch reviews', error: err.message });
  }
});

// Delete a review (admin)
router.delete('/:id', async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json({ message: 'Review deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete review', error: err.message });
  }
});

export default router;

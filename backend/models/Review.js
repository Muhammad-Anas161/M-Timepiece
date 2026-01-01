import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  user_name: String,
  user_email: String,
  rating: { type: Number, min: 1, max: 5 },
  title: String,
  comment: String,
  verified_purchase: { type: Boolean, default: false }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

const Review = mongoose.model('Review', reviewSchema);
export default Review;

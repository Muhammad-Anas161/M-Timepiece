import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discount_type: { type: String, enum: ['percentage', 'fixed'], required: true },
  discount_value: { type: Number, required: true },
  min_purchase: { type: Number, default: 0 },
  max_discount: Number,
  usage_limit: Number,
  used_count: { type: Number, default: 0 },
  valid_until: Date,
  active: { type: Boolean, default: true }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

const Coupon = mongoose.model('Coupon', couponSchema);
export default Coupon;

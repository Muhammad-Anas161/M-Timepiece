import mongoose from 'mongoose';

const newsletterSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  active: { type: Boolean, default: true }
}, { timestamps: { createdAt: 'subscribed_at', updatedAt: 'updated_at' } });

const Newsletter = mongoose.model('Newsletter', newsletterSchema);
export default Newsletter;

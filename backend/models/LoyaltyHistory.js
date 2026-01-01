import mongoose from 'mongoose';

const loyaltyHistorySchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  points: { type: Number, required: true },
  type: { type: String, enum: ['earned', 'redeemed'], required: true },
  description: String
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

const LoyaltyHistory = mongoose.model('LoyaltyHistory', loyaltyHistorySchema);
export default LoyaltyHistory;

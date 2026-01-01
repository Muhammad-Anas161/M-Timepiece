import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, unique: true, sparse: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  loyalty_points: { type: Number, default: 0 }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;

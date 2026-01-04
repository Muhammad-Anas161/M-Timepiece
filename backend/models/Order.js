import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  quantity: Number,
  price: Number,
  variant_id: String, // String for variant index or ID
  variant_info: String
});

const orderSchema = new mongoose.Schema({
  customer_name: { type: String, required: true },
  customer_email: { type: String, required: true },
  address: String,
  city: String,
  zip: String,
  total: { type: Number, required: true },
  status: { type: String, default: 'Pending' },
  payment_method: { type: String, default: 'Bank Transfer' },
  order_number: { type: String, unique: true },
  items: [orderItemSchema]
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

const Order = mongoose.model('Order', orderSchema);
export default Order;

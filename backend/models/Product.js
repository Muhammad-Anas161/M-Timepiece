import mongoose from 'mongoose';

const variantSchema = new mongoose.Schema({
  color: String,
  color_code: String,
  stock: { type: Number, default: 0 },
  price_modifier: { type: Number, default: 0 },
  image: String
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: String,
  hover_image: String,
  description: String,
  features: String,
  category: { type: String, default: 'Unisex' },
  brand: { type: String, default: 'M Timepiece' },
  variants: [variantSchema]
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
export default Product;

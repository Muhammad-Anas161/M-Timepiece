import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Product from './models/Product.js';
import Review from './models/Review.js';

// Load environment variables
dotenv.config();

const seedReviews = async () => {
  try {
    await connectDB();
    
    const products = await Product.find().limit(10);
    if (products.length === 0) {
      console.log("No products found to link reviews to. Run seed-products first.");
      process.exit(1);
    }

    const reviews = [];
    const reviewers = ['John Smith', 'Sarah Johnson', 'Mike Davis', 'Emily Chen', 'Robert Wilson', 'Lisa Anderson', 'David Brown', 'Jennifer Lee', 'Tom Martinez', 'Amanda White'];
    const comments = [
      'Absolutely stunning watch! The quality exceeded my expectations.',
      'Beautiful design, very comfortable to wear.',
      'Best purchase I made this year. Highly recommend!',
      'Perfect for everyday wear. Love the minimalist design.',
      'Great value for money. Fast shipping too!',
      'Elegant and sophisticated. Gets compliments all the time!',
      'Exceptional craftsmanship. Worth every penny.',
      'Very happy with this purchase. Looks even better in person.',
      'Fantastic watch! The attention to detail is impressive.',
      'Absolutely love it! Perfect gift for my husband.'
    ];

    products.forEach((product, i) => {
      // Add 2 reviews per product
      reviews.push({
        product_id: product._id,
        user_name: reviewers[i % reviewers.length],
        user_email: `${reviewers[i % reviewers.length].replace(' ', '.').toLowerCase()}@example.com`,
        rating: 5,
        comment: comments[i % comments.length]
      });

      reviews.push({
        product_id: product._id,
        user_name: reviewers[(i + 1) % reviewers.length],
        user_email: `${reviewers[(i + 1) % reviewers.length].replace(' ', '.').toLowerCase()}@example.com`,
        rating: 4,
        comment: comments[(i + 1) % comments.length]
      });
    });

    await Review.insertMany(reviews);
    console.log(`✅ Successfully added ${reviews.length} sample reviews`);
    process.exit(0);
  } catch (err) {
    console.error('Error seeding reviews:', err);
    process.exit(1);
  }
};

seedReviews();

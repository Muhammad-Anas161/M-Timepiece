import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

// Sample reviews for first 10 products
const sampleReviews = [
  // Product 1
  { product_id: 1, user_name: 'John Smith', rating: 5, comment: 'Absolutely stunning watch! The quality exceeded my expectations.' },
  { product_id: 1, user_name: 'Sarah Johnson', rating: 4, comment: 'Beautiful design, very comfortable to wear.' },
  { product_id: 1, user_name: 'Mike Davis', rating: 5, comment: 'Best purchase I made this year. Highly recommend!' },
  
  // Product 2
  { product_id: 2, user_name: 'Emily Chen', rating: 5, comment: 'Perfect for everyday wear. Love the minimalist design.' },
  { product_id: 2, user_name: 'Robert Wilson', rating: 4, comment: 'Great value for money. Fast shipping too!' },
  
  // Product 3
  { product_id: 3, user_name: 'Lisa Anderson', rating: 5, comment: 'Elegant and sophisticated. Gets compliments all the time!' },
  { product_id: 3, user_name: 'David Brown', rating: 5, comment: 'Exceptional craftsmanship. Worth every penny.' },
  { product_id: 3, user_name: 'Jennifer Lee', rating: 4, comment: 'Very happy with this purchase. Looks even better in person.' },
  
  // Product 4
  { product_id: 4, user_name: 'Tom Martinez', rating: 5, comment: 'Fantastic watch! The attention to detail is impressive.' },
  { product_id: 4, user_name: 'Amanda White', rating: 5, comment: 'Absolutely love it! Perfect gift for my husband.' },
  
  // Product 5
  { product_id: 5, user_name: 'Chris Taylor', rating: 4, comment: 'Good quality watch. Comfortable strap.' },
  { product_id: 5, user_name: 'Jessica Moore', rating: 5, comment: 'Beautiful timepiece. Very satisfied with the purchase.' },
  
  // Product 6
  { product_id: 6, user_name: 'Kevin Jackson', rating: 5, comment: 'Premium quality at a reasonable price. Highly recommended!' },
  { product_id: 6, user_name: 'Rachel Green', rating: 4, comment: 'Stylish and functional. Great addition to my collection.' },
  
  // Product 7
  { product_id: 7, user_name: 'Daniel Harris', rating: 5, comment: 'Exceeded expectations! The build quality is outstanding.' },
  { product_id: 7, user_name: 'Sophia Clark', rating: 5, comment: 'Love everything about this watch. Perfect!' },
  
  // Product 8
  { product_id: 8, user_name: 'Matthew Lewis', rating: 4, comment: 'Very nice watch. Good weight and feel.' },
  { product_id: 8, user_name: 'Olivia Walker', rating: 5, comment: 'Gorgeous design. Wear it every day!' },
  
  // Product 9
  { product_id: 9, user_name: 'Andrew Hall', rating: 5, comment: 'Top-notch quality. Customer service was excellent too.' },
  { product_id: 9, user_name: 'Emma Allen', rating: 4, comment: 'Really happy with this watch. Looks professional.' },
  
  // Product 10
  { product_id: 10, user_name: 'Ryan Young', rating: 5, comment: 'Best watch I own. The craftsmanship is superb.' },
  { product_id: 10, user_name: 'Isabella King', rating: 5, comment: 'Absolutely beautiful! Worth the investment.' }
];

db.serialize(() => {
  const stmt = db.prepare('INSERT INTO reviews (product_id, user_name, rating, comment) VALUES (?, ?, ?, ?)');
  
  sampleReviews.forEach(review => {
    stmt.run(review.product_id, review.user_name, review.rating, review.comment);
  });

  stmt.finalize((err) => {
    if (err) {
      console.error('Error seeding reviews:', err);
    } else {
      console.log(`✅ Successfully added ${sampleReviews.length} sample reviews`);
    }
    db.close();
  });
});

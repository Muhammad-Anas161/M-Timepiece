import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  // Add reviews table
  db.run(`CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    user_name TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE
  )`, (err) => {
    if (err) {
      console.error("Error creating reviews table:", err);
    } else {
      console.log("✓ Reviews table created");
    }
  });

  // Add stock_quantity column to products if it doesn't exist
  db.run(`ALTER TABLE products ADD COLUMN stock_quantity INTEGER DEFAULT 10`, (err) => {
    if (err) {
      // Column might already exist, check if it's a different error
      if (err.message.includes('duplicate column name')) {
        console.log("✓ stock_quantity column already exists");
      } else {
        console.error("Error adding stock_quantity column:", err);
      }
    } else {
      console.log("✓ stock_quantity column added to products");
    }
  });

  // Create index on reviews for faster queries
  db.run(`CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id)`, (err) => {
    if (err) {
      console.error("Error creating index:", err);
    } else {
      console.log("✓ Index created on reviews.product_id");
    }
  });

  db.close(() => {
    console.log("\n✅ Migration completed successfully");
  });
});

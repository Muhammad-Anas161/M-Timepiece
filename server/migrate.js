import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  // Add category to products
  db.run("ALTER TABLE products ADD COLUMN category TEXT DEFAULT 'Unisex'", (err) => {
    if (err && !err.message.includes('duplicate column')) {
      console.error("Error adding category column:", err.message);
    } else {
      console.log("Added category column to products");
    }
  });

  // Add payment_method to orders
  db.run("ALTER TABLE orders ADD COLUMN payment_method TEXT DEFAULT 'Credit Card'", (err) => {
    if (err && !err.message.includes('duplicate column')) {
      console.error("Error adding payment_method column:", err.message);
    } else {
      console.log("Added payment_method column to orders");
    }
  });
});

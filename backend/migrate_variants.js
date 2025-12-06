import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

console.log('Migrating Product Variants Table...');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS product_variants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    color TEXT NOT NULL,
    color_code TEXT,
    image TEXT,
    stock INTEGER DEFAULT 0,
    price_modifier REAL DEFAULT 0,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
  )`, (err) => {
    if (err) {
      console.error('Error creating product_variants table:', err.message);
    } else {
      console.log('product_variants table created successfully');
    }
  });
});

db.close(() => {
  console.log('Migration complete');
});

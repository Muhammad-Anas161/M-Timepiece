import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Allow database path to be configured via environment variable (useful for volumes)
// Default to local file if not specified
const dbPath = process.env.DB_FILE_PATH || join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  // Users Table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    email TEXT UNIQUE,
    password TEXT,
    loyalty_points INTEGER DEFAULT 0
  )`);

  // Products Table
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    price REAL,
    image TEXT,
    description TEXT,
    features TEXT,
    category TEXT DEFAULT 'Unisex'
  )`);

  // Product Variants Table
  db.run(`CREATE TABLE IF NOT EXISTS product_variants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER,
    color TEXT,
    color_code TEXT,
    stock INTEGER DEFAULT 0,
    price_modifier REAL DEFAULT 0,
    FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE
  )`);

  // Orders Table
  db.run(`CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name TEXT,
    customer_email TEXT,
    address TEXT,
    city TEXT,
    zip TEXT,
    total REAL,
    status TEXT DEFAULT 'Pending',
    payment_method TEXT DEFAULT 'Credit Card',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Order Items Table
  db.run(`CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER,
    product_id INTEGER,
    quantity INTEGER,
    price REAL,
    variant_id INTEGER,
    variant_info TEXT,
    FOREIGN KEY(order_id) REFERENCES orders(id)
  )`);

  // Visitor Logs Table
  db.run(`CREATE TABLE IF NOT EXISTS visitor_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ip_address TEXT,
    user_agent TEXT,
    browser TEXT,
    os TEXT,
    device_type TEXT,
    screen_resolution TEXT,
    city TEXT,
    country TEXT,
    referrer TEXT,
    page_url TEXT,
    visit_time DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Reviews Table
  db.run(`CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER,
    user_name TEXT,
    rating INTEGER,
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(product_id) REFERENCES products(id)
  )`);

  // Coupons Table
  db.run(`CREATE TABLE IF NOT EXISTS coupons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE,
    discount_type TEXT,
    discount_value REAL,
    min_purchase REAL,
    max_discount REAL,
    usage_limit INTEGER,
    used_count INTEGER DEFAULT 0,
    valid_until DATETIME,
    is_active INTEGER DEFAULT 1
  )`);

  // Seed Admin User
  const adminPassword = 'password123';
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(adminPassword, salt);

  db.get("SELECT * FROM users WHERE username = ?", ['admin'], (err, row) => {
    if (!row) {
      db.run("INSERT INTO users (username, password) VALUES (?, ?)", ['admin', hash]);
      console.log("Admin user created: admin / password123");
    }
  });

  // Seed Initial Products if empty
  db.get("SELECT count(*) as count FROM products", (err, row) => {
    if (row.count === 0) {
      const products = [
        {
          name: "Classic Monochrome",
          price: 129.00,
          image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=1000",
          description: "A timeless classic featuring a minimalist dial and premium leather strap.",
          features: "Genuine Leather Strap\nWater Resistant 30m\nJapanese Quartz Movement"
        },
        {
          name: "Urban Chronograph",
          price: 199.00,
          image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&q=80&w=1000",
          description: "Designed for the modern city dweller, this chronograph combines functionality with sleek aesthetics.",
          features: "Stainless Steel Case\nChronograph Function\nLuminous Hands"
        }
      ];

      const stmt = db.prepare("INSERT INTO products (name, price, image, description, features) VALUES (?, ?, ?, ?, ?)");
      products.forEach(p => {
        stmt.run(p.name, p.price, p.image, p.description, p.features);
      });
      stmt.finalize();
      console.log("Initial products seeded");
    }
  });
});

export default db;

import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Allow database path to be configured via environment variable (useful for volumes)
// Default to local file if not specified
const dbPath = process.env.DB_FILE_PATH || join(__dirname, 'database.sqlite');
console.log('🔌 Database Connection Path:', dbPath); // Log for debugging persistence
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  // Users Table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    email TEXT UNIQUE,
    password TEXT,
    role TEXT DEFAULT 'user',
    loyalty_points INTEGER DEFAULT 0
  )`, (err) => {
    if (err) console.error("Error creating users table:", err.message);
    else console.log("Users table verified/created");
  });

  // Products Table
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    price REAL,
    image TEXT,
    description TEXT,
    features TEXT,
    category TEXT DEFAULT 'Unisex'
  )`, (err) => {
    if (err) console.error("Error creating products table:", err.message);
    else console.log("Products table verified/created");
  });

  // Product Variants Table
  db.run(`CREATE TABLE IF NOT EXISTS product_variants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER,
    color TEXT,
    color_code TEXT,
    stock INTEGER DEFAULT 0,
    price_modifier REAL DEFAULT 0,
    FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE
  )`, (err) => {
    if (err) console.error("Error creating product_variants table:", err.message);
    else console.log("Product Variants table verified/created");
  });

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
  )`, (err) => {
    if (err) console.error("Error creating orders table:", err.message);
    else console.log("Orders table verified/created");
  });

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
  )`, (err) => {
    if (err) console.error("Error creating order_items table:", err.message);
    else console.log("Order Items table verified/created");
  });

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
  )`, (err) => {
    if (err) console.error("Error creating visitor_logs table:", err.message);
    else console.log("Visitor Logs table verified/created");
  });

  // Reviews Table
  db.run(`CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER,
    user_name TEXT,
    user_email TEXT,
    rating INTEGER,
    title TEXT,
    comment TEXT,
    verified_purchase INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(product_id) REFERENCES products(id)
  )`, (err) => {
    if (err) console.error("Error creating reviews table:", err.message);
    else console.log("Reviews table verified/created");
  });

  // --- SCHEMA CORRECTIONS FOR EXISTING TABLES ---
  // Ensure 'category' exists in products
  db.run("ALTER TABLE products ADD COLUMN category TEXT DEFAULT 'Unisex'", (err) => {
    if (err && !err.message.includes('duplicate column')) console.error("Migrate Warning (products.category):", err.message);
  });

  // Ensure 'payment_method' exists in orders
  db.run("ALTER TABLE orders ADD COLUMN payment_method TEXT DEFAULT 'Credit Card'", (err) => {
    if (err && !err.message.includes('duplicate column')) console.error("Migrate Warning (orders.payment_method):", err.message);
  });

  // Ensure 'email', 'loyalty_points' exist in users
  db.run("ALTER TABLE users ADD COLUMN email TEXT UNIQUE", (err) => {
    if (err && !err.message.includes('duplicate column')) console.error("Migrate Warning (users.email):", err.message);
  });
  db.run("ALTER TABLE users ADD COLUMN loyalty_points INTEGER DEFAULT 0", (err) => {
    if (err && !err.message.includes('duplicate column')) console.error("Migrate Warning (users.loyalty_points):", err.message);
  });

  // Schema Fix: Ensure reviews table has new columns (for existing databases)
  const reviewColumns = ['user_email', 'title', 'verified_purchase'];
  reviewColumns.forEach(col => {
    // Determine type - simplified for this specific fix
    const type = col === 'verified_purchase' ? 'INTEGER DEFAULT 0' : 'TEXT';
    
    db.run(`ALTER TABLE reviews ADD COLUMN ${col} ${type}`, (err) => {
      // Ignore duplicate column error, log others
      if (err && !err.message.includes('duplicate column')) {
        console.error(`Migration warning: Could not add ${col} to reviews:`, err.message);
      }
    });
  });

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
    active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, (err) => {
    if (err) console.error("Error creating coupons table:", err.message);
    else console.log("Coupons table verified/created");
  });

  // Migrate old coupons table if it has is_active instead of active
  db.all("PRAGMA table_info(coupons)", [], (err, columns) => {
    if (!err && columns) {
      const hasIsActive = columns.some(col => col.name === 'is_active');
      const hasActive = columns.some(col => col.name === 'active');
      
      if (hasIsActive && !hasActive) {
        console.log("Migrating coupons table: renaming is_active to active");
        // SQLite doesn't support column rename directly, so we need to recreate the table
        db.serialize(() => {
          db.run("ALTER TABLE coupons RENAME TO coupons_old");
          db.run(`CREATE TABLE coupons (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            code TEXT UNIQUE,
            discount_type TEXT,
            discount_value REAL,
            min_purchase REAL,
            max_discount REAL,
            usage_limit INTEGER,
            used_count INTEGER DEFAULT 0,
            valid_until DATETIME,
            active INTEGER DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )`);
          db.run("INSERT INTO coupons (id, code, discount_type, discount_value, min_purchase, max_discount, usage_limit, used_count, valid_until, active) SELECT id, code, discount_type, discount_value, min_purchase, max_discount, usage_limit, used_count, valid_until, is_active FROM coupons_old");
          db.run("DROP TABLE coupons_old");
          console.log("Coupons table migration complete");
        });
      }
    }
  });

  // Loyalty History Table
  db.run(`CREATE TABLE IF NOT EXISTS loyalty_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    points INTEGER,
    type TEXT, -- 'earned' or 'redeemed'
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`, (err) => {
    if (err) console.error("Error creating loyalty_history table:", err.message);
    else console.log("Loyalty History table verified/created");
  });

  // Ensure 'role' exists in users (Migration)
  db.run("ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user'", (err) => {
    if (err && !err.message.includes('duplicate column')) console.error("Migrate Warning (users.role):", err.message);
  });

  // Seed Admin User
  const adminPassword = process.env.ADMIN_PASSWORD || 'password123';
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(adminPassword, salt);

  db.get("SELECT * FROM users WHERE username = ?", ['admin'], (err, row) => {
    if (!row) {
      db.run("INSERT INTO users (username, password, role) VALUES (?, ?, 'admin')", ['admin', hash]);
      console.log("Admin user created: admin / password123");
    } else {
      // Ensure existing admin has admin role
      if (row.role !== 'admin') {
        db.run("UPDATE users SET role = 'admin' WHERE username = ?", ['admin']);
        console.log("Updated existing admin user to have admin role");
      }
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

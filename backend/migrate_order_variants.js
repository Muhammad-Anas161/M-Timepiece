import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

console.log('Adding variant_id to order_items...');

db.serialize(() => {
  db.run("ALTER TABLE order_items ADD COLUMN variant_id INTEGER", (err) => {
    if (err && !err.message.includes('duplicate column')) {
      console.error("Error adding variant_id column:", err.message);
    } else {
      console.log("Added variant_id column to order_items");
    }
  });
  
  // Also add variant_color just for easy display? No, join is better, but historical data...
  // Let's add 'variant_info' text/json to store color name at time of purchase
  db.run("ALTER TABLE order_items ADD COLUMN variant_info TEXT", (err) => {
      if (err && !err.message.includes('duplicate column')) {
        console.error("Error adding variant_info column:", err.message);
      } else {
        console.log("Added variant_info column to order_items");
      }
    });
});

db.close(() => {
  console.log('Migration complete');
});

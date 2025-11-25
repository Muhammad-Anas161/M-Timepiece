import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

const watchNames = [
  "Royal Oak", "Nautilus", "Speedmaster", "Submariner", "Daytona", 
  "Tank", "Reverso", "Calatrava", "Seamaster", "Navitimer",
  "Carrera", "Monaco", "Big Bang", "Luminor", "Datejust",
  "Oyster Perpetual", "Aquanaut", "Fifty Fathoms", "Pilot's Watch", "Portugieser",
  "Khaki Field", "Black Bay", "Pelagos", "Alpinist", "Presage"
];

const adjectives = ["Classic", "Modern", "Vintage", "Sport", "Elegant", "Luxury", "Automatic", "Chronograph", "Diver", "Pilot"];

const images = [
  "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=1000",
  "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&q=80&w=1000",
  "https://images.unsplash.com/photo-1526045431048-f857369baa09?auto=format&fit=crop&q=80&w=1000",
  "https://images.unsplash.com/photo-1533139502658-0198f920d3e8?auto=format&fit=crop&q=80&w=1000",
  "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&q=80&w=1000",
  "https://images.unsplash.com/photo-1509941943102-10c232535736?auto=format&fit=crop&q=80&w=1000"
];

const categories = ["Men", "Women", "Unisex"];

const generateProducts = (count) => {
  const products = [];
  for (let i = 0; i < count; i++) {
    const name = `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${watchNames[Math.floor(Math.random() * watchNames.length)]}`;
    const price = (Math.random() * 4000 + 100).toFixed(2);
    const image = images[i % images.length];
    const category = categories[i % categories.length];
    const description = `A stunning ${category.toLowerCase()} watch featuring a ${adjectives[Math.floor(Math.random() * adjectives.length)].toLowerCase()} design. Perfect for any occasion.`;
    const features = "Sapphire Crystal\nSwiss Movement\nWater Resistant 100m\n5 Year Warranty";

    products.push({ name, price, image, description, features, category });
  }
  return products;
};

const productsToInsert = generateProducts(50);

db.serialize(() => {
  const stmt = db.prepare("INSERT INTO products (name, price, image, description, features, category) VALUES (?, ?, ?, ?, ?, ?)");
  
  productsToInsert.forEach(p => {
    stmt.run(p.name, p.price, p.image, p.description, p.features, p.category);
  });

  stmt.finalize((err) => {
    if (err) {
      console.error("Error seeding products:", err);
    } else {
      console.log(`Successfully added ${productsToInsert.length} products.`);
    }
    db.close();
  });
});

import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new sqlite3.Database(join(__dirname, 'database.sqlite'));

// Working Unsplash images for different watch categories
const categoryImages = {
  'Smart Watches': [
    'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&h=600&fit=crop', // Apple Watch
    'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&h=600&fit=crop', // Smart watch
  ],
  'Digital & LED': [
    'https://images.unsplash.com/photo-1587836374775-37d2b9dfc2c8?w=500&h=600&fit=crop', // G-Shock style
    'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=500&h=600&fit=crop', // Digital watch
    'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=500&h=600&fit=crop', // LED watch
  ],
  'Luxury Copies': [
    'https://images.unsplash.com/photo-1587836374775-37d2b9dfc2c8?w=500&h=600&fit=crop',
    'https://images.unsplash.com/photo-1611529982904-7ab1f6f8b10d?w=500&h=600&fit=crop',
  ]
};

console.log('Updating product images with working Unsplash URLs...\n');

db.all('SELECT id, name, category FROM products', [], (err, products) => {
  if (err) {
    console.error('Error:', err);
    db.close();
    return;
  }

  console.log(`Found ${products.length} products\n`);

  let updated = 0;
  let processed = 0;

  products.forEach(product => {
    const category = product.category;
    let imageUrl = null;

    // Assign images based on category
    if (category && categoryImages[category]) {
      const images = categoryImages[category];
      imageUrl = images[Math.floor(Math.random() * images.length)];
    }
    // For products without specific category images, use generic watch images
    else if (category) {
      const genericImages = [
        'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500&h=600&fit=crop',
        'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=500&h=600&fit=crop',
        'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=500&h=600&fit=crop',
      ];
      imageUrl = genericImages[Math.floor(Math.random() * genericImages.length)];
    }

    if (imageUrl) {
      db.run('UPDATE products SET image = ? WHERE id = ?', [imageUrl, product.id], function(updateErr) {
        processed++;
        
        if (updateErr) {
          console.error(`✗ Failed to update ${product.name}:`, updateErr);
        } else {
          console.log(`✓ Updated "${product.name}" (${product.category})`);
          updated++;
        }

        // Close DB after last product
        if (processed >= products.length) {
          console.log(`\n✅ Successfully updated ${updated} out of ${products.length} products!`);
          db.close();
        }
      });
    } else {
      processed++;
      if (processed >= products.length) {
        console.log(`\n✅ Successfully updated ${updated} out of ${products.length} products!`);
        db.close();
      }
    }
  });
});

import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new sqlite3.Database(join(__dirname, 'database.sqlite'));

// High-quality watch images from Unsplash for Digital & LED watches
const digitalWatchImages = {
  'Smart Watches': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1000',
  'Digital & LED': 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&q=80&w=1000',
  'Luxury Copies': 'https://images.unsplash.com/photo-1526045612212-70caf35c14df?auto=format&fit=crop&q=80&w=1000',
};

const additionalImages = [
  'https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?auto=format&fit=crop&q=80&w=1000', // Fitness tracker
  'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&q=80&w=1000', // Digital sports watch
  'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?auto=format&fit=crop&q=80&w=1000', // LED watch
];

console.log('Starting image update for Digital & LED category products...\n');

db.all('SELECT id, name, category, image FROM products', [], (err, products) => {
  if (err) {
    console.error('Error fetching products:', err);
    db.close();
    return;
  }

  console.log(`Found ${products.length} products total\n`);

  let updated = 0;
  let imageIndex = 0;

  products.forEach(product => {
    const needsImage = !product.image || product.image === '';
    const isDigitalOrLED = product.category && (
      product.category.includes('Digital') || 
      product.category.includes('LED') || 
      product.category.includes('Smart') ||
      product.category.includes('Luxury')
    );

    if (needsImage || isDigitalOrLED) {
      // Choose image based on category or use additional images
      let imageUrl = digitalWatchImages[product.category] || additionalImages[imageIndex % additionalImages.length];
      imageIndex++;

      db.run('UPDATE products SET image = ? WHERE id = ?', [imageUrl, product.id], function(updateErr) {
        if (updateErr) {
          console.error(`✗ Failed to update ${product.name}:`, updateErr);
        } else {
          console.log(`✓ Updated "${product.name}" (${product.category}) with image`);
          updated++;
        }

        // Close DB after last product
        if (updated + imageIndex >= products.length) {
          console.log(`\n\nSuccessfully updated ${updated} products!`);
          db.close();
        }
      });
    }
  });

  if (updated === 0) {
    console.log('No products needed image updates.');
    db.close();
  }
});

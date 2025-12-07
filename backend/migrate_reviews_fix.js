import db from './database.js';

console.log('Migrating Reviews Table...');

const columnsToAdd = [
  { name: 'user_email', type: 'TEXT' },
  { name: 'title', type: 'TEXT' },
  { name: 'verified_purchase', type: 'INTEGER DEFAULT 0' }
];

columnsToAdd.forEach(col => {
  db.run(`ALTER TABLE reviews ADD COLUMN ${col.name} ${col.type}`, (err) => {
    if (err && err.message.includes('duplicate column')) {
      console.log(`Column ${col.name} already exists.`);
    } else if (err) {
      console.error(`Error adding ${col.name}:`, err.message);
    } else {
      console.log(`Added column ${col.name} to reviews.`);
    }
  });
});

// server/scripts/cleanAttractions.js

const fs = require('fs');
const path = require('path');

// point at data/ instead of project root
const RAW_FILE = path.join(__dirname, '..', 'data', 'attractions.json');
const OUT_FILE = path.join(__dirname, '..', 'data', 'cleanedAttractions.json');

// mapping any non‑enum to your schema’s enum
const categoryMap = {
    Garden:       'Parks',
    Lake:         'Landmarks',
    'Wildlife Sanctuary': 'Other',
    Monument:     'Landmarks',
    Theatre:      'Entertainment',
    Cultural:     'Museums',
    'Amusement Park': 'Entertainment',
    'Shopping Mall':  'Shopping',
    Temple:       'Religious Sites',
    Sports:       'Entertainment',
    Park:         'Parks',
    Museum:       'Museums',          // ✅ Add this line
  };
const VALID_CATEGORIES = new Set([
  'Landmarks',
  'Museums',
  'Parks',
  'Entertainment',
  'Religious Sites',
  'Shopping',
  'Tours',
  'Other'
]);

const data = JSON.parse(fs.readFileSync(RAW_FILE, 'utf8'));

const cleaned = data.map((attr) => {
  // 1) Fix category
  let cat = attr.category;
  if (!VALID_CATEGORIES.has(cat) && categoryMap[cat]) {
    cat = categoryMap[cat];
  }

  // 2) Ensure placeholders
  const mainImage         = attr.mainImage         || '/images/placeholder.jpg';
  const mainImagePublicId = attr.mainImagePublicId || 'placeholder_public_id';

  return {
    ...attr,
    category: cat,
    mainImage,
    mainImagePublicId
  };
});

fs.writeFileSync(OUT_FILE, JSON.stringify(cleaned, null, 2));
console.log(`✅ Written ${cleaned.length} entries to ${OUT_FILE}`);

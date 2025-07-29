const mongoose = require('mongoose');
const fs = require('fs');
const dotenv = require('dotenv');
const slugify = require('slugify');
const Model = require('./models/Attraction'); // adjust if needed

dotenv.config(); // Load MONGO_URI

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    const data = await Model.find();
    
    const filteredData = data.filter(e => e.featured);

    const names = filteredData.map(e => ({
      name: e.name,
      description: e.description,
      rating: e.rating,
      slug : e.slug
    }));

    console.log('✅ Featured items:', names.length);
    console.log(names); // Optional

    // Optional: Write to a JSON file
    fs.writeFileSync('featured_attractions.json', JSON.stringify(names, null, 2));
    console.log('✅ Data written to featured_attractions.json');

    process.exit();
  } catch (err) {
    console.error('❌ Error during operation:', err.message);
    process.exit(1);
  }
};

run();

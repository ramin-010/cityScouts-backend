const mongoose = require('mongoose');
const fs = require('fs');
const dotenv = require('dotenv');
const slugify = require('slugify');
const Dining = require('./models/Event'); // adjust path to your model

dotenv.config(); // only if using .env for MONGO_URI

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI );

    const data = JSON.parse(fs.readFileSync('./data/attractions.json', 'utf-8'));
    let a = 0;
    for (const item of data) {
      a++;
      const exists = await Dining.findOne({ name: item.name });
      if (exists) {
        console.log(`⏭️  Skipping duplicate: ${item.name}`);
        continue;
      }
      await Dining.create(item);
      console.log(`✅${a} : Inserted: ${item.name}`);
    }

    console.log('✅ All done.');
    process.exit();
  } catch (err) {
    console.error('❌ Error during seeding:', err.message);
    process.exit(1);
  }
};

run();


// const exists = await Attraction.findOne({ name: item.name });
// if (exists) {
//   console.log(`⏭️  Skipping duplicate: ${item.name}`);
//   continue;
// }
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Model = require('./models/User'); // adjust path if needed

dotenv.config(); // load .env for MONGO_URI

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');


    // Rename `featured` to `isFeatured` in all documents where it exists
    const result = await Model.updateMany(
      {}, // Match all documents
      { 
        $set: { 
          mainImage: '#'
        } 
      }
    );

    console.log(`🎉 Renamed field in ${result.modifiedCount} documents.`);

    mongoose.connection.close();
  } catch (err) {
    console.error("❌ Error updating field names:", err);
    mongoose.connection.close();
  }
};

run();

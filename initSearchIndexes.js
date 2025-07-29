const mongoose = require('mongoose');
const { createSearchIndexes } = require('./controllers/search.controller');
const connectDB = require('./config/db');

async function initializeSearchIndexes() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI );    
    console.log('Creating search indexes...');
    await createSearchIndexes();
    
    console.log('Successfully created all search indexes');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing search indexes:', error);
    process.exit(1);
  }
}

// Execute the function
initializeSearchIndexes();

const mongoose = require('mongoose')
require('dotenv').config();

const connectDB = async() =>{
    const mongoUri = process.env.MONGO_URI;
    if(!mongoUri){
        console.error('MongoDB connection error: MONGO_URI is not defined. Set it in your environment configuration.');
        process.exit(1);
    }

    try{
        const connection = await mongoose.connect(mongoUri)
        console.log(`MongoDB connected successfully`)
    }catch(err){
        console.error(`MongoDB connection error: ${err.message}`)
        process.exit(1);
    }
};

module.exports = connectDB;
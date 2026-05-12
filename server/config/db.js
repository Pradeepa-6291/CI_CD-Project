const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {

  // ✅ Reuse existing connection
  if (isConnected) {
    console.log('✅ Using existing MongoDB connection');
    return;
  }

  try {

    const conn = await mongoose.connect(process.env.MONGO_URI, {

      serverSelectionTimeoutMS: 10000,

      // Recommended for Lambda
      bufferCommands: false,
    });

    isConnected = true;

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

  } catch (error) {

    console.error(`❌ MongoDB Connection Failed: ${error.message}`);

    throw error;
  }
};

module.exports = connectDB;
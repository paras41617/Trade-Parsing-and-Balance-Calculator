const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const MONGO_DETAILS = process.env.DATABASE_URL;
    await mongoose.connect(MONGO_DETAILS);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
};

module.exports = connectDB;

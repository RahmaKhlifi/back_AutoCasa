const mongoose = require('mongoose');
const initializeDb = require('./initDb');

// Replace this with your MongoDB Atlas URI or local MongoDB URI
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://oubaidloukil:oubaid2002@cluster0.y6pm9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
    console.log(`MongoDB Host: ${conn.connection.host}`);
    console.log(`MongoDB Database: ${conn.connection.name}`);

    // Initialize database with test data
    await initializeDb();
    
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    console.error(err);
    process.exit(1);
  }
};

module.exports = connectDB;

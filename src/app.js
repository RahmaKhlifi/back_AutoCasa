require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); // MongoDB connection
const authRoutes = require('./routes/authRoutes'); // Auth routes
const roomRoutes = require('./routes/roomRoutes'); // Room routes
const deviceRoutes = require('./routes/deviceRoutes'); // Device routes
const userRoutes = require('./routes/userRoutes'); // User routes

const app = express();

// Updated CORS configuration
app.use(cors({
  origin: 'http://localhost:3000', // Your frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Add headers middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    return res.status(200).json({});
  }
  next();
});

// Connect to MongoDB
connectDB();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/users', userRoutes);

// Example route (just for testing purposes)
app.get('/', (req, res) => {
  res.send('Welcome to AutoCasa Backend!');
});

// Default route for non-matched requests
app.use((req, res) => {
  res.status(404).send('Page not found');
});

// Set the port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

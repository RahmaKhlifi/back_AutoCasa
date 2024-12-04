const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); // MongoDB connection
const authRoutes = require('./routes/authRoutes'); // Auth routes
const roomRoutes = require('./routes/roomRoutes'); // Room routes
const deviceRoutes = require('./routes/deviceRoutes'); // Device routes

const app = express();

// Middleware
app.use(express.json()); // Parse JSON requests
app.use(cors()); // Enable CORS for all origins

// Connect to MongoDB
connectDB();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/devices', deviceRoutes);

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

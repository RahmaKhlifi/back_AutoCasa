const express = require('express');
const mongoose = require('mongoose');
const roomRoutes = require('./routes/roomRoutes');

const app = express();

app.use(express.json());  // For parsing application/json
app.use('/api/rooms', roomRoutes);  // Ensure rooms API is hooked up

// MongoDB connection and other server setup...

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
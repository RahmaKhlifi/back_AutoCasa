const express = require('express');
const router = express.Router();
const {
  getRooms,
  addRoom,
  getRoomDetails,
  getDevicesInRoom
} = require('../controllers/roomController');
const authMiddleware = require('../middleware/authMiddleware');

// Debug middleware
router.use((req, res, next) => {
  console.log('Room Route Headers:', req.headers);
  next();
});

// Apply auth middleware to all routes
router.use(authMiddleware);

// GET /api/rooms - Get all rooms
router.get('/', getRooms);

// POST /api/rooms - Create new room
router.post('/', addRoom);

// GET /api/rooms/:id - Get specific room
router.get('/:id', getRoomDetails);

// GET /api/rooms/:id/devices - Get devices in room
router.get('/:id/devices', getDevicesInRoom);

module.exports = router;
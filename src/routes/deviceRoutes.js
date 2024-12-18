const express = require('express');
const router = express.Router();
const {
  addDevice,
  updateDevice,
  getDevice,
  getDevicesByRoomId,
  deleteDevice
} = require('../controllers/deviceController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get devices by room ID
router.get('/room/:roomId', getDevicesByRoomId);

// Add device to room
router.post('/room/:roomId', addDevice);

// Update device
router.put('/:deviceId', updateDevice);

// Get single device
router.get('/:deviceId', getDevice);

// Delete device
router.delete('/:deviceId', deleteDevice);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  addDevice,
  updateDevice,
  getDevice,
} = require('../controllers/deviceController');
const authMiddleware = require('../middleware/authMiddleware');

// POST /api/devices - Add a new device to a room
router.post('/', authMiddleware, addDevice);

// PUT /api/devices/:deviceId - Update a device's attributes or state
router.put('/:deviceId', authMiddleware, updateDevice);

// GET /api/devices/:deviceId - Get a specific device by ID
router.get('/:deviceId', authMiddleware, getDevice);

module.exports = router;

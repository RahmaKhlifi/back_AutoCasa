const express = require('express');
const Room = require('../models/Room'); // Assuming you have a Room model
const router = express.Router();

// POST new room
router.post('/', async (req, res) => {
  const { name, description } = req.body;
  try {
    const newRoom = new Room({
      name,
      description,
    });
    await newRoom.save();
    res.status(201).json(newRoom);
  } catch (err) {
    console.error('Error adding room:', err);
    res.status(500).send('Server error');
  }
});

// Existing GET all rooms route
router.get('/', async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (err) {
    console.error('Error fetching rooms:', err);
    res.status(500).send('Server error');
  }
});
router.get('/:id', async (req, res) => {
      const roomId = req.params.id;
      try {
        const room = await Room.findById(roomId);  // Use roomId to find the room
        if (!room) {
          return res.status(404).json({ message: 'Room not found' });
        }
        res.json(room);
      } catch (err) {
        console.error('Error fetching room details:', err);
        res.status(500).send('Server error');
      }
    });
    const Device = require('../models/Device');  // Assuming you have a Device model

// GET devices for a specific room
router.get('/:id/devices', async (req, res) => {
  const roomId = req.params.id;
  try {
    const devices = await Device.find({ room: roomId });  // Find devices by roomId
    res.json(devices);
  } catch (err) {
    console.error('Error fetching devices for room:', err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
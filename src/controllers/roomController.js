const Room = require('../models/Room');
const Device = require('../models/Device');

// Get all rooms
exports.getRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    res.status(200).json(rooms);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({ message: 'Error fetching rooms' });
  }
};

// Add a new room
exports.addRoom = async (req, res) => {
  try {
    const newRoom = new Room(req.body);
    await newRoom.save();
    res.status(201).json(newRoom);  // Return the new room
  } catch (error) {
    console.error('Error adding room:', error);
    res.status(500).json({ message: 'Error adding room' });
  }
};

// Get details of a specific room
exports.getRoomDetails = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.status(200).json(room);  // Return room details
  } catch (error) {
    console.error('Error fetching room details:', error);
    res.status(500).json({ message: 'Error fetching room details' });
  }
};

// Get devices in a specific room
exports.getDevicesInRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    const devices = await Device.find({ roomId: room._id });
    res.status(200).json(devices);  // Return list of devices in room
  } catch (error) {
    console.error('Error fetching devices in room:', error);
    res.status(500).json({ message: 'Error fetching devices in room' });
  }
};

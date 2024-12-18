const Room = require('../models/Room');
const Device = require('../models/Device');

// Get all rooms
exports.getRooms = async (req, res) => {
  try {
    console.log('User ID from request:', req.user.id);
    
    const rooms = await Room.find({ 
      userId: req.user.id 
    }).populate('devices');
    
    console.log('Found rooms:', rooms);
    
    // Always return an array, even if empty
    res.status(200).json(rooms || []);
  } catch (error) {
    console.error('Error in getRooms:', error);
    res.status(500).json({ 
      message: 'Error fetching rooms',
      error: error.message 
    });
  }
};

// Add a new room
exports.addRoom = async (req, res) => {
  try {
    const newRoom = new Room({
      ...req.body,
      userId: req.user.id,
      devices: [] // Initialize with empty devices array
    });
    
    const savedRoom = await newRoom.save();
    res.status(201).json(savedRoom);
  } catch (error) {
    console.error('Error in addRoom:', error);
    res.status(500).json({ 
      message: 'Error adding room',
      error: error.message 
    });
  }
};

// Get room details
exports.getRoomDetails = async (req, res) => {
  try {
    const room = await Room.findOne({
      _id: req.params.id,
      userId: req.user.id
    }).populate('devices');
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    res.status(200).json(room);
  } catch (error) {
    console.error('Error in getRoomDetails:', error);
    res.status(500).json({ 
      message: 'Error fetching room details',
      error: error.message 
    });
  }
};

// Get devices in room
exports.getDevicesInRoom = async (req, res) => {
  try {
    const room = await Room.findOne({
      _id: req.params.id,
      userId: req.user.id
    }).populate('devices');
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    res.status(200).json(room.devices || []);
  } catch (error) {
    console.error('Error in getDevicesInRoom:', error);
    res.status(500).json({ 
      message: 'Error fetching devices',
      error: error.message 
    });
  }
};

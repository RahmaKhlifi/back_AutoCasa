const Device = require('../models/Device');
const Room = require('../models/Room');

exports.addDevice = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { name, category, status, powerConsumption } = req.body;

    // Validate room exists and belongs to user
    const room = await Room.findOne({ 
      _id: roomId,
      userId: req.user.id
    });

    if (!room) {
      return res.status(404).json({ message: 'Room not found or unauthorized' });
    }

    // Create new device
    const device = new Device({
      name,
      category,
      status,
      powerConsumption: parseInt(powerConsumption),
      roomId
    });

    // Save the device
    const savedDevice = await device.save();

    // Add device to room's devices array
    await Room.findByIdAndUpdate(
      roomId,
      { $push: { devices: savedDevice._id } },
      { new: true }
    );

    res.status(201).json(savedDevice);
  } catch (error) {
    console.error('Error adding device:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    res.status(500).json({ 
      message: 'Error adding device',
      error: error.message 
    });
  }
};

exports.getDevice = async (req, res) => {
  const { deviceId } = req.params;

  try {
    const device = await Device.findById(deviceId);
    if (!device) return res.status(404).json({ message: 'Device not found' });

    res.json(device);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching device' });
  }
};

exports.updateDevice = async (req, res) => {
  try {
    const { deviceId } = req.params;
    const updateData = req.body;

    const device = await Device.findByIdAndUpdate(
      deviceId,
      updateData,
      { new: true }
    );

    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }

    res.json(device);
  } catch (error) {
    console.error('Error updating device:', error);
    res.status(500).json({ 
      message: 'Error updating device',
      error: error.message 
    });
  }
};

exports.getDevicesByRoomId = async (req, res) => {
  try {
    const { roomId } = req.params;
    const devices = await Device.find({ roomId });
    res.json(devices);
  } catch (error) {
    console.error('Error fetching devices:', error);
    res.status(500).json({ 
      message: 'Error fetching devices',
      error: error.message 
    });
  }
};

exports.deleteDevice = async (req, res) => {
  try {
    const { deviceId } = req.params;

    // First find the device to get its roomId
    const device = await Device.findById(deviceId);
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }

    // Remove the device reference from the room
    await Room.findByIdAndUpdate(
      device.roomId,
      { $pull: { devices: deviceId } }
    );

    // Delete the device
    await Device.findByIdAndDelete(deviceId);

    res.status(200).json({ message: 'Device deleted successfully' });
  } catch (error) {
    console.error('Error deleting device:', error);
    res.status(500).json({ 
      message: 'Error deleting device',
      error: error.message 
    });
  }
};

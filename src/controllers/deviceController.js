const Device = require('../models/Device');
const Room = require('../models/Room');

exports.addDevice = async (req, res) => {
  const { roomId, name, category, status } = req.body;

  try {
    const newDevice = await Device.create({ name, category, status, roomId });
    await Room.findByIdAndUpdate(roomId, { $push: { devices: newDevice._id } });

    res.status(201).json(newDevice);
  } catch (error) {
    res.status(500).json({ message: 'Error adding device' });
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
  const { deviceId } = req.params;
  const updatedData = req.body;

  try {
    const updatedDevice = await Device.findByIdAndUpdate(deviceId, updatedData, {
      new: true,
    });
    res.json(updatedDevice);
  } catch (error) {
    res.status(500).json({ message: 'Error updating device' });
  }
};

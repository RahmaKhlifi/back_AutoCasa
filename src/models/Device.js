const mongoose = require('mongoose');

const DeviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  status: { type: String, default: 'Off' },
  powerConsumption: { 
    type: Number, 
    required: true,
    min: 100,
    max: 3000,
    validate: {
      validator: Number.isInteger,
      message: 'Power consumption must be an integer'
    }
  },
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Device', DeviceSchema);

const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['regular', 'security'], default: 'regular' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  devices: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Device' }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Room', RoomSchema);

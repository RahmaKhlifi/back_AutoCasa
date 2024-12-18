const User = require('../models/User');
const Room = require('../models/Room');
const Device = require('../models/Device');

exports.getUserStats = async (req, res) => {
  try {
    // Get rooms count
    const roomsCount = await Room.countDocuments({ userId: req.user.id });

    // Get all rooms for this user
    const rooms = await Room.find({ userId: req.user.id });
    
    // Get devices count from all user's rooms
    const devicesCount = await Device.countDocuments({
      roomId: { $in: rooms.map(room => room._id) }
    });

    // Get devices by category
    const devicesByCategory = await Device.aggregate([
      {
        $match: {
          roomId: { $in: rooms.map(room => room._id) }
        }
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get active devices count and total power consumption
    const [powerStats] = await Device.aggregate([
      {
        $match: {
          roomId: { $in: rooms.map(room => room._id) }
        }
      },
      {
        $group: {
          _id: null,
          activeDevices: {
            $sum: { $cond: [{ $eq: ['$status', 'On'] }, 1, 0] }
          },
          totalPowerConsumption: { $sum: '$powerConsumption' },
          activePowerConsumption: {
            $sum: {
              $cond: [
                { $eq: ['$status', 'On'] },
                '$powerConsumption',
                0
              ]
            }
          }
        }
      }
    ]) || { activeDevices: 0, totalPowerConsumption: 0, activePowerConsumption: 0 };

    // Get user info
    const user = await User.findById(req.user.id).select('-password');

    res.json({
      user,
      stats: {
        totalRooms: roomsCount,
        totalDevices: devicesCount,
        activeDevices: powerStats.activeDevices,
        devicesByCategory: devicesByCategory,
        powerConsumption: {
          total: powerStats.totalPowerConsumption,
          active: powerStats.activePowerConsumption
        }
      }
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ 
      message: 'Error fetching user statistics',
      error: error.message 
    });
  }
}; 
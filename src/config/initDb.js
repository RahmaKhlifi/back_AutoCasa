const mongoose = require('mongoose');
const Room = require('../models/Room');
const Device = require('../models/Device');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const initializeDb = async () => {
  try {
    // Clear existing data
    await Room.deleteMany({});
    await Device.deleteMany({});
    await User.deleteMany({});

    // Create a test user
    const hashedPassword = await bcrypt.hash('test123', 10);
    const user = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: hashedPassword
    });

    // Create some rooms
    const livingRoom = await Room.create({
      name: 'Living Room',
      userId: user._id
    });

    const bedroom = await Room.create({
      name: 'Bedroom',
      userId: user._id
    });

    const kitchen = await Room.create({
      name: 'Kitchen',
      userId: user._id
    });

    // Create some devices
    await Device.create([
      {
        name: 'Main Light',
        category: 'Lighting',
        status: 'Off',
        roomId: livingRoom._id
      },
      {
        name: 'TV',
        category: 'Entertainment',
        status: 'Off',
        roomId: livingRoom._id
      },
      {
        name: 'AC',
        category: 'Climate',
        status: 'Off',
        roomId: bedroom._id
      },
      {
        name: 'Kitchen Light',
        category: 'Lighting',
        status: 'Off',
        roomId: kitchen._id
      }
    ]);

    console.log('Database initialized with test data');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

module.exports = initializeDb;
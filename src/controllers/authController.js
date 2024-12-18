const User = require('../models/User'); // User model
const Room = require('../models/Room');
const Device = require('../models/Device');
const bcrypt = require('bcryptjs'); // For password hashing
const jwt = require('jsonwebtoken'); // For generating JWT tokens

async function setupSecuritySystem(userId) {
  try {
    // Create Security Room
    const securityRoom = await Room.create({
      name: 'Security System',
      type: 'security',
      userId: userId
    });

    // Create default security devices
    const securityDevices = [
      {
        name: 'Main Alarm System',
        category: 'Security',
        status: 'On',
        powerConsumption: 500,
        roomId: securityRoom._id
      },
      {
        name: 'Front Door Camera',
        category: 'Security',
        status: 'On',
        powerConsumption: 200,
        roomId: securityRoom._id
      },
      {
        name: 'Back Door Camera',
        category: 'Security',
        status: 'On',
        powerConsumption: 200,
        roomId: securityRoom._id
      },
      {
        name: 'Motion Sensor System',
        category: 'Security',
        status: 'On',
        powerConsumption: 300,
        roomId: securityRoom._id
      }
    ];

    // Create all security devices
    const devices = await Device.create(securityDevices);

    // Add devices to security room
    await Room.findByIdAndUpdate(
      securityRoom._id,
      { $push: { devices: { $each: devices.map(d => d._id) } } }
    );

    return securityRoom;
  } catch (error) {
    console.error('Error setting up security system:', error);
    throw error;
  }
}

// Register a new user
exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    // Save the user to the database
    const savedUser = await newUser.save();

    // Set up security system for the new user
    await setupSecuritySystem(savedUser._id);

    res.status(201).json({ message: 'User registered successfully with security system' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login user
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create token
    const token = jwt.sign(
      { 
        userId: user._id,
        email: user.email 
      },
      'secretkey',
      { expiresIn: '24h' }
    );

    // Send response with token and user data
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
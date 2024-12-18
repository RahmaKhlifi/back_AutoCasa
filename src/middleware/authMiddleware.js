const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    // Log all headers for debugging
    console.log('All Headers:', req.headers);
    
    const authHeader = req.header('Authorization');
    console.log('Auth Header:', authHeader);

    const token = authHeader?.replace('Bearer ', '');
    console.log('Extracted Token:', token);

    if (!token) {
      return res.status(401).json({ 
        message: 'No token provided',
        headers: req.headers // Include headers in response for debugging
      });
    }

    const decoded = jwt.verify(token, 'secretkey');
    console.log('Decoded Token:', decoded);
    
    req.user = {
      id: decoded.userId,
      email: decoded.email
    };

    console.log('Auth middleware user:', req.user);
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ 
      message: 'Invalid token',
      error: error.message
    });
  }
};

module.exports = authMiddleware;

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Secret key for JWT. In a real app, use process.env.JWT_SECRET
const JWT_SECRET = process.env.JWT_SECRET || 'dream_cream_super_secret_key_2024';

// Generate JWT token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, JWT_SECRET, { expiresIn: '30d' });
};

// @route   POST /api/auth/register
// @desc    Register a new user
router.post('/register', async (req, res) => {
  try {
    const { email, password, displayName } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create new user (role defaults to 'customer')
    const user = await User.create({
      email,
      password,
      displayName
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        displayName: user.displayName,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// @route   POST /api/auth/login
// @desc    Auth user & get token
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      res.json({
        _id: user._id,
        displayName: user.displayName,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// @route   POST /api/auth/google
// @desc    Auth user with Google/Firebase token
router.post('/google', async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ message: 'Token is required' });

    // In a production app, you MUST verify the token using firebase-admin
    // const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    // For now, we will decode the token to get the user info.
    // NOTE: This is NOT secure without verification! 
    // The user should set up firebase-admin for real production use.
    const decodedToken = jwt.decode(idToken);
    
    if (!decodedToken || !decodedToken.email) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const { email, name, picture } = decodedToken;

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user if they don't exist
      user = await User.create({
        email,
        displayName: name || email.split('@')[0],
        // password is not set for Google users
      });
    }

    res.json({
      _id: user._id,
      displayName: user.displayName,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({ message: 'Server error during Google login' });
  }
});

module.exports = router;

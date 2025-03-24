const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Register User
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists) return res.status(400).json({ message: 'User already exists' });

  const user = await User.create({ name, email, password, role, favorites: [] });
  res.status(201).json({ message: 'User created successfully' });
});

// Login User
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user._id, role: user.role, name: user.name }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  res.json({ token, role: user.role, name: user.name, userId: user._id, favorites: user.favorites });
});

// Get all users (excluding passwords)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Add to Favorites
router.post('/add-favorite', async (req, res) => {
  try {
    const { userId, productId } = req.body;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.favorites.includes(productId)) {
      user.favorites.push(productId);
      await user.save();
    }

    res.json({ message: 'Added to favorites', favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Remove from Favorites
router.post('/remove-favorite', async (req, res) => {
  try {
    const { userId, productId } = req.body;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: 'User not found' });

    user.favorites = user.favorites.filter(id => id.toString() !== productId);
    await user.save();

    res.json({ message: 'Removed from favorites', favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Get User's Favorites
router.get('/favorites/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('favorites');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

require('dotenv').config();

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, mdp, prenom, nom, pays, telephone } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(mdp, salt);
    

    const newUser = new User({
      email,
      mdp : hash,
      prenom,
      nom,
      pays,
      telephone,
      isActive: true,
      avatar: 'avatar.jpg'
    });

    await newUser.save();
    res.status(201).json({ success: true, message: 'Account created successfully', user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// Get User by Email
 router.get('/:email', async (req, res) => {
   try {
     const userEmail = req.params.email;
     const user = await User.findOne({ email: userEmail });

     if (!user) {
       return res.status(404).json({ success: false, message: 'User not found found' });
     }

     res.status(200).json({ success: true, user });
   } catch (error) {
     console.error(error);
     res.status(500).json({ success: false, message: 'Internal Server Error' });
   }
 });

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, mdp } = req.body;
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(mdp, user.mdp))) {
      // Login successful
      const token = generateAccessToken(user);

      // Include user information in the response
      res.status(200).json({ success: true, token, user: { email: user.email  } });
    } else {
      // Login failed
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});





// Generate Access Token
const generateAccessToken = (user) => {
  return jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
};

module.exports = router;

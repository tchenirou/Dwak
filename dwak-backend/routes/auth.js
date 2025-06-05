// routes/auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/user');

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(400).json({ error: 'Email ou mot de passe incorrect' });
    }

    // User found and password matches
    const token = jwt.sign(
      { userId: user._id, role: user.role }, // Payload
      process.env.JWT_SECRET, // Secret key (loaded from .env)
      { expiresIn: '7d' } // Set the expiration time (7 days)
    );

    // Send the token in the response
    res.status(200).json({
      message: 'Connexion réussie',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token, // Send the token back to the frontend
    });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');

// Login page
router.get('/login', (req, res) => {
    res.render('login');
});

// Register page
router.get('/register', (req, res) => {
    res.render('login');
});

// Login user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Create session
        req.session.userId = user._id.toString();
        req.session.userEmail = user.email;

        res.json({ success: true, redirect: '/dashboard' });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Register user
router.post('/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            email,
            password: hashedPassword,
            name: name || email.split('@')[0]
        });

        // Create session
        req.session.userId = user._id.toString();
        req.session.userEmail = user.email;

        res.json({ success: true, redirect: '/dashboard' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// Create session (for compatibility)
router.post('/createSession', (req, res) => {
    const { userId } = req.body;
    req.session.userId = userId;
    res.json({ success: true });
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

// Get current user info
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.session.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({
            userId: user._id,
            email: user.email,
            name: user.name,
            isNewUser: false
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});

// Update user profile
router.post('/updateProfile', authMiddleware, async (req, res) => {
    try {
        const userId = req.session.userId;
        const { name, bio, skills, interests } = req.body;

        await User.findByIdAndUpdate(userId, {
            name,
            bio,
            skills: skills ? (Array.isArray(skills) ? skills : skills.split(',')) : [],
            interests: interests ? (Array.isArray(interests) ? interests : interests.split(',')) : [],
            updatedAt: new Date()
        });

        res.json({ success: true, message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

module.exports = router;
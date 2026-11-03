const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { z } = require('zod');
const rateLimit = require("express-rate-limit");
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');

// CSRF middleware - validate Origin header for state-changing requests
// Task 2: CSRF protection - Origin header validation for browser-based requests
const csrfMiddleware = (req, res, next) => {
    // Skip CSRF for non-browser requests (no Origin header) or non-state-changing methods
    if (!req.headers.origin) {
        return next();
    }

    const allowedOrigins = process.env.ALLOWED_ORIGINS
        ? process.env.ALLOWED_ORIGINS.split(',')
        : [];

    // In development, allow localhost origins
    const isDevelopment =
        !allowedOrigins.length ||
        allowedOrigins.some((origin) =>
            origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')
        );

    // Allow if:
    // 1. Development mode with localhost origin, OR
    // 2. Production origin is explicitly allowed
    const originIsAllowed =
        isDevelopment ||
        allowedOrigins.includes(req.headers.origin);

    if (originIsAllowed) {
        return next();
    }

    // Origin not allowed - CSRF rejection
    return res.status(403).json({ error: 'CSRF validation failed' });
};

// Login page
router.get('/login', (req, res) => {
    res.render('login');
});

// Register page
router.get('/register', (req, res) => {
    res.render('login');
});

// Login validation schema
const loginSchema = z.object({
    email: z.string().email({ message: 'Must be a valid email' }).trim(),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }).trim(),
});

// Register validation schema
const registerSchema = z.object({
    email: z.string().email({ message: 'Must be a valid email' }).trim(),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }).trim(),
    name: z.string().trim().optional(),
});

// Rate limiters for authentication endpoints
const authLimiter = {
    login: (req, res, next) => {
        rateLimit({
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 5, // 5 login attempts per 15 minutes
            standardHeaders: true,
            legacyHeaders: false,
        })(req, res, next);
    },
    register: (req, res, next) => {
        rateLimit({
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 10, // 10 registration attempts per 15 minutes
            standardHeaders: true,
            legacyHeaders: false,
        })(req, res, next);
    },
};

// Login user
router.post('/login', authLimiter.login, async (req, res) => {
    try {
        const result = loginSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ error: result.error.errors[0].message });
        }

        const { email, password } = result.data;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        req.session.userId = user._id.toString();
        req.session.userEmail = user.email;

        res.json({ success: true, redirect: '/dashboard' });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Register user
router.post('/register', authLimiter.register, async (req, res) => {
    try {
        const result = registerSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ error: result.error.errors[0].message });
        }

        const { email, password, name } = result.data;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            email,
            password: hashedPassword,
            name: name || email.split('@')[0]
        });

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
router.post('/updateProfile', authMiddleware, csrfMiddleware, async (req, res) => {
    try {
        const userId = req.session.userId;

        const profileSchema = z.object({
            name: z.string().trim().optional(),
            bio: z.string().trim().optional(),
            skills: z.array(z.string()).optional(),
            interests: z.array(z.string()).optional(),
        });

        const result = profileSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ error: result.error.errors[0].message });
        }

        const { name, bio, skills, interests } = result.data;

        await User.findByIdAndUpdate(userId, {
            name,
            bio,
            skills: skills || [],
            interests: interests || [],
            updatedAt: new Date(),
        });

        res.json({ success: true, message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

module.exports = router;

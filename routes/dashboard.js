const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const userService = require('../services/userService');

// Dashboard page
router.get('/dashboard', authMiddleware, async (req, res) => {
    try {
        const userId = req.session.userId;
        const stats = await userService.getUserStats(userId);
        
        res.render('dashboard', { stats });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).send('Error loading dashboard');
    }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const userService = require('../services/userService');
const Achievement = require('../models/Achievement');

// Profile page
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const userId = req.session.userId;
        const stats = await userService.getUserStats(userId);
        const bookmarks = await userService.getBookmarks(userId);
        
        res.render('profile', { stats, bookmarks });
    } catch (error) {
        console.error('Profile error:', error);
        res.status(500).send('Error loading profile');
    }
});

// Get achievements
router.get('/achievements', authMiddleware, async (req, res) => {
    try {
        const userId = req.session.userId;
        
        const achievements = await Achievement.find({ userId })
            .sort({ date: -1 });

        res.render('achievements', { achievements });
    } catch (error) {
        console.error('Error fetching achievements:', error);
        res.status(500).send('Error loading achievements');
    }
});

// Get user notes
router.get('/my-notes', authMiddleware, async (req, res) => {
    try {
        const userId = req.session.userId;
        const notes = await userService.getNotes(userId);
        
        res.render('notes', { notes });
    } catch (error) {
        console.error('Error fetching notes:', error);
        res.status(500).send('Error loading notes');
    }
});

module.exports = router;
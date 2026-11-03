const express = require('express');
const router = express.Router();
const { z } = require('zod');
const { authMiddleware } = require('../middleware/auth');
const userService = require('../services/userService');
const aiService = require('../services/aiService');
const Achievement = require('../models/Achievement');
const Bookmark = require('../models/Bookmark');
const Note = require('../models/Note');

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

    // Reject requests from unauthorized origins
    return res.status(403).json({ error: 'CSRF validation failed' });
};

// Get user progress
router.get('/progress', authMiddleware, async (req, res) => {
    try {
        const userId = req.session.userId;
        const progress = await userService.getUserProgress(userId);
        res.json(progress);
    } catch (error) {
        console.error('Error fetching progress:', error);
        res.status(500).json({ error: 'Failed to fetch progress' });
    }
});

// Get user stats
router.get('/stats', authMiddleware, async (req, res) => {
    try {
        const userId = req.session.userId;
        const stats = await userService.getUserStats(userId);
        res.json(stats);
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
});

// Get all courses
router.get('/courses', (req, res) => {
    const courses = [
        {
            id: 'java',
            title: 'Java with OOPs',
            description: 'Learn Java programming from basics to advanced OOP concepts',
            icon: '☕',
            level: 'Beginner to Advanced'
        },
        {
            id: 'python',
            title: 'Python Programming',
            description: 'Master Python for web development, data science, and automation',
            icon: '🐍',
            level: 'Beginner to Advanced'
        },
        {
            id: 'web',
            title: 'Web Development',
            description: 'Build modern websites with HTML, CSS, and JavaScript',
            icon: '🌐',
            level: 'Beginner to Advanced'
        }
    ];
    res.json({ courses });
});

// Get course details
router.get('/courses/:courseId', authMiddleware, async (req, res) => {
    try {
        const { courseId } = req.params;
        res.json({ 
            courseId,
            message: 'Course details endpoint'
        });
    } catch (error) {
        console.error('Error fetching course:', error);
        res.status(500).json({ error: 'Failed to fetch course' });
    }
});

// Get user achievements
router.get('/achievements', authMiddleware, async (req, res) => {
    try {
        const userId = req.session.userId;
        
        const achievements = await Achievement.find({ userId })
            .sort({ date: -1 });

        res.json({ achievements });
    } catch (error) {
        console.error('Error fetching achievements:', error);
        res.status(500).json({ error: 'Failed to fetch achievements' });
    }
});

// Get bookmarks
router.get('/bookmarks', authMiddleware, async (req, res) => {
    try {
        const userId = req.session.userId;
        const bookmarks = await userService.getBookmarks(userId);
        res.json({ bookmarks });
    } catch (error) {
        console.error('Error fetching bookmarks:', error);
        res.status(500).json({ error: 'Failed to fetch bookmarks' });
    }
});

// Add bookmark
router.post('/bookmarks', authMiddleware, csrfMiddleware, async (req, res) => {
    try {
        // Validate request body
        const bookmarkSchema = z.object({
            type: z.string().trim(),
            itemId: z.string().trim(),
            title: z.string().trim(),
        });

        const result = bookmarkSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ error: result.error.errors[0].message });
        }

        const { type, itemId, title } = result.data;

        await userService.addBookmark(req.session.userId, type, itemId, title);
        res.json({ success: true, message: 'Bookmark added' });
    } catch (error) {
        console.error('Error adding bookmark:', error);
        res.status(500).json({ error: 'Failed to add bookmark' });
    }
});

// Remove bookmark
router.delete('/bookmarks/:itemId', authMiddleware, csrfMiddleware, async (req, res) => {
    try {
        const userId = req.session.userId;
        const { itemId } = req.params;

        await userService.removeBookmark(userId, itemId);
        res.json({ success: true, message: 'Bookmark removed' });
    } catch (error) {
        console.error('Error removing bookmark:', error);
        res.status(500).json({ error: 'Failed to remove bookmark' });
    }
});

// Get notes
router.get('/notes', authMiddleware, async (req, res) => {
    try {
        const userId = req.session.userId;
        const { courseId } = req.query;
        const notes = await userService.getNotes(userId, courseId);
        res.json({ notes });
    } catch (error) {
        console.error('Error fetching notes:', error);
        res.status(500).json({ error: 'Failed to fetch notes' });
    }
});

// Save note
router.post('/notes', authMiddleware, csrfMiddleware, async (req, res) => {
    try {
        // Validate request body
        const noteSchema = z.object({
            courseId: z.string().trim(),
            lessonId: z.number().int(),
            content: z.string().trim(),
        });

        const result = noteSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ error: result.error.errors[0].message });
        }

        const { courseId, lessonId, content } = result.data;

        await userService.saveNote(req.session.userId, courseId, lessonId, content);
        res.json({ success: true, message: 'Note saved' });
    } catch (error) {
        console.error('Error saving note:', error);
        res.status(500).json({ error: 'Failed to save note' });
    }
});

// AI Career recommendations
router.post('/recommendations', authMiddleware, csrfMiddleware, async (req, res) => {
    try {
        const { skills, interests, education } = req.body;
        const recommendations = await aiService.getCareerRecommendations(
            skills, 
            interests, 
            education
        );
        res.json(recommendations);
    } catch (error) {
        console.error('Error generating recommendations:', error);
        res.status(500).json({ error: 'Failed to generate recommendations' });
    }
});

// Health check
router.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        version: '2.0.0'
    });
});

module.exports = { csrfMiddleware, authMiddleware, userService, aiService, Achievement, Bookmark, Note };
const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const lessonService = require('../services/lessonService');
const userService = require('../services/userService');

// Generate a new lesson with AI
router.post('/generate', authMiddleware, async (req, res) => {
    try {
        const { topic, difficulty } = req.body;
        
        if (!topic) {
            return res.status(400).json({ error: 'Topic is required' });
        }

        const lesson = await lessonService.generateLesson(topic, difficulty || 'beginner');
        
        res.json({
            success: true,
            lesson
        });
    } catch (error) {
        console.error('Error generating lesson:', error);
        res.status(500).json({ error: 'Failed to generate lesson' });
    }
});

// Generate course syllabus
router.post('/syllabus', authMiddleware, async (req, res) => {
    try {
        const { courseName, totalLessons } = req.body;
        
        if (!courseName) {
            return res.status(400).json({ error: 'Course name is required' });
        }

        const syllabus = await lessonService.generateCourseSyllabus(
            courseName, 
            totalLessons || 10
        );
        
        res.json({
            success: true,
            syllabus
        });
    } catch (error) {
        console.error('Error generating syllabus:', error);
        res.status(500).json({ error: 'Failed to generate syllabus' });
    }
});

// Generate quiz
router.post('/quiz', authMiddleware, async (req, res) => {
    try {
        const { topic, numQuestions } = req.body;
        
        if (!topic) {
            return res.status(400).json({ error: 'Topic is required' });
        }

        const quiz = await lessonService.generateQuiz(topic, numQuestions || 10);
        
        res.json({
            success: true,
            quiz
        });
    } catch (error) {
        console.error('Error generating quiz:', error);
        res.status(500).json({ error: 'Failed to generate quiz' });
    }
});

// Get saved lessons (from MongoDB)
router.get('/saved', authMiddleware, async (req, res) => {
    try {
        // For now, return empty array - you can add a Lesson model later
        res.json({ lessons: [] });
    } catch (error) {
        console.error('Error fetching lessons:', error);
        res.status(500).json({ error: 'Failed to fetch lessons' });
    }
});

// Save lesson
router.post('/save', authMiddleware, async (req, res) => {
    try {
        const userId = req.session.userId;
        const { lesson } = req.body;
        
        // For now, just return success - you can add a Lesson model later
        res.json({ success: true, message: 'Lesson saved' });
    } catch (error) {
        console.error('Error saving lesson:', error);
        res.status(500).json({ error: 'Failed to save lesson' });
    }
});

module.exports = router;
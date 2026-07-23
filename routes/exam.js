const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const aiService = require('../services/aiService');
const userService = require('../services/userService');

// Exam page
router.get('/exam', authMiddleware, (req, res) => {
    res.render('exam', { questions: null });
});

// Generate exam with AI
router.post('/generateExam', authMiddleware, async (req, res) => {
    try {
        const { topic } = req.body;
        const examData = await aiService.generateExam(topic);
        
        res.render('exam', {
            questions: examData.questions,
            topic: topic
        });
    } catch (error) {
        console.error('Exam generation error:', error);
        res.status(500).send('Exam generation failed');
    }
});

// Submit exam
router.post('/submitExam', authMiddleware, async (req, res) => {
    try {
        const userId = req.session.userId;
        const { score, topic, totalQuestions } = req.body;

        const percentage = Math.round((score / totalQuestions) * 100);

        await userService.saveExamResult(userId, topic, percentage);

        res.json({
            success: true,
            score: percentage,
            message: percentage >= 70 ? 'Great job!' : 'Keep practicing!'
        });
    } catch (error) {
        console.error('Error submitting exam:', error);
        res.status(500).json({ error: 'Failed to submit exam' });
    }
});

// Get exam results
router.get('/results', authMiddleware, async (req, res) => {
    try {
        const userId = req.session.userId;
        const progress = await userService.getUserProgress(userId);
        
        res.render('results', {
            results: progress.examResults
        });
    } catch (error) {
        console.error('Error fetching results:', error);
        res.status(500).send('Error loading results');
    }
});

module.exports = router;
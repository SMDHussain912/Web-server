const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const aiService = require('../services/aiService');

// Career recommendations page
router.get('/info', authMiddleware, (req, res) => {
    res.render('info');
});

// Generate career recommendations
router.post('/getRecommendations', authMiddleware, async (req, res) => {
    try {
        const { skills, interests, education } = req.body;
        const recommendations = await aiService.getCareerRecommendations(
            skills, 
            interests, 
            education
        );
        
        res.json(recommendations);
    } catch (error) {
        console.error('Recommendation error:', error);
        res.status(500).json({ error: 'Failed to generate recommendations' });
    }
});

// Generate project details
router.post('/projectDetails', authMiddleware, async (req, res) => {
    try {
        const { title, explanation, examples } = req.body;
        const result = await aiService.generateProjectDetails(
            title, 
            explanation, 
            examples
        );
        
        res.json(result);
    } catch (error) {
        console.error('Project generation error:', error);
        res.status(500).json({ error: 'Failed to generate project' });
    }
});

module.exports = router;
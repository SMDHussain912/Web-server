const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const userService = require('../services/userService');
const fs = require('fs');
const path = require('path');
const LessonProgress = require('../models/LessonProgress');

// Load courses
const javaCourse = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../courses/java.json'), 'utf8')
);

// Courses list page
router.get('/courses', authMiddleware, (req, res) => {
    res.render('courses', {
        courses: [
            {
                id: 'java',
                title: 'Java with OOPs',
                description: 'Learn Java programming from basics to advanced OOP concepts',
                icon: '☕',
                lessons: javaCourse.lessons.length
            },
            {
                id: 'python',
                title: 'Python Programming',
                description: 'Master Python for web development, data science, and automation',
                icon: '🐍',
                lessons: 0
            },
            {
                id: 'web',
                title: 'Web Development',
                description: 'Build modern websites with HTML, CSS, and JavaScript',
                icon: '🌐',
                lessons: 0
            }
        ]
    });
});

// Java course roadmap
router.get('/course/java', authMiddleware, async (req, res) => {
    try {
        const userId = req.session.userId;
        const totalLessons = javaCourse.lessons.length;

        const progress = await LessonProgress.find({ 
            userId, 
            course: 'java' 
        });

        const completedLessons = progress.map(p => p.lesson);

        let lessons = javaCourse.lessons.map(l => {
            return {
                number: l.lesson_number,
                title: l.title,
                completed: completedLessons.includes(l.lesson_number),
                locked: l.lesson_number > completedLessons.length + 1
            };
        });

        res.render('course-roadmap', {
            courseId: 'java',
            courseTitle: 'Java with OOPs',
            lessons,
            completed: completedLessons.length,
            totalLessons
        });
    } catch (error) {
        console.error('Error loading course:', error);
        res.status(500).send('Error loading course');
    }
});

// Get specific lesson
router.get('/course/:courseId/lesson/:num', authMiddleware, (req, res) => {
    const { courseId, num } = req.params;
    const lessonNum = parseInt(num);

    let course;
    if (courseId === 'java') {
        course = javaCourse;
    } else {
        return res.status(404).send('Course not found');
    }

    const lesson = course.lessons[lessonNum - 1];

    if (!lesson) {
        return res.status(404).send('Lesson not found');
    }

    res.render('lesson', {
        courseId,
        lesson,
        lessonNumber: lessonNum,
        totalLessons: course.lessons.length
    });
});

// Complete lesson
router.post('/completeLesson', authMiddleware, async (req, res) => {
    try {
        const userId = req.session.userId;
        const { course, lesson } = req.body;

        await userService.saveLessonProgress(userId, course, lesson);

        res.json({ success: true });
    } catch (error) {
        console.error('Error completing lesson:', error);
        res.status(500).json({ error: 'Failed to save progress' });
    }
});

// Get bookmarks
router.get('/bookmarks', authMiddleware, async (req, res) => {
    try {
        const userId = req.session.userId;
        const bookmarks = await userService.getBookmarks(userId);
        res.render('bookmarks', { bookmarks });
    } catch (error) {
        console.error('Error fetching bookmarks:', error);
        res.status(500).send('Error loading bookmarks');
    }
});

// Add bookmark
router.post('/bookmarks', authMiddleware, async (req, res) => {
    try {
        const userId = req.session.userId;
        const { type, itemId, title } = req.body;

        await userService.addBookmark(userId, type, itemId, title);
        res.json({ success: true });
    } catch (error) {
        console.error('Error adding bookmark:', error);
        res.status(500).json({ error: 'Failed to add bookmark' });
    }
});

// Remove bookmark
router.delete('/bookmarks/:itemId', authMiddleware, async (req, res) => {
    try {
        const userId = req.session.userId;
        const { itemId } = req.params;

        await userService.removeBookmark(userId, itemId);
        res.json({ success: true });
    } catch (error) {
        console.error('Error removing bookmark:', error);
        res.status(500).json({ error: 'Failed to remove bookmark' });
    }
});

// Get notes for a course
router.get('/notes/:courseId', authMiddleware, async (req, res) => {
    try {
        const userId = req.session.userId;
        const { courseId } = req.params;
        const notes = await userService.getNotes(userId, courseId);
        res.json({ notes });
    } catch (error) {
        console.error('Error fetching notes:', error);
        res.status(500).json({ error: 'Failed to fetch notes' });
    }
});

// Save note
router.post('/notes', authMiddleware, async (req, res) => {
    try {
        const userId = req.session.userId;
        const { courseId, lessonId, content } = req.body;

        await userService.saveNote(userId, courseId, lessonId, content);
        res.json({ success: true });
    } catch (error) {
        console.error('Error saving note:', error);
        res.status(500).json({ error: 'Failed to save note' });
    }
});

module.exports = router;
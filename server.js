const express = require('express');
const session = require('express-session');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { exec } = require('child_process');
require('dotenv').config();

const config = require('./config/config');
const { initializeDatabase } = require('./config/database');
const courseService = require('./services/courseService');
const userService = require('./services/userService');
const lessonService = require('./services/lessonService');

// Import routes
const authRoutes = require('./routes/auth');
const examRoutes = require('./routes/exam');
const apiRoutes = require('./routes/api');

const app = express();

/* ================= SESSION CONFIGURATION ================= */

// Trust first proxy for session cookie security behind reverse proxies
// This is important for production deployments on Render, Heroku, etc.
// When behind a proxy, the session cookie's secure flag and IP-based
// session fixation protection work correctly.
app.set('trust proxy', 1); // Trust the first proxy chain

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(helmet());
app.use(
    rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // limit each IP to 100 requests per windowMs
        standardHeaders: true,
        legacyHeaders: false,
    })
);
// Configure CORS - restrict to specific origins in production
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : [];
app.use(
    (req, res, next) => {
        const origin = req.headers.origin;
        if (allowedOrigins.length > 0) {
            if (allowedOrigins.includes(origin)) {
                res.setHeader('Access-Control-Allow-Origin', origin);
            }
        } else {
            // Development: allow local origins
            if (
                origin &&
                (origin.startsWith('http://localhost') ||
                    origin.startsWith('http://127.0.0.1'))
            ) {
                res.setHeader('Access-Control-Allow-Origin', origin);
            }
        }
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader(
            'Access-Control-Allow-Headers',
            'Content-Type, Authorization'
        );
        if (req.method === 'OPTIONS') {
            return res.sendStatus(200);
        }
        next();
    }
);
app.use(session(config.session));
app.use("/", authRoutes);

// Serve React build if available
const clientBuildPath = path.join(__dirname, 'client/build');
const fs = require('fs');
if (fs.existsSync(clientBuildPath)) {
    console.log('✅ Serving React frontend from build folder');
app.use("/", authRoutes);
}

// Make session available to all routes
app.use((req, res, next) => {
    res.locals.userId = req.session.userId;
    next();
});

/* ================= AUTH MIDDLEWARE ================= */

const authMiddleware = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    next();
};

/* ================= AUTH ROUTES ================= */



/* ================= USER API ================= */

// Get current user
app.get("/api/me", authMiddleware, async (req, res) => {
    try {
        const User = require('./models/User');
        const user = await User.findById(req.session.userId);
        res.json({
            userId: user._id,
            email: user.email,
            name: user.name
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});

// Get user stats
app.get("/api/stats", authMiddleware, async (req, res) => {
    try {
        const stats = await userService.getUserStats(req.session.userId);
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
});

// Get user progress
app.get("/api/progress", authMiddleware, async (req, res) => {
    try {
        const progress = await userService.getUserProgress(req.session.userId);
        res.json(progress);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch progress' });
    }
});

// Update user profile
app.post("/api/profile", authMiddleware, async (req, res) => {
    try {
        const User = require('./models/User');
        const { name, bio, skills, interests } = req.body;
        await User.findByIdAndUpdate(req.session.userId, {
            name, bio,
            skills: skills || [],
            interests: interests || []
        });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

/* ================= COURSES API (Dynamic MongoDB System) ================= */

// Get all courses with optional filters
app.get("/api/courses", async (req, res) => {
    try {
        const { difficulty, category, search } = req.query;
        const courses = await courseService.getCourses({ difficulty, category, search });
        res.json({ courses });
    } catch (error) {
        res.status(500).json({ error: 'Failed to load courses' });
    }
});

// Get single course with all lessons
app.get("/api/courses/:courseId", async (req, res) => {
    try {
        const course = await courseService.getCourse(req.params.courseId);
        if (!course) return res.status(404).json({ error: 'Course not found' });
        res.json(course);
    } catch (error) {
        res.status(500).json({ error: 'Failed to load course' });
    }
});

// Get specific lesson from a course
app.get("/api/courses/:courseId/lesson/:lessonNumber", async (req, res) => {
    try {
        const lesson = await courseService.getLesson(req.params.courseId, req.params.lessonNumber);
        if (!lesson) return res.status(404).json({ error: 'Lesson not found' });
        res.json(lesson);
    } catch (error) {
        res.status(500).json({ error: 'Failed to load lesson' });
    }
});

// Complete a lesson
app.post("/api/courses/:courseId/lesson/:lessonNumber/complete", authMiddleware, async (req, res) => {
    try {
        await userService.saveLessonProgress(
            req.session.userId, 
            req.params.courseId, 
            parseInt(req.params.lessonNumber)
        );
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save progress' });
    }
});

// Create a new course
app.post("/api/courses", authMiddleware, async (req, res) => {
    try {
        const course = await courseService.createCourse({
            ...req.body,
            author: req.session.userId
        });
        res.json({ success: true, course });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create course' });
    }
});

// Add lesson to course
app.post("/api/courses/:courseId/lessons", authMiddleware, async (req, res) => {
    try {
        const course = await courseService.addLesson(req.params.courseId, req.body);
        res.json({ success: true, course });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add lesson' });
    }
});

// Delete course
app.delete("/api/courses/:courseId", authMiddleware, async (req, res) => {
    try {
        await courseService.deleteCourse(req.params.courseId);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete course' });
    }
});

// Get user's courses with progress
app.get("/api/my-courses", authMiddleware, async (req, res) => {
    try {
        const courses = await courseService.getUserCourses(req.session.userId);
        res.json({ courses });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch courses' });
    }
});

/* ================= AI LESSON GENERATOR ================= */

app.post("/api/lessons/generate", authMiddleware, async (req, res) => {
    try {
        const { topic, difficulty } = req.body;
        if (!topic) return res.status(400).json({ error: 'Topic is required' });
        
        const lesson = await lessonService.generateLesson(topic, difficulty || 'beginner');
        res.json({ success: true, lesson });
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate lesson' });
    }
});

app.post("/api/lessons/syllabus", authMiddleware, async (req, res) => {
    try {
        const { courseName, totalLessons } = req.body;
        if (!courseName) return res.status(400).json({ error: 'Course name is required' });
        
        const syllabus = await lessonService.generateCourseSyllabus(courseName, totalLessons || 10);
        res.json({ success: true, syllabus });
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate syllabus' });
    }
});

app.post("/api/lessons/quiz", authMiddleware, async (req, res) => {
    try {
        const { topic, numQuestions } = req.body;
        if (!topic) return res.status(400).json({ error: 'Topic is required' });
        
        const quiz = await lessonService.generateQuiz(topic, numQuestions || 10);
        res.json({ success: true, quiz });
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate quiz' });
    }
});

/* ================= BOOKMARKS & NOTES ================= */

app.get("/api/bookmarks", authMiddleware, async (req, res) => {
    try {
        const bookmarks = await userService.getBookmarks(req.session.userId);
        res.json({ bookmarks });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch bookmarks' });
    }
});

app.post("/api/bookmarks", authMiddleware, async (req, res) => {
    try {
        const { type, itemId, title } = req.body;
        await userService.addBookmark(req.session.userId, type, itemId, title);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add bookmark' });
    }
});

app.delete("/api/bookmarks/:itemId", authMiddleware, async (req, res) => {
    try {
        await userService.removeBookmark(req.session.userId, req.params.itemId);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to remove bookmark' });
    }
});

app.get("/api/notes", authMiddleware, async (req, res) => {
    try {
        const notes = await userService.getNotes(req.session.userId, req.query.courseId);
        res.json({ notes });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch notes' });
    }
});

app.post("/api/notes", authMiddleware, async (req, res) => {
    try {
        const { courseId, lessonId, content } = req.body;
        await userService.saveNote(req.session.userId, courseId, lessonId, content);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save note' });
    }
});

/* ================= ACHIEVEMENTS ================= */

app.get("/api/achievements", authMiddleware, async (req, res) => {
    try {
        const Achievement = require('./models/Achievement');
        const achievements = await Achievement.find({ userId: req.session.userId }).sort({ date: -1 });
        res.json({ achievements });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch achievements' });
    }
});

/* ================= CODE EXECUTION ================= */

// Code execution temporarily disabled until a properly isolated sandbox is available.
// Rule 5: Never execute user-submitted JavaScript using eval() or Function().
// Rule 6: Java execution also disabled until safe isolation is implemented.
app.post('/api/runCode', authMiddleware, (req, res) => {
    res
        .status(503)
        .json({
            error:
                'Code execution temporarily disabled. Please check back later for a secure implementation.',
        });
});

app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        version: '2.0.0'
    });
});

/* ================= SPA FALLBACK ================= */

// Serve React for all other routes (SPA support)
app.use((req, res) => {
    if (fs.existsSync(clientBuildPath)) {
        res.sendFile(path.join(clientBuildPath, 'index.html'));
    } else {
        res.json({ 
            message: '🚀 Career Navigator API',
            version: '2.0.0',
            note: 'React frontend not built. Run: cd client && npm install && npm run build'
        });
    }
});

/* ================= SERVER START ================= */

const PORT = config.port;

(async () => {
    // Initialize MongoDB
    await initializeDatabase(config.mongodb.uri);
    
    // Auto-seed courses from JSON to MongoDB
    await courseService.seedCoursesFromJSON();

    app.listen(PORT, () => {
        console.log('='.repeat(50));
        console.log(`🚀 Career Navigator v2.0.0`);
        console.log(`📡 Server running on http://localhost:${PORT}`);
        console.log(`📚 MongoDB: ${config.mongodb.uri}`);
        console.log('='.repeat(50));
    });
})();
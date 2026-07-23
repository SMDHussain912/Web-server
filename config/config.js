require('dotenv').config();

module.exports = {
    port: process.env.PORT || 3000,
    session: {
        secret: process.env.SESSION_SECRET || 'career-ai-secret-key-change-in-production',
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24, // 24 hours
            secure: process.env.NODE_ENV === 'production'
        }
    },
    mongodb: {
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/career-navigator'
    },
    ai: {
        apiKey: process.env.API_KEY,
        baseUrl: 'https://openrouter.ai/api/v1/chat/completions',
        model: 'openai/gpt-4o-mini'
    },
    java: {
        timeout: 5000,
        tempDir: './temp'
    }
};